import { getLocale } from '$lib/paraglide/runtime';
import { listProjects } from '$lib/server/projects';

export const load = async () => ({ projects: await listProjects(getLocale()) });
