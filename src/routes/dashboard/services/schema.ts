import { z } from 'zod/v4';
import { SERVICE_ICONS } from '$lib/content';
import { choices, optionalText, orderField, requiredText } from '$lib/dashboard/schema';

export const iconChoices = choices(SERVICE_ICONS, {
	clapperboard: 'Video',
	megaphone: 'Megaphone',
	compass: 'Compass',
	code: 'Code',
	'graduation-cap': 'Teaching',
	mic: 'Microphone',
	sparkles: 'Sparkles'
});

export const addSchema = z.object({
	title: requiredText(80),
	titleAm: optionalText(80),
	description: requiredText(600),
	descriptionAm: optionalText(600),
	icon: z.enum(SERVICE_ICONS).default('sparkles'),
	sortOrder: orderField,
	status: z.boolean().default(true)
});

export const editSchema = addSchema.extend({ id: z.coerce.number() });
