import { fail } from '@sveltejs/kit';
import { contentCrud } from '@nahu/admin-kit/server/crud';
import { setFlash } from 'sveltekit-flash-message/server';
import { youtubeVideo } from '$lib/server/db/schema';
import { syncYoutube } from '$lib/server/youtube';
import { editSchema } from './schema';

const crud = contentCrud({
	table: youtubeVideo,
	label: 'Video',
	// Unused: videos come from YouTube, never from here (`fixedRows`).
	addSchema: editSchema,
	editSchema,
	uniqueField: 'videoId'
});

/** Newest first: the kit lists in id order, which is the order videos were first seen. */
export const load = async () => {
	const loaded = await crud.load();
	return {
		...loaded,
		rows: loaded.rows.toSorted((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
	};
};

export const actions = {
	edit: crud.actions.edit,

	/** Reads the channel now rather than waiting for the half-hourly refresh. */
	sync: async ({ cookies }) => {
		try {
			const { synced } = await syncYoutube();
			setFlash(
				synced
					? { type: 'success', message: `Read ${synced} videos from YouTube.` }
					: { type: 'error', message: 'No channel is set: add its id under Site settings.' },
				cookies
			);
			return { synced };
		} catch (err) {
			console.error('YouTube sync from the dashboard failed:', err);
			setFlash(
				{ type: 'error', message: 'YouTube could not be reached. Try again in a minute.' },
				cookies
			);
			return fail(502, { synced: 0 });
		}
	}
};
