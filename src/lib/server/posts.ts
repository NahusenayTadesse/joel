import { and, desc, eq, isNull, lte, sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { post } from '$lib/server/db/schema';
import { cached } from '$lib/server/cache';

/*
 * The blog. A post is public when it is published, its time has come and it is not deleted;
 * a future `publishedAt` therefore schedules it. Drizzle stores `datetime` in UTC, so the time
 * has come by `utc_timestamp()`, not `now()`, which is the server's local time (Addis Ababa:
 * three hours ahead, which put scheduled posts out three hours early). Posts are in one language each and are listed
 * on both versions of the site, marked with their language.
 */

const isPublic = () =>
	and(
		eq(post.status, 'published'),
		lte(post.publishedAt, sql`utc_timestamp()`),
		isNull(post.deletedAt)
	);

const cardColumns = {
	id: post.id,
	slug: post.slug,
	title: post.title,
	excerpt: post.excerpt,
	cover: post.cover,
	tags: post.tags,
	locale: post.locale,
	readingMinutes: post.readingMinutes,
	publishedAt: post.publishedAt,
	isFeatured: post.isFeatured
};

/*
 * Cached for a minute like the rest of the site; a scheduled post therefore appears within a
 * minute of its time, which is close enough for a blog.
 */
const readPosts = cached(() =>
	db.select(cardColumns).from(post).where(isPublic()).orderBy(desc(post.publishedAt))
);

export type PostCard = Awaited<ReturnType<typeof readPosts>>[number];

/** Public posts, newest first, optionally under one tag. */
export async function listPosts({ tag = '' }: { tag?: string } = {}) {
	const posts = await readPosts(null);
	return tag ? posts.filter((p) => p.tags?.includes(tag)) : posts;
}

/** Every tag in use, most used first. */
export async function postTags() {
	const counts = new Map<string, number>();
	for (const p of await readPosts(null)) {
		for (const tag of p.tags ?? []) counts.set(tag, (counts.get(tag) ?? 0) + 1);
	}
	return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([tag]) => tag);
}

/**
 * One post by its address. `preview` (a signed-in editor) also opens drafts and scheduled posts,
 * so a post can be read on the real page before it goes out.
 */
export async function postBySlug(slug: string, preview = false) {
	const [row] = await db
		.select()
		.from(post)
		.where(and(eq(post.slug, slug), isNull(post.deletedAt), preview ? undefined : isPublic()))
		.limit(1);
	return row ?? null;
}
