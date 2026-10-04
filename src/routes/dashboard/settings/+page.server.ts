import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { message, setError, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { postedForm, storeFileFields, UploadRefused } from '@nahu/admin-kit/server/files';
import { db } from '$lib/server/db';
import { siteSettings } from '$lib/server/db/schema';
import { blankToNull } from '$lib/server/blank';
import { settingsSchema } from './schema';
import type { Actions, PageServerLoad } from './$types';

/** One item per line in the form, a list in the column. */
const toLines = (list: string[] | null) => list?.join('\n') ?? '';
const fromLines = (text: unknown) =>
	typeof text === 'string'
		? text
				.split('\n')
				.map((line) => line.trim())
				.filter(Boolean)
		: [];

/** Columns holding a stored file: file inputs in the form, which start empty. */
const FILE_FIELDS = ['portrait', 'mediaKit'] as const;
/** Columns holding a list, typed one item per line. */
const LIST_FIELDS = ['customTags', 'customTagsAm', 'packageNotes', 'packageNotesAm'] as const;

async function current() {
	const [row] = await db.select().from(siteSettings).limit(1);
	if (!row) error(503, 'There are no settings yet — run `npm run db:seed`.');
	return row;
}

export const load: PageServerLoad = async () => {
	const row = await current();
	// Every column the form edits, with NULL as '' and the lists as lines. The file inputs start
	// empty; the stored names go to the page separately, for the previews.
	const values = Object.fromEntries(
		Object.keys(settingsSchema.shape)
			.filter((key) => !(FILE_FIELDS as readonly string[]).includes(key))
			.map((key) => [key, row[key as keyof typeof row] ?? ''])
	);
	for (const key of LIST_FIELDS) values[key] = toLines(row[key]);

	return {
		form: await superValidate(values, zod4(settingsSchema), { errors: false }),
		portrait: row.portrait,
		mediaKit: row.mediaKit
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const posted = await postedForm(request);
		const form = await superValidate(posted, zod4(settingsSchema));
		if (!form.valid) {
			return message(
				form,
				{ type: 'error', text: 'Check the highlighted fields.' },
				{ status: 400 }
			);
		}

		const values: Record<string, unknown> = { ...form.data };
		try {
			// A new file is saved and named; none keeps the stored one; the ✕ clears it.
			await storeFileFields(values, FILE_FIELDS, posted);
		} catch (err) {
			// `setError` answers 400 with the file taken out of the form, which cannot travel back.
			if (err instanceof UploadRefused) {
				const field = err.field === 'mediaKit' ? 'mediaKit' : 'portrait';
				return setError(form, field, err.message);
			}
			throw err;
		}
		for (const key of LIST_FIELDS) values[key] = fromLines(values[key]);
		blankToNull(values);

		const row = await current();
		await db
			.update(siteSettings)
			.set({ ...values, updatedBy: locals.user?.id } as Partial<typeof siteSettings.$inferInsert>)
			.where(eq(siteSettings.id, row.id));

		return message(form, { type: 'success', text: 'Settings saved.' });
	}
};
