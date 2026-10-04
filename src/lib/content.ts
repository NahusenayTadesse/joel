/**
 * The fixed choices behind the content tables' enum columns. Shared by the schema, the public
 * page and the dashboard's forms, so it lives outside `$lib/server` — the forms validate in the
 * browser too.
 */

/** The icons a highlight chip may use — the set the page knows how to draw. */
export const HIGHLIGHT_ICONS = [
	'zap',
	'target',
	'users',
	'panels-top-left',
	'sparkles',
	'rocket'
] as const;
export const PACKAGE_ICONS = ['zap', 'rocket', 'shield-check', 'sparkles', 'target'] as const;
/** Colour of a package's border and icon: the site's two brand colours, plus a lighter sky blue (stored as `pink`, its old colour). */
export const PACKAGE_TONES = ['primary', 'accent', 'pink'] as const;
export const BANK_TONES = ['blue', 'orange', 'green', 'purple'] as const;
export const BANK_ICONS = ['landmark', 'wallet'] as const;
/** Where an inquiry from the contact form stands. `spam` keeps junk out of the way without deleting. */
export const INQUIRY_STAGES = ['new', 'contacted', 'won', 'lost', 'spam'] as const;
export const SOCIAL_PLATFORMS = [
	'tiktok',
	'youtube',
	'instagram',
	'twitter',
	'telegram',
	'github',
	'facebook',
	'linkedin'
] as const;

/** The icons a "What I do" service may use. */
export const SERVICE_ICONS = [
	'clapperboard',
	'megaphone',
	'compass',
	'code',
	'graduation-cap',
	'mic',
	'sparkles'
] as const;
/** A blog post is a draft until published; a future `publishedAt` schedules it. */
export const POST_STATUSES = ['draft', 'published'] as const;
/** The language a post is written in. Posts are not translated; each is in one language. */
export const POST_LOCALES = ['en', 'am'] as const;
