import { z } from 'zod/v4';
import { HIGHLIGHT_ICONS } from '$lib/content';
import { choices, optionalText, orderField, requiredText } from '$lib/dashboard/schema';

export const iconChoices = choices(HIGHLIGHT_ICONS, {
	zap: 'Lightning',
	target: 'Target',
	users: 'People',
	'panels-top-left': 'Layout',
	sparkles: 'Sparkles',
	rocket: 'Rocket'
});

export const addSchema = z.object({
	name: requiredText(60),
	nameAm: optionalText(60),
	icon: z.enum(HIGHLIGHT_ICONS).default('zap'),
	sortOrder: orderField,
	status: z.boolean().default(true)
});

export const editSchema = addSchema.extend({ id: z.coerce.number() });
