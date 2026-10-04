import { servePublicFile } from '@nahu/admin-kit/server/servePublicFile';
import { publicFileNames } from '$lib/server/site';

/** The public page's files — `publicFileUrl(name)` points here. Anything else is a 404. */
export const GET = servePublicFile({
	isPublic: async (name) => (await publicFileNames(null)).has(name)
});
