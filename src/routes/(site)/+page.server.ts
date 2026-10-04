import { getLocale } from '$lib/paraglide/runtime';
import { submitInquiry } from '$lib/server/inquiry';
import { listPosts } from '$lib/server/posts';
import { featuredProjects } from '$lib/server/projects';
import { headlineVideo, listVideos } from '$lib/server/youtube';

export const load = async () => {
	const locale = getLocale();
	const [projects, headline, { videos }, posts] = await Promise.all([
		featuredProjects(locale, 3),
		headlineVideo().catch(() => null),
		listVideos({ kind: 'videos', limit: 4 }).catch(() => ({ videos: [] })),
		listPosts()
	]);
	return {
		projects,
		headline,
		// Three beside the big one, never the big one twice.
		videos: videos.filter((v) => v.videoId !== headline?.videoId).slice(0, 3),
		posts: posts.slice(0, 3)
	};
};

export const actions = { inquire: (event) => submitInquiry(event) };
