import { z } from 'zod/v4';
import { optionalText, orderField, requiredText } from '$lib/dashboard/schema';

export const addSchema = z.object({
	label: requiredText(60),
	labelAm: optionalText(60),
	value: z.coerce.number().int('A whole number').min(0).max(100, 'At most 100'),
	sortOrder: orderField,
	status: z.boolean().default(true)
});

export const editSchema = addSchema.extend({ id: z.coerce.number() });
