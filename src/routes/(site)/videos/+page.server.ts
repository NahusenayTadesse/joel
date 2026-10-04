import { headlineVideo, listVideos } from '$lib/server/youtube';

const PAGE = 12;
const KINDS = ['all', 'videos', 'shorts'] as const;
type Kind = (typeof KINDS)[number];

export const load = async ({ url }) => {
	const asked = url.searchParams.get('kind');
	const kind: Kind = KINDS.includes(asked as Kind) ? (asked as Kind) : 'all';
	// "Show more" asks for the next page by growing the count, so the page stays one link.
	const pages = Math.min(20, Math.max(1, Number(url.searchParams.get('pages')) || 1));

	const [headline, list, shortsCount] = await Promise.all([
		kind === 'shorts' ? null : headlineVideo().catch(() => null),
		listVideos({ kind, limit: PAGE * pages + 1 }).catch(() => ({ videos: [], total: 0 })),
		// Whether there are Shorts at all: the filter is pointless, and its tab empty, without them.
		listVideos({ kind: 'shorts', limit: 0 })
			.then((r) => r.total)
			.catch(() => 0)
	]);
	const videos = list.videos.filter((v) => v.videoId !== headline?.videoId).slice(0, PAGE * pages);
	return {
		kind,
		pages,
		headline,
		videos,
		hasMore: list.total - (headline ? 1 : 0) > videos.length,
		hasShorts: shortsCount > 0
	};
};
