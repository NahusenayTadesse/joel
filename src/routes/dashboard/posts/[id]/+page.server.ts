import { error } from '@sveltejs/kit';
import { and, eq, isNull } from 'drizzle-orm';
import { message, setError, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { redirect } from 'sveltekit-flash-message/server';
import { postedForm, storeFileFields, UploadRefused } from '@nahu/admin-kit/server/files';
import { db } from '$lib/server/db';
import { post } from '$lib/server/db/schema';
import { htmlToText, readingMinutes, sanitizeRichHtml, summarize } from '$lib/server/sanitize';
import { uniqueSlug } from '$lib/server/slug';
import { postSchema } from '../schema';
import type { Actions, PageServerLoad } from './$types';

/*
 * One post's editor; `/dashboard/posts/new` is the same page with nothing loaded. Publication
 * times are entered and shown in Addis Ababa time (UTC+3, no daylight saving), whatever the
 * browser's or the server's own zone.
 */

const ADDIS = '+03:00';

/** A stored time as the `datetime-local` field shows it: `2026-10-01T09:30`, Addis Ababa time. */
function toField(value: Date | null): string {
	if (!value) return '';
	const addis = new Date(value.getTime() + 3 * 3_600_000);
	return addis.toISOString().slice(0, 16);
}

/** The field's value back to an instant. */
const fromField = (value: string) => new Date(`${value}:00${ADDIS}`);

function idOf(param: string): number | null {
	if (param === 'new') return null;
	const id = Number(param);
	if (!Number.isInteger(id) || id <= 0) error(404, 'Post not found');
	return id;
}

async function current(id: number) {
	const [row] = await db
		.select()
		.from(post)
		.where(and(eq(post.id, id), isNull(post.deletedAt)))
		.limit(1);
	if (!row) error(404, 'Post not found');
	return row;
}

export const load: PageServerLoad = async ({ params }) => {
	const id = idOf(params.id);
	if (id === null) {
		return {
			id: null,
			form: await superValidate(zod4(postSchema)),
			cover: null,
			slug: null
		};
	}
	const row = await current(id);
	const values = {
		title: row.title,
		slug: row.slug,
		excerpt: row.excerpt ?? '',
		tags: (row.tags ?? []).join('\n'),
		locale: row.locale,
		status: row.status,
		publishedAt: toField(row.publishedAt),
		isFeatured: row.isFeatured,
		body: row.body
	};
	return {
		id,
		form: await superValidate(values, zod4(postSchema), { errors: false }),
		cover: row.cover,
		slug: row.slug
	};
};

export const actions: Actions = {
	save: async (event) => {
		const id = idOf(event.params.id);
		const posted = await postedForm(event.request);
		const form = await superValidate(posted, zod4(postSchema));
		if (!form.valid) {
			return message(
				form,
				{ type: 'error', text: 'Check the highlighted fields.' },
				{ status: 400 }
			);
		}

		const data = form.data;
		const values: Record<string, unknown> = { cover: data.cover };
		try {
			await storeFileFields(values, ['cover'], posted);
		} catch (err) {
			if (err instanceof UploadRefused) return setError(form, 'cover', err.message);
			throw err;
		}

		const body = sanitizeRichHtml(data.body);
		const text = htmlToText(body);
		// Publishing with no time set means now; a draft keeps whatever time it was given.
		const publishedAt = data.publishedAt
			? fromField(data.publishedAt)
			: data.status === 'published'
				? new Date()
				: null;

		Object.assign(values, {
			title: data.title,
			slug: await uniqueSlug(post, data.slug || data.title, {
				ignoreId: id ?? 0,
				fallback: 'post'
			}),
			excerpt: data.excerpt?.trim() || (text ? summarize(text, 200) : null),
			tags: (data.tags ?? '')
				.split('\n')
				.map((tag) => tag.trim())
				.filter(Boolean),
			locale: data.locale,
			status: data.status,
			publishedAt,
			isFeatured: data.isFeatured,
			body,
			readingMinutes: readingMinutes(text),
			updatedBy: event.locals.user?.id
		});

		if (id === null) {
			const [created] = await db
				.insert(post)
				.values(values as typeof post.$inferInsert)
				.$returningId();
			redirect(
				303,
				`/dashboard/posts/${created.id}`,
				{
					type: 'success',
					message: data.status === 'published' ? 'Post published.' : 'Draft saved.'
				},
				event
			);
		}

		await current(id);
		await db
			.update(post)
			.set(values as Partial<typeof post.$inferInsert>)
			.where(eq(post.id, id));
		// What the server settled on goes back into the form: the unique slug, the time now set.
		form.data.slug = values.slug as string;
		form.data.publishedAt = toField(publishedAt);
		form.data.excerpt = (values.excerpt as string | null) ?? '';
		return message(form, {
			type: 'success',
			text: data.status === 'published' ? 'Post saved and published.' : 'Draft saved.'
		});
	},

	delete: async (event) => {
		const id = idOf(event.params.id);
		if (id === null) error(404, 'Post not found');
		await current(id);
		await db
			.update(post)
			.set({ deletedAt: new Date(), deletedBy: event.locals.user?.id })
			.where(eq(post.id, id));
		redirect(303, '/dashboard/posts', { type: 'success', message: 'Post deleted.' }, event);
	}
};
