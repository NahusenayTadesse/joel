import { z } from 'zod/v4';
import { imageFile, optionalUrl, orderField, requiredText } from '$lib/dashboard/schema';

/*
 * The logo is an upload: required when a brand is added, optional on edit, where choosing none
 * keeps the stored one (`contentCrud`'s `fileFields`).
 */
export const addSchema = z.object({
	name: requiredText(120),
	logo: imageFile,
	website: optionalUrl,
	sortOrder: orderField,
	status: z.boolean().default(true)
});

export const editSchema = addSchema.extend({
	id: z.coerce.number(),
	logo: imageFile.optional()
});
