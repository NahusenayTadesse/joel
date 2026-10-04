import { and, count, desc, eq, sql } from 'drizzle-orm';
import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import { siteSettings, youtubeVideo } from '$lib/server/db/schema';

/*
 * The Videos page's source: Joel's YouTube uploads, copied into `youtube_video`.
 *
 * **The feed.** Every channel has a public Atom feed at
 * `youtube.com/feeds/videos.xml?channel_id=…`: free, no key, no quota, and it carries the title,
 * description, view count and whether a video is a Short. It lists only the latest 15 uploads,
 * so every video seen is kept here — the archive grows as Joel publishes.
 *
 * **The backfill (optional).** With `YOUTUBE_API_KEY` set (YouTube Data API v3, free, 10,000
 * units a day — a full backfill of a few hundred videos costs about 20), the whole upload
 * history is read once a day as well, so older videos appear too.
 *
 * **Freshness.** Pages read the table and never wait on YouTube, except the very first time
 * when it is empty. A read older than `STALE_MS` starts a sync in the background; the next view
 * shows its result.
 */

const STALE_MS = 30 * 60_000;
const BACKFILL_MS = 24 * 60 * 60_000;
const FETCH_TIMEOUT_MS = 10_000;

export type FeedVideo = {
	videoId: string;
	title: string;
	description: string | null;
	publishedAt: Date;
	views: number | null;
	isShort: boolean;
};

/** XML's five entities and numeric references; the feed uses nothing else. */
function decode(text: string): string {
	return text
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&apos;/g, "'")
		.replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
		.replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
		.replace(/&amp;/g, '&');
}

/**
 * The videos in a channel feed. A regular-expression reader rather than an XML library: the
 * feed's shape is fixed and flat, and each field is read on its own, so an entry missing one
 * (a premiere with no views yet) still comes through.
 */
export function parseFeed(xml: string): FeedVideo[] {
	const videos: FeedVideo[] = [];
	for (const [, entry] of xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)) {
		const field = (pattern: RegExp) => entry.match(pattern)?.[1];
		const videoId = field(/<yt:videoId>([^<]+)<\/yt:videoId>/);
		const title = field(/<title>([^<]*)<\/title>/);
		const published = field(/<published>([^<]+)<\/published>/);
		if (!videoId || !title || !published) continue;
		const views = field(/<media:statistics views="(\d+)"/);
		const description = field(/<media:description>([\s\S]*?)<\/media:description>/);
		const link = field(/<link rel="alternate" href="([^"]+)"/) ?? '';
		videos.push({
			videoId,
			title: decode(title).trim(),
			description: description ? decode(description).trim() || null : null,
			publishedAt: new Date(published),
			views: views ? Number(views) : null,
			isShort: link.includes('/shorts/')
		});
	}
	return videos;
}

async function fetchText(url: string): Promise<string> {
	const response = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
	if (!response.ok) throw new Error(`${response.status} from ${new URL(url).host}`);
	return response.text();
}

/**
 * Writes videos in, new or updated. The title, description, views and Short flag follow
 * YouTube; `status` and `isFeatured` are Joel's choices in the dashboard and are never touched.
 */
async function upsert(videos: FeedVideo[]) {
	if (!videos.length) return;
	await db
		.insert(youtubeVideo)
		.values(videos)
		.onDuplicateKeyUpdate({
			set: {
				title: sql`values(${youtubeVideo.title})`,
				description: sql`values(${youtubeVideo.description})`,
				views: sql`coalesce(values(${youtubeVideo.views}), ${youtubeVideo.views})`,
				// A video the feed calls a Short stays one; a backfill (which cannot tell) never
				// turns one back.
				isShort: sql`${youtubeVideo.isShort} or values(${youtubeVideo.isShort})`,
				syncedAt: sql`current_timestamp`
			}
		});
}

/* ─── The Data API backfill ──────────────────────────────────────────────────────────────── */

/** ISO 8601 duration → seconds: `PT1M5S` → 65. */
function seconds(duration: string): number {
	const m = duration.match(/^P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
	if (!m) return 0;
	return (
		Number(m[1] ?? 0) * 86400 +
		Number(m[2] ?? 0) * 3600 +
		Number(m[3] ?? 0) * 60 +
		Number(m[4] ?? 0)
	);
}

async function backfill(channelId: string, key: string) {
	// A channel's uploads playlist is its id with UC → UU.
	const playlist = `UU${channelId.slice(2)}`;
	const api = 'https://www.googleapis.com/youtube/v3';
	let pageToken = '';
	// Twenty pages of fifty is a thousand videos: far past this channel, and a bound on a loop
	// that talks to someone else's server.
	for (let page = 0; page < 20; page++) {
		const list = JSON.parse(
			await fetchText(
				`${api}/playlistItems?part=contentDetails&maxResults=50&playlistId=${playlist}&key=${key}${pageToken ? `&pageToken=${pageToken}` : ''}`
			)
		) as { items?: { contentDetails: { videoId: string } }[]; nextPageToken?: string };
		const ids = (list.items ?? []).map((item) => item.contentDetails.videoId);
		if (!ids.length) break;

		const details = JSON.parse(
			await fetchText(
				`${api}/videos?part=snippet,statistics,contentDetails&id=${ids.join(',')}&key=${key}`
			)
		) as {
			items?: {
				id: string;
				snippet: {
					title: string;
					description: string;
					publishedAt: string;
					liveBroadcastContent: string;
				};
				statistics?: { viewCount?: string };
				contentDetails: { duration: string };
			}[];
		};
		await upsert(
			(details.items ?? [])
				// An upcoming premiere or a live stream is not a video to play yet.
				.filter((v) => v.snippet.liveBroadcastContent === 'none')
				.map((v) => ({
					videoId: v.id,
					title: v.snippet.title,
					description: v.snippet.description || null,
					publishedAt: new Date(v.snippet.publishedAt),
					views: v.statistics?.viewCount ? Number(v.statistics.viewCount) : null,
					// The API does not say "Short"; a minute or less is the safe reading of one.
					isShort: seconds(v.contentDetails.duration) <= 60
				}))
		);

		if (!list.nextPageToken) break;
		pageToken = list.nextPageToken;
	}
}

/* ─── Keeping it fresh ───────────────────────────────────────────────────────────────────── */

let lastSync = 0;
let lastBackfill = 0;
let running: Promise<void> | null = null;

async function channelId(): Promise<string | null> {
	const [row] = await db.select({ id: siteSettings.youtubeChannelId }).from(siteSettings).limit(1);
	const id = row?.id?.trim();
	return id && /^UC[\w-]{22}$/.test(id) ? id : null;
}

/** Reads the feed (and, once a day with a key, the whole history) into the table. */
export async function syncYoutube(): Promise<{ synced: number }> {
	const id = await channelId();
	if (!id) return { synced: 0 };
	const videos = parseFeed(
		await fetchText(`https://www.youtube.com/feeds/videos.xml?channel_id=${id}`)
	);
	await upsert(videos);
	lastSync = Date.now();

	const key = env.YOUTUBE_API_KEY;
	if (key && Date.now() - lastBackfill > BACKFILL_MS) {
		lastBackfill = Date.now();
		try {
			await backfill(id, key);
		} catch (err) {
			console.error('YouTube backfill failed:', err);
		}
	}
	return { synced: videos.length };
}

/** One sync at a time, however many pages ask for one. */
function startSync(): Promise<void> {
	running ??= syncYoutube()
		.then(() => undefined)
		.catch((err) => {
			// Mark it tried anyway, so a YouTube outage is not retried on every page view.
			lastSync = Date.now();
			console.error('YouTube sync failed:', err);
		})
		.finally(() => (running = null));
	return running;
}

/**
 * Called by every page that shows videos. Waits only when there is nothing to show yet;
 * otherwise refreshes in the background when the last sync is older than half an hour.
 */
async function ensureFresh() {
	if (Date.now() - lastSync < STALE_MS) return;
	const [{ n }] = await db.select({ n: count() }).from(youtubeVideo);
	if (n === 0) await startSync();
	else void startSync();
}

/* ─── Reading ────────────────────────────────────────────────────────────────────────────── */

export type Video = {
	videoId: string;
	title: string;
	description: string | null;
	publishedAt: Date;
	views: number | null;
	isShort: boolean;
	isFeatured: boolean;
};

const columns = {
	videoId: youtubeVideo.videoId,
	title: youtubeVideo.title,
	description: youtubeVideo.description,
	publishedAt: youtubeVideo.publishedAt,
	views: youtubeVideo.views,
	isShort: youtubeVideo.isShort,
	isFeatured: youtubeVideo.isFeatured
};

/** Shown videos, newest first; `kind` narrows to long videos or Shorts. */
export async function listVideos({
	kind = 'all',
	limit = 24,
	offset = 0
}: { kind?: 'all' | 'videos' | 'shorts'; limit?: number; offset?: number } = {}) {
	await ensureFresh();
	const where = and(
		eq(youtubeVideo.status, true),
		kind === 'all' ? undefined : eq(youtubeVideo.isShort, kind === 'shorts')
	);
	const [rows, [{ total }]] = await Promise.all([
		db
			.select(columns)
			.from(youtubeVideo)
			.where(where)
			.orderBy(desc(youtubeVideo.publishedAt))
			.limit(limit)
			.offset(offset),
		db.select({ total: count() }).from(youtubeVideo).where(where)
	]);
	return { videos: rows as Video[], total };
}

/** The video for the big player: the one Joel featured, or else the newest long video. */
export async function headlineVideo(): Promise<Video | null> {
	await ensureFresh();
	const [featured] = await db
		.select(columns)
		.from(youtubeVideo)
		.where(and(eq(youtubeVideo.status, true), eq(youtubeVideo.isFeatured, true)))
		.orderBy(desc(youtubeVideo.publishedAt))
		.limit(1);
	if (featured) return featured;
	const [latest] = await db
		.select(columns)
		.from(youtubeVideo)
		.where(and(eq(youtubeVideo.status, true), eq(youtubeVideo.isShort, false)))
		.orderBy(desc(youtubeVideo.publishedAt))
		.limit(1);
	return latest ?? null;
}
