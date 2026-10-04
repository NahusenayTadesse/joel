import { error, fail } from '@sveltejs/kit';
import { and, asc, eq, isNull, max } from 'drizzle-orm';
import { message, setError, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { redirect, setFlash } from 'sveltekit-flash-message/server';
import { childCrud } from '@nahu/admin-kit/server/childCrud';
import {
	postedForm,
	saveUploadedFile,
	storeFileFields,
	UploadRefused
} from '@nahu/admin-kit/server/files';
import { db } from '$lib/server/db';
import { project, projectImage } from '$lib/server/db/schema';
import { blankToNull } from '$lib/server/blank';
import { sanitizeRichHtml } from '$lib/server/sanitize';
import { uniqueSlug } from '$lib/server/slug';
import { imageEditSchema, imagesAddSchema, projectSchema } from '../schema';
import type { Actions, PageServerLoad } from './$types';

/*
 * One project's editor: its fields, its write-up and its gallery. `/dashboard/projects/new` is
 * the same page with nothing loaded; saving it creates the row and moves to its own address,
 * where the gallery opens up (images need a project to belong to).
 */

/** Edit and delete of gallery rows, scoped to the project in the address. Adding is `addImages`. */
const images = childCrud({
	table: projectImage,
	ownerColumn: 'projectId',
	label: 'Image',
	// Unused: images are added several at a time by `addImages`, which childCrud has no shape for.
	addSchema: imageEditSchema.omit({ id: true }),
	editSchema: imageEditSchema,
	uniqueField: 'fileName',
	transform: blankToNull
});

/** The id in the address; `null` for `new`. Anything else is not a page. */
function idOf(param: string): number | null {
	if (param === 'new') return null;
	const id = Number(param);
	if (!Number.isInteger(id) || id <= 0) error(404, 'Project not found');
	return id;
}

async function current(id: number) {
	const [row] = await db
		.select()
		.from(project)
		.where(and(eq(project.id, id), isNull(project.deletedAt)))
		.limit(1);
	if (!row) error(404, 'Project not found');
	return row;
}

/** A project id from the address, which must exist: the gallery actions have nothing to add to otherwise. */
async function existingId(param: string) {
	const id = idOf(param);
	if (id === null) error(404, 'Save the project first');
	await current(id);
	return id;
}

export const load: PageServerLoad = async ({ params }) => {
	const id = idOf(params.id);
	if (id === null) {
		return {
			id: null,
			form: await superValidate(zod4(projectSchema)),
			cover: null,
			slug: null,
			status: true,
			gallery: null
		};
	}

	const row = await current(id);
	// The form's fields, with NULL as ''. The cover is a file input and starts empty; its stored
	// name goes to the page on its own, for the preview.
	const values = Object.fromEntries(
		Object.keys(projectSchema.shape)
			.filter((key) => key !== 'cover')
			.map((key) => [key, row[key as keyof typeof row] ?? ''])
	);
	const gallery = await images.load(id);

	return {
		id,
		form: await superValidate(values, zod4(projectSchema), { errors: false }),
		cover: row.cover,
		slug: row.slug,
		status: row.status,
		gallery: {
			...gallery,
			// childCrud lists by id; the site shows them by `sortOrder`, so the editor does too.
			rows: (gallery.rows as (typeof projectImage.$inferSelect)[]).toSorted(
				(a, b) => a.sortOrder - b.sortOrder || a.id - b.id
			),
			addForm: await superValidate(zod4(imagesAddSchema))
		}
	};
};

export const actions: Actions = {
	save: async (event) => {
		const { request, params, locals } = event;
		const id = idOf(params.id);
		const posted = await postedForm(request);
		const form = await superValidate(posted, zod4(projectSchema));
		if (!form.valid) {
			return message(
				form,
				{ type: 'error', text: 'Check the highlighted fields.' },
				{ status: 400 }
			);
		}

		const values: Record<string, unknown> = { ...form.data };
		try {
			// A new cover is saved and named; none keeps the stored one; the ✕ clears it.
			await storeFileFields(values, ['cover'], posted);
		} catch (err) {
			if (err instanceof UploadRefused) return setError(form, 'cover', err.message);
			throw err;
		}
		blankToNull(values);
		values.body = sanitizeRichHtml(form.data.body) || null;
		values.bodyAm = sanitizeRichHtml(form.data.bodyAm) || null;
		values.slug = await uniqueSlug(project, form.data.slug || form.data.title, {
			ignoreId: id ?? 0,
			fallback: 'project'
		});
		values.updatedBy = locals.user?.id;

		if (id === null) {
			const [created] = await db
				.insert(project)
				.values(values as typeof project.$inferInsert)
				.$returningId();
			redirect(
				303,
				`/dashboard/projects/${created.id}`,
				{ type: 'success', message: 'Project created. Add its gallery below.' },
				event
			);
		}

		await current(id);
		await db
			.update(project)
			.set(values as Partial<typeof project.$inferInsert>)
			.where(eq(project.id, id));
		// The slug may have changed (made unique, or edited): send it back so the form shows it.
		form.data.slug = values.slug as string;
		return message(form, { type: 'success', text: 'Project saved.' });
	},

	/** Soft delete: the row stays, its address and images leave the site. */
	delete: async (event) => {
		const id = await existingId(event.params.id);
		await db
			.update(project)
			.set({ deletedAt: new Date(), deletedBy: event.locals.user?.id })
			.where(eq(project.id, id));
		redirect(303, '/dashboard/projects', { type: 'success', message: 'Project deleted.' }, event);
	},

	/** Several images at once, each a row, after the ones already there. */
	addImages: async (event) => {
		const id = await existingId(event.params.id);
		const form = await superValidate(event.request, zod4(imagesAddSchema));
		// Files cannot travel back in the answer; the picker is emptied either way.
		const files = form.data.images;
		form.data.images = [];
		if (!form.valid) return fail(400, { form });

		const [{ last }] = await db
			.select({ last: max(projectImage.sortOrder) })
			.from(projectImage)
			.where(and(eq(projectImage.projectId, id), isNull(projectImage.deletedAt)));
		let order = (last ?? -1) + 1;

		const saved: string[] = [];
		try {
			for (const file of files) saved.push(await saveUploadedFile(file));
		} catch (err) {
			if (err instanceof UploadRefused) {
				return message(form, { type: 'error', text: err.message }, { status: 400 });
			}
			throw err;
		}
		await db
			.insert(projectImage)
			.values(saved.map((fileName) => ({ projectId: id, fileName, sortOrder: order++ })));
		return message(form, {
			type: 'success',
			text: saved.length === 1 ? 'Image added.' : `${saved.length} images added.`
		});
	},

	editImage: async (event) => images.actions.edit(event, await existingId(event.params.id)),

	deleteImage: async (event) => {
		const id = await existingId(event.params.id);
		const result = await images.actions.delete(event, id);
		setFlash({ type: 'success', message: 'Image removed.' }, event.cookies);
		return result;
	},

	/**
	 * Moves an image one place earlier or later. The order is renumbered 0, 1, 2… first, so a
	 * gallery whose images all share an order (or have gaps) still moves one step at a time.
	 */
	moveImage: async (event) => {
		const id = await existingId(event.params.id);
		const posted = await event.request.formData();
		const imageId = Number(posted.get('id'));
		const step = posted.get('direction') === 'up' ? -1 : 1;

		await db.transaction(async (tx) => {
			const rows = await tx
				.select({ id: projectImage.id })
				.from(projectImage)
				.where(and(eq(projectImage.projectId, id), isNull(projectImage.deletedAt)))
				.orderBy(asc(projectImage.sortOrder), asc(projectImage.id));
			const from = rows.findIndex((row) => row.id === imageId);
			const to = from + step;
			if (from === -1 || to < 0 || to >= rows.length) return;
			[rows[from], rows[to]] = [rows[to], rows[from]];
			for (const [index, row] of rows.entries()) {
				await tx.update(projectImage).set({ sortOrder: index }).where(eq(projectImage.id, row.id));
			}
		});
		return { moved: true };
	}
};
