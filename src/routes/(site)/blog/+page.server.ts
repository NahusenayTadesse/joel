import { listPosts, postTags } from '$lib/server/posts';

export const load = async ({ url }) => {
	const tag = url.searchParams.get('tag') ?? '';
	const [posts, tags] = await Promise.all([listPosts({ tag }), postTags()]);
	return { posts, tags, tag: tags.includes(tag) ? tag : '' };
};
