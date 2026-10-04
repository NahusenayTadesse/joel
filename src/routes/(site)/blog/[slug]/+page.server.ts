import { error } from '@sveltejs/kit';
import { listPosts, postBySlug } from '$lib/server/posts';

export const load = async ({ params, url, locals, setHeaders }) => {
	// Drafts and scheduled posts open for a signed-in editor asking for a preview, never cached.
	const preview = url.searchParams.has('preview') && Boolean(locals.user);
	const post = await postBySlug(params.slug, preview);
	if (!post) error(404, 'Not found');
	if (preview) setHeaders({ 'cache-control': 'private, no-store' });

	const isLive =
		post.status === 'published' && post.publishedAt !== null && post.publishedAt <= new Date();
	// Two more to read next: sharing a tag first, then simply the newest.
	const others = (await listPosts()).filter((p) => p.id !== post.id);
	const related = [
		...others.filter((p) => p.tags?.some((tag) => post.tags?.includes(tag))),
		...others
	]
		.filter((p, i, all) => all.indexOf(p) === i)
		.slice(0, 2);

	return { post, related, preview: preview && !isLive };
};
