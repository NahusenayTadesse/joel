import { z } from 'zod/v4';

/*
 * Pieces the dashboard's form schemas share. Here rather than in `$lib/server` because the forms
 * validate in the browser too.
 */

/** A text the form must have. */
export const requiredText = (max: number) =>
	z.string().trim().min(1, 'Required').max(max, `At most ${max} characters`);

/**
 * A text that may be left empty — saved as NULL (see `blankToNull`). `nullish`, not `optional`:
 * the kit's edit dialog seeds each field straight from the row, so a NULL column arrives as
 * `null`, and a schema that refused it blocked the save with an error under that field.
 */
export const optionalText = (max: number) =>
	z.string().trim().max(max, `At most ${max} characters`).nullish();

/** Display order, the kit's own convention (`sortOrderField`). */
export const orderField = z.coerce.number().int().min(0).default(0);

/** A full link, or nothing. */
export const optionalUrl = z
	.string()
	.trim()
	.max(255)
	.refine(
		(value) => value === '' || URL.canParse(value),
		'Enter a full link, starting with https://'
	)
	.nullish();

/** A list typed one item per line; `contentCrud`'s `listFields` turns it into an array. */
export const lines = (required: boolean) =>
	required ? z.string().trim().min(1, 'Add at least one line') : z.string().trim().nullish();

/** `{ value, name }` choices for a `select` field, from a fixed list of stored values. */
export const choices = <T extends string>(values: readonly T[], names: Record<T, string>) =>
	values.map((value) => ({ value, name: names[value] }));

/** A calendar date as the kit's date field posts it, or nothing. */
export const optionalDate = z
	.string()
	.trim()
	.refine((value) => value === '' || /^\d{4}-\d{2}-\d{2}$/.test(value), 'Pick a date')
	.nullish();

/** A rich text body from the kit's `RichEditor`: HTML, sanitised on the server before saving. */
export const richText = z.string().max(2_000_000, 'Too long').default('');

/** One stored image: a picture, under the kit's upload limit. */
export const imageFile = z
	.file()
	.max(10_000_000, 'At most 10 MB')
	.refine((file) => file.type.startsWith('image/'), 'An image, not a document');
