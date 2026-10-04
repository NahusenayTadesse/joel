import { z } from 'zod/v4';
import { SOCIAL_PLATFORMS } from '$lib/content';
import {
	choices,
	optionalText,
	optionalUrl,
	orderField,
	requiredText
} from '$lib/dashboard/schema';

export const platformChoices = choices(SOCIAL_PLATFORMS, {
	tiktok: 'TikTok',
	youtube: 'YouTube',
	instagram: 'Instagram',
	twitter: 'Twitter / X',
	telegram: 'Telegram',
	github: 'GitHub',
	facebook: 'Facebook',
	linkedin: 'LinkedIn'
});

export const addSchema = z.object({
	name: requiredText(60),
	platform: z.enum(SOCIAL_PLATFORMS).default('tiktok'),
	url: optionalUrl,
	followers: z.number().int().min(0).nullable(),
	secondaryStat: optionalText(60),
	secondaryStatAm: optionalText(60),
	showInStats: z.boolean().default(false),
	showInFooter: z.boolean().default(false),
	sortOrder: orderField,
	footerSortOrder: orderField,
	status: z.boolean().default(true)
});

export const editSchema = addSchema.extend({ id: z.coerce.number() });
