import { z } from 'zod/v4';
import { POST_LOCALES, POST_STATUSES } from '$lib/content';
import {
	choices,
	imageFile,
	lines,
	optionalText,
	requiredText,
	richText
} from '$lib/dashboard/schema';

export const localeChoices = choices(POST_LOCALES, { en: 'English', am: 'Amharic' });
export const statusChoices = choices(POST_STATUSES, { draft: 'Draft', published: 'Published' });

export const postSchema = z
	.object({
		title: requiredText(200),
		/** Left empty, it is made from the title; either way it is made unique on save. */
		slug: optionalText(160),
		/** Left empty, the first lines of the body are used. */
		excerpt: optionalText(500),
		cover: imageFile.optional(),
		/** One per line. */
		tags: lines(false),
		locale: z.enum(POST_LOCALES).default('en'),
		status: z.enum(POST_STATUSES).default('draft'),
		/**
		 * Addis Ababa time, as a `datetime-local` field posts it: `2026-10-01T09:30`. Empty on
		 * publishing means now; a future time schedules the post.
		 */
		publishedAt: z
			.string()
			.trim()
			.refine((v) => v === '' || /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(v), 'Pick a date and time')
			.default(''),
		isFeatured: z.boolean().default(false),
		body: richText
	})
	.refine((post) => post.status === 'draft' || post.body.trim() !== '', {
		message: 'Write the post before publishing it',
		path: ['body']
	});
