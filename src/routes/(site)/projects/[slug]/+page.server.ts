import { error } from '@sveltejs/kit';
import { getLocale } from '$lib/paraglide/runtime';
import { projectBySlug } from '$lib/server/projects';

export const load = async ({ params }) => {
	const project = await projectBySlug(params.slug, getLocale());
	if (!project) error(404, 'Not found');
	return { project };
};
