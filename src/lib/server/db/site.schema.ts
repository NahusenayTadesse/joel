import { sql } from 'drizzle-orm';
import {
	boolean,
	index,
	int,
	mysqlEnum,
	mysqlTable,
	text,
	timestamp,
	uniqueIndex,
	varchar
} from 'drizzle-orm/mysql-core';
import { user } from './auth.schema';
import {
	BANK_ICONS,
	BANK_TONES,
	HIGHLIGHT_ICONS,
	INQUIRY_STAGES,
	PACKAGE_ICONS,
	PACKAGE_TONES,
	SOCIAL_PLATFORMS
} from '../../content';
import { deletionFields, lesserFields, secureFields, stringList, whileNotDeleted } from './fields';

/*
 * Everything on the public page that Joel would change without a developer: his details, the
 * numbers, the packages and their prices, the brands, the bank accounts.
 *
 * Translation: text a visitor reads has an English column and an `…Am` twin for Amharic. The
 * Amharic one may be left empty, and the English then shows (see `localized` in
 * `$lib/server/site`). Fixed interface words — headings, button labels — are Paraglide messages
 * in `messages/*.json`, not rows.
 *
 * Images are stored by the kit (`saveUploadedFile`) and the column keeps the file name; the public
 * page serves them from `/media/[name]`, which only answers for names these tables hold.
 */

/**
 * The page's single row of settings (id 1): who Joel is, how to reach him, the headline numbers
 * and the longer texts. One row rather than key/value pairs, so every setting has a type.
 */
export const siteSettings = mysqlTable('site_settings', {
	id: int('id').primaryKey().autoincrement(),

	firstName: varchar('first_name', { length: 60 }).notNull(),
	firstNameAm: varchar('first_name_am', { length: 60 }),
	lastName: varchar('last_name', { length: 60 }).notNull(),
	lastNameAm: varchar('last_name_am', { length: 60 }),
	/** The two letters in the logo mark. */
	initials: varchar('initials', { length: 4 }).notNull(),
	/** Stored file name of the hero photo. */
	portrait: varchar('portrait', { length: 255 }),

	heroBadge: varchar('hero_badge', { length: 120 }).notNull(),
	heroBadgeAm: varchar('hero_badge_am', { length: 120 }),
	heroDescription: text('hero_description').notNull(),
	heroDescriptionAm: text('hero_description_am'),

	/** The two floating figures beside the photo: "500K+ Total Reach", "95% Youth Audience". */
	reachValue: varchar('reach_value', { length: 20 }).notNull(),
	reachLabel: varchar('reach_label', { length: 60 }).notNull(),
	reachLabelAm: varchar('reach_label_am', { length: 60 }),
	audienceValue: varchar('audience_value', { length: 20 }).notNull(),
	audienceLabel: varchar('audience_label', { length: 60 }).notNull(),
	audienceLabelAm: varchar('audience_label_am', { length: 60 }),
	/** The headline over the follower cards, "600k+". */
	totalFollowers: varchar('total_followers', { length: 20 }).notNull(),

	/**
	 * The about quote. `**words**` are drawn in the primary colour and `__words__` in the accent,
	 * so the highlighted phrases can move when the sentence is rewritten or translated.
	 */
	aboutText: text('about_text').notNull(),
	aboutTextAm: text('about_text_am'),
	motto: varchar('motto', { length: 80 }).notNull(),
	mottoAm: varchar('motto_am', { length: 80 }),
	aboutTagline: varchar('about_tagline', { length: 160 }),
	aboutTaglineAm: varchar('about_tagline_am', { length: 160 }),

	/** Shown on the hero's call button, as typed locally: 0955928986. */
	phone: varchar('phone', { length: 20 }).notNull(),
	/**
	 * The same number in international form: what every call button dials (a local number fails
	 * from abroad), and what the footer shows. +251955928986.
	 */
	phoneIntl: varchar('phone_intl', { length: 20 }).notNull(),
	email: varchar('email', { length: 120 }).notNull(),
	website: varchar('website', { length: 255 }),
	location: varchar('location', { length: 120 }),
	locationAm: varchar('location_am', { length: 120 }),
	/** For the contact section's Telegram button, without the @: "joel_talargie". */
	telegramUsername: varchar('telegram_username', { length: 60 }),
	/** For the WhatsApp button, in international form: +251955928986. */
	whatsappNumber: varchar('whatsapp_number', { length: 20 }),
	/**
	 * The YouTube channel whose uploads fill the Videos page: "UCiRJdIGIpoQjD8Zh7cVU9NQ". Read
	 * from the channel's public feed, which needs no key (see `$lib/server/youtube`).
	 */
	youtubeChannelId: varchar('youtube_channel_id', { length: 40 }),
	/** Stored file name of the downloadable media kit (a PDF). */
	mediaKit: varchar('media_kit', { length: 255 }),

	footerBlurb: text('footer_blurb'),
	footerBlurbAm: text('footer_blurb_am'),
	founderOf: varchar('founder_of', { length: 120 }),
	founderUrl: varchar('founder_url', { length: 255 }),

	/** The small bullet list in the custom campaign card. */
	customTags: stringList('custom_tags').notNull(),
	customTagsAm: stringList('custom_tags_am'),

	/*
	 * The terms around the prices. Business wording, so it is edited here rather than in the
	 * translation files; each is left out of the page when empty.
	 */
	/** Under each price: "(Net Price before Tax)". */
	netPriceNote: varchar('net_price_note', { length: 80 }),
	netPriceNoteAm: varchar('net_price_note_am', { length: 80 }),
	/** The price in the custom campaign card: "Custom Pricing", or a figure. */
	customPrice: varchar('custom_price', { length: 60 }),
	customPriceAm: varchar('custom_price_am', { length: 60 }),
	/** The small print under the packages, one line each: validity, tax. */
	packageNotes: stringList('package_notes'),
	packageNotesAm: stringList('package_notes_am'),

	accountHolder: varchar('account_holder', { length: 120 }).notNull(),
	paymentNote: text('payment_note'),
	paymentNoteAm: text('payment_note_am'),

	metaTitle: varchar('meta_title', { length: 160 }).notNull(),
	metaTitleAm: varchar('meta_title_am', { length: 160 }),
	metaDescription: varchar('meta_description', { length: 320 }).notNull(),
	metaDescriptionAm: varchar('meta_description_am', { length: 320 }),

	updatedBy: varchar('updated_by', { length: 255 }).references(() => user.id, {
		onDelete: 'set null'
	}),
	updatedAt: timestamp('updated_at')
		.default(sql`CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3)`)
		.notNull()
});

/** The four chips under the hero buttons. */
export const heroHighlight = mysqlTable(
	'hero_highlight',
	{
		id: int('id').primaryKey().autoincrement(),
		name: varchar('name', { length: 60 }).notNull(),
		/** Unique while the row is not deleted — see `whileNotDeleted`. */
		nameLive: whileNotDeleted('name_live', 'name', 60),
		nameAm: varchar('name_am', { length: 60 }),
		icon: mysqlEnum('icon', HIGHLIGHT_ICONS).notNull().default('zap'),
		sortOrder: int('sort_order').notNull().default(0),
		...lesserFields
	},
	(table) => [
		uniqueIndex('hero_highlight_name_live_unique').on(table.nameLive),
		index('hero_highlight_order_idx').on(table.status, table.sortOrder)
	]
);

/** Logos in the "Trusted by" strip. */
export const brand = mysqlTable(
	'brand',
	{
		id: int('id').primaryKey().autoincrement(),
		name: varchar('name', { length: 120 }).notNull(),
		/** Unique while the row is not deleted — see `whileNotDeleted`. */
		nameLive: whileNotDeleted('name_live', 'name', 120),
		/** Stored file name of the logo. */
		logo: varchar('logo', { length: 255 }).notNull(),
		website: varchar('website', { length: 255 }),
		sortOrder: int('sort_order').notNull().default(0),
		...lesserFields
	},
	(table) => [
		uniqueIndex('brand_name_live_unique').on(table.nameLive),
		index('brand_order_idx').on(table.status, table.sortOrder)
	]
);

/**
 * Joel's accounts. One row per platform: the follower cards show those with `showInStats`, the
 * footer's round icons those with `showInFooter`.
 */
export const socialAccount = mysqlTable(
	'social_account',
	{
		id: int('id').primaryKey().autoincrement(),
		platform: mysqlEnum('platform', SOCIAL_PLATFORMS).notNull(),
		/** Unique while the row is not deleted — see `whileNotDeleted`. */
		platformLive: whileNotDeleted('platform_live', 'platform', 20),
		/** How the platform is written: "TikTok". */
		name: varchar('name', { length: 60 }).notNull(),
		url: varchar('url', { length: 255 }),
		/** Exact count; the card shows it rounded, "440k". */
		followers: int('followers', { unsigned: true }),
		/** An extra figure under the count, "4.5M Likes". */
		secondaryStat: varchar('secondary_stat', { length: 60 }),
		secondaryStatAm: varchar('secondary_stat_am', { length: 60 }),
		showInStats: boolean('show_in_stats').notNull().default(false),
		showInFooter: boolean('show_in_footer').notNull().default(false),
		/** Order of the follower cards. */
		sortOrder: int('sort_order').notNull().default(0),
		/** Order of the footer icons, which the original lists differently from the cards. */
		footerSortOrder: int('footer_sort_order').notNull().default(0),
		...lesserFields
	},
	(table) => [
		uniqueIndex('social_account_platform_live_unique').on(table.platformLive),
		index('social_account_order_idx').on(table.status, table.sortOrder)
	]
);

/** The sponsorship packages and their prices. */
export const sponsorshipPackage = mysqlTable(
	'sponsorship_package',
	{
		id: int('id').primaryKey().autoincrement(),
		name: varchar('name', { length: 80 }).notNull(),
		/** Unique while the row is not deleted — see `whileNotDeleted`. */
		nameLive: whileNotDeleted('name_live', 'name', 80),
		nameAm: varchar('name_am', { length: 80 }),
		/** Whole birr, before tax. */
		price: int('price', { unsigned: true }).notNull(),
		icon: mysqlEnum('icon', PACKAGE_ICONS).notNull().default('zap'),
		tone: mysqlEnum('tone', PACKAGE_TONES).notNull().default('primary'),
		/** Drawn larger, with a glow and a filled button. */
		isFeatured: boolean('is_featured').notNull().default(false),
		/** The pill above a featured card, "Best Seller". */
		badge: varchar('badge', { length: 40 }),
		badgeAm: varchar('badge_am', { length: 40 }),
		features: stringList('features').notNull(),
		featuresAm: stringList('features_am'),
		sortOrder: int('sort_order').notNull().default(0),
		...secureFields
	},
	(table) => [
		uniqueIndex('sponsorship_package_name_live_unique').on(table.nameLive),
		index('sponsorship_package_order_idx').on(table.isActive, table.sortOrder)
	]
);

/** Where sponsors pay, listed under "Payment Details". */
export const bankAccount = mysqlTable(
	'bank_account',
	{
		id: int('id').primaryKey().autoincrement(),
		/** The bank, "Dashen Bank". */
		name: varchar('name', { length: 120 }).notNull(),
		/** Unique while the row is not deleted — see `whileNotDeleted`. */
		nameLive: whileNotDeleted('name_live', 'name', 120),
		nameAm: varchar('name_am', { length: 120 }),
		accountNumber: varchar('account_number', { length: 40 }).notNull(),
		tone: mysqlEnum('tone', BANK_TONES).notNull().default('blue'),
		icon: mysqlEnum('icon', BANK_ICONS).notNull().default('landmark'),
		sortOrder: int('sort_order').notNull().default(0),
		...lesserFields
	},
	(table) => [
		uniqueIndex('bank_account_name_live_unique').on(table.nameLive),
		index('bank_account_order_idx').on(table.status, table.sortOrder)
	]
);

/** The audience breakdown beside the follower cards: "18–24 years · 62%". */
export const audienceStat = mysqlTable(
	'audience_stat',
	{
		id: int('id').primaryKey().autoincrement(),
		label: varchar('label', { length: 60 }).notNull(),
		labelAm: varchar('label_am', { length: 60 }),
		/** A share of the audience, 0–100. */
		value: int('value', { unsigned: true }).notNull(),
		sortOrder: int('sort_order').notNull().default(0),
		...lesserFields
	},
	(table) => [index('audience_stat_order_idx').on(table.status, table.sortOrder)]
);

/** What sponsors said about working with Joel. */
export const testimonial = mysqlTable(
	'testimonial',
	{
		id: int('id').primaryKey().autoincrement(),
		quote: text('quote').notNull(),
		quoteAm: text('quote_am'),
		author: varchar('author', { length: 120 }).notNull(),
		/** Their position and company: "Marketing Lead, TECNO Ethiopia". */
		role: varchar('role', { length: 160 }),
		roleAm: varchar('role_am', { length: 160 }),
		sortOrder: int('sort_order').notNull().default(0),
		...lesserFields
	},
	(table) => [index('testimonial_order_idx').on(table.status, table.sortOrder)]
);

/**
 * A message from the contact form. Written by visitors, so nothing here is trusted; the dashboard
 * only changes `stage` and `note`.
 */
export const inquiry = mysqlTable(
	'inquiry',
	{
		id: int('id').primaryKey().autoincrement(),
		name: varchar('name', { length: 120 }).notNull(),
		company: varchar('company', { length: 120 }),
		email: varchar('email', { length: 160 }),
		phone: varchar('phone', { length: 30 }),
		/**
		 * The package's English name when the inquiry came in, not a key: a package renamed or
		 * deleted later must not change what the sponsor asked for.
		 */
		packageName: varchar('package_name', { length: 80 }),
		message: text('message').notNull(),
		/** The rate link it was sent from, when it came from the private rates page. */
		rateLinkId: int('rate_link_id'),
		/** The page's language when it was sent, so the reply can be in the same one. */
		locale: varchar('locale', { length: 5 }).notNull(),
		stage: mysqlEnum('stage', INQUIRY_STAGES).notNull().default('new'),
		/** Joel's own note: what was agreed, when to follow up. */
		note: text('note'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedBy: varchar('updated_by', { length: 255 }).references(() => user.id, {
			onDelete: 'set null'
		}),
		...deletionFields
	},
	(table) => [index('inquiry_stage_idx').on(table.stage, table.createdAt)]
);
