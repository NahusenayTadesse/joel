import { z } from 'zod/v4';
import { optionalText, orderField, requiredText } from '$lib/dashboard/schema';

export const addSchema = z.object({
	quote: requiredText(800),
	quoteAm: optionalText(800),
	author: requiredText(120),
	role: optionalText(160),
	roleAm: optionalText(160),
	sortOrder: orderField,
	status: z.boolean().default(true)
});

export const editSchema = addSchema.extend({ id: z.coerce.number() });
