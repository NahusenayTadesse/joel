import { z } from 'zod/v4';
import { lines, optionalText, optionalUrl, requiredText } from '$lib/dashboard/schema';

export const settingsSchema = z.object({
	firstName: requiredText(60),
	firstNameAm: optionalText(60),
	lastName: requiredText(60),
	lastNameAm: optionalText(60),
	initials: requiredText(4),
	portrait: z.file().max(10_000_000, 'At most 10 MB').optional(),

	heroBadge: requiredText(120),
	heroBadgeAm: optionalText(120),
	heroDescription: requiredText(600),
	heroDescriptionAm: optionalText(600),
	reachValue: requiredText(20),
	reachLabel: requiredText(60),
	reachLabelAm: optionalText(60),
	audienceValue: requiredText(20),
	audienceLabel: requiredText(60),
	audienceLabelAm: optionalText(60),
	totalFollowers: requiredText(20),

	aboutText: requiredText(2000),
	aboutTextAm: optionalText(2000),
	motto: requiredText(80),
	mottoAm: optionalText(80),
	aboutTagline: optionalText(160),
	aboutTaglineAm: optionalText(160),

	phone: requiredText(20),
	phoneIntl: requiredText(20),
	email: z.email('Enter a valid email address').max(120),
	website: optionalUrl,
	location: optionalText(120),
	locationAm: optionalText(120),
	telegramUsername: optionalText(60),
	whatsappNumber: optionalText(20),
	youtubeChannelId: optionalText(40).refine(
		(value) => !value || /^UC[\w-]{22}$/.test(value),
		'A channel id starts with UC and is 24 characters long'
	),
	mediaKit: z.file().max(10_000_000, 'At most 10 MB').optional(),

	footerBlurb: optionalText(600),
	footerBlurbAm: optionalText(600),
	founderOf: optionalText(120),
	founderUrl: optionalUrl,

	customTags: lines(true),
	customTagsAm: lines(false),

	netPriceNote: optionalText(80),
	netPriceNoteAm: optionalText(80),
	customPrice: optionalText(60),
	customPriceAm: optionalText(60),
	packageNotes: lines(false),
	packageNotesAm: lines(false),

	accountHolder: requiredText(120),
	paymentNote: optionalText(600),
	paymentNoteAm: optionalText(600),

	metaTitle: requiredText(160),
	metaTitleAm: optionalText(160),
	metaDescription: requiredText(320),
	metaDescriptionAm: optionalText(320)
});
