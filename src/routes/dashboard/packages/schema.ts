import { z } from 'zod/v4';
import { PACKAGE_ICONS, PACKAGE_TONES } from '$lib/content';
import { choices, lines, optionalText, orderField, requiredText } from '$lib/dashboard/schema';

export const iconChoices = choices(PACKAGE_ICONS, {
	zap: 'Lightning',
	rocket: 'Rocket',
	'shield-check': 'Shield',
	sparkles: 'Sparkles',
	target: 'Target'
});
export const toneChoices = choices(PACKAGE_TONES, {
	primary: 'Ice blue',
	accent: 'Cyan',
	pink: 'Sky'
});

export const addSchema = z.object({
	name: requiredText(80),
	nameAm: optionalText(80),
	price: z.coerce.number().int('Whole birr').min(0),
	features: lines(true),
	featuresAm: lines(false),
	icon: z.enum(PACKAGE_ICONS).default('zap'),
	tone: z.enum(PACKAGE_TONES).default('primary'),
	isFeatured: z.boolean().default(false),
	badge: optionalText(40),
	badgeAm: optionalText(40),
	sortOrder: orderField,
	status: z.boolean().default(true)
});

export const editSchema = addSchema.extend({ id: z.coerce.number() });
