import { desc, isNull } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { post } from '$lib/server/db/schema';

/** Every post that is not deleted, newest first: drafts at the top, then by publication. */
export const load = async () => {
	const rows = await db
		.select({
			id: post.id,
			title: post.title,
			slug: post.slug,
			status: post.status,
			locale: post.locale,
			publishedAt: post.publishedAt,
			isFeatured: post.isFeatured,
			updatedAt: post.updatedAt
		})
		.from(post)
		.where(isNull(post.deletedAt))
		.orderBy(desc(isNull(post.publishedAt)), desc(post.publishedAt), desc(post.id));
	return { rows };
};
