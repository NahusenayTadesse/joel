import { z } from 'zod/v4';
import { BANK_ICONS, BANK_TONES } from '$lib/content';
import { choices, optionalText, orderField, requiredText } from '$lib/dashboard/schema';

export const toneChoices = choices(BANK_TONES, {
	blue: 'Blue',
	orange: 'Orange',
	green: 'Green',
	purple: 'Purple'
});
export const iconChoices = choices(BANK_ICONS, { landmark: 'Bank building', wallet: 'Wallet' });

export const addSchema = z.object({
	name: requiredText(120),
	nameAm: optionalText(120),
	accountNumber: z
		.string()
		.trim()
		.min(1, 'Required')
		.max(40)
		.regex(/^[0-9 -]+$/, 'Digits only'),
	tone: z.enum(BANK_TONES).default('blue'),
	icon: z.enum(BANK_ICONS).default('landmark'),
	sortOrder: orderField,
	status: z.boolean().default(true)
});

export const editSchema = addSchema.extend({ id: z.coerce.number() });
