import { sql } from 'drizzle-orm';
import {
	boolean,
	customType,
	date,
	datetime,
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
import { POST_LOCALES, POST_STATUSES, SERVICE_ICONS } from '../../content';
import { deletionFields, lesserFields, stringList, whileNotDeleted } from './fields';

/*
 * The portfolio's own content: projects with their galleries, the blog, the services, the
 * YouTube archive, and the private rate links. Same rules as `site.schema.ts`: text a visitor
 * reads has an `…Am` twin where it is translated, and images are stored file names.
 */

/** MEDIUMTEXT: a long article's HTML outgrows TEXT's 64KB with a few embedded tables. */
const mediumText = customType<{ data: string }>({ dataType: () => 'mediumtext' });

/** "What I do": the kinds of work Joel takes on, as cards on the home page. */
export const service = mysqlTable(
	'service',
	{
		id: int('id').primaryKey().autoincrement(),
		title: varchar('title', { length: 80 }).notNull(),
		titleAm: varchar('title_am', { length: 80 }),
		description: text('description').notNull(),
		descriptionAm: text('description_am'),
		icon: mysqlEnum('icon', SERVICE_ICONS).notNull().default('sparkles'),
		sortOrder: int('sort_order').notNull().default(0),
		...lesserFields
	},
	(table) => [index('service_order_idx').on(table.status, table.sortOrder)]
);

/** A piece of work: a brand campaign, a video series, a site. Has its own page. */
export const project = mysqlTable(
	'project',
	{
		id: int('id').primaryKey().autoincrement(),
		/** The address: /projects/<slug>. */
		slug: varchar('slug', { length: 120 }).notNull(),
		/** Unique while the row is not deleted — see `whileNotDeleted`. */
		slugLive: whileNotDeleted('slug_live', 'slug', 120),
		title: varchar('title', { length: 160 }).notNull(),
		titleAm: varchar('title_am', { length: 160 }),
		/** Who it was for: "TECNO Ethiopia". */
		client: varchar('client', { length: 120 }),
		/** What kind of work: "Product launch", "Video series". */
		category: varchar('category', { length: 60 }),
		categoryAm: varchar('category_am', { length: 60 }),
		/** One or two sentences for the cards. */
		summary: varchar('summary', { length: 300 }).notNull(),
		summaryAm: varchar('summary_am', { length: 300 }),
		/** The write-up, as sanitised HTML from the rich text editor. */
		body: mediumText('body'),
		bodyAm: mediumText('body_am'),
		/** The headline figure: "1.2M views". */
		result: varchar('result', { length: 60 }),
		resultAm: varchar('result_am', { length: 60 }),
		/** A YouTube video about it, as pasted: watch, youtu.be or shorts link. */
		youtubeUrl: varchar('youtube_url', { length: 255 }),
		/** Where it lives: the campaign post, the shipped site. */
		externalUrl: varchar('external_url', { length: 255 }),
		/** Stored file name of the card and header image. */
		cover: varchar('cover', { length: 255 }),
		completedOn: date('completed_on', { mode: 'string' }),
		/** Shown on the home page. */
		isFeatured: boolean('is_featured').notNull().default(false),
		sortOrder: int('sort_order').notNull().default(0),
		updatedBy: varchar('updated_by', { length: 255 }).references(() => user.id, {
			onDelete: 'set null'
		}),
		updatedAt: timestamp('updated_at')
			.default(sql`CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3)`)
			.notNull(),
		...lesserFields
	},
	(table) => [
		uniqueIndex('project_slug_live_unique').on(table.slugLive),
		index('project_order_idx').on(table.status, table.sortOrder)
	]
);

/** A project's gallery, one row per image. */
export const projectImage = mysqlTable(
	'project_image',
	{
		id: int('id').primaryKey().autoincrement(),
		projectId: int('project_id')
			.notNull()
			.references(() => project.id, { onDelete: 'cascade' }),
		/** Stored file name. */
		fileName: varchar('file_name', { length: 255 }).notNull(),
		caption: varchar('caption', { length: 200 }),
		captionAm: varchar('caption_am', { length: 200 }),
		sortOrder: int('sort_order').notNull().default(0),
		...deletionFields
	},
	(table) => [index('project_image_order_idx').on(table.projectId, table.sortOrder)]
);

/** A blog post. Written in one language (`locale`), shown on both versions of the site. */
export const post = mysqlTable(
	'post',
	{
		id: int('id').primaryKey().autoincrement(),
		slug: varchar('slug', { length: 160 }).notNull(),
		/** Unique while the row is not deleted — see `whileNotDeleted`. */
		slugLive: whileNotDeleted('slug_live', 'slug', 160),
		title: varchar('title', { length: 200 }).notNull(),
		/** The line on the cards and in search results; written from the body when left empty. */
		excerpt: varchar('excerpt', { length: 500 }),
		/** Sanitised HTML from the rich text editor. */
		body: mediumText('body').notNull(),
		readingMinutes: int('reading_minutes').notNull().default(1),
		cover: varchar('cover', { length: 255 }),
		tags: stringList('tags'),
		locale: mysqlEnum('locale', POST_LOCALES).notNull().default('en'),
		status: mysqlEnum('status', POST_STATUSES).notNull().default('draft'),
		/** When it goes live. Set on first publish; a future time schedules the post. */
		publishedAt: datetime('published_at'),
		isFeatured: boolean('is_featured').notNull().default(false),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.default(sql`CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3)`)
			.notNull(),
		updatedBy: varchar('updated_by', { length: 255 }).references(() => user.id, {
			onDelete: 'set null'
		}),
		...deletionFields
	},
	(table) => [
		uniqueIndex('post_slug_live_unique').on(table.slugLive),
		index('post_published_idx').on(table.status, table.publishedAt)
	]
);

/**
 * Images put into a post's body from the editor. Each upload is recorded here so the public
 * media route will serve it (it serves only names the database vouches for).
 */
export const editorUpload = mysqlTable('editor_upload', {
	id: int('id').primaryKey().autoincrement(),
	fileName: varchar('file_name', { length: 255 }).notNull().unique(),
	createdBy: varchar('created_by', { length: 255 }).references(() => user.id, {
		onDelete: 'set null'
	}),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

/**
 * A private link to the rates page (packages, prices, payment details), made in the dashboard
 * for one sponsor and valid until `expiresOn` (through that whole day, Addis Ababa time).
 *
 * The token is kept as it is, not hashed: Joel copies the link from the dashboard whenever he
 * needs to resend it, and what it guards is a price list, not an account. It is 32 random bytes,
 * so it cannot be guessed; switching a link off or letting it lapse ends it at once.
 */
export const rateLink = mysqlTable(
	'rate_link',
	{
		id: int('id').primaryKey().autoincrement(),
		/** Who it is for: "TECNO — Abebe". */
		label: varchar('label', { length: 120 }).notNull(),
		token: varchar('token', { length: 64 }).notNull().unique(),
		expiresOn: date('expires_on', { mode: 'string' }).notNull(),
		views: int('views', { unsigned: true }).notNull().default(0),
		lastViewedAt: datetime('last_viewed_at'),
		createdBy: varchar('created_by', { length: 255 }).references(() => user.id, {
			onDelete: 'set null'
		}),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		/** `status` false switches the link off before it expires. */
		...lesserFields
	},
	(table) => [index('rate_link_expires_idx').on(table.expiresOn)]
);

/**
 * The channel's uploads, copied from YouTube (`$lib/server/youtube`). The feed only ever lists
 * the latest 15, so keeping every video seen here is what builds up an archive over time.
 */
export const youtubeVideo = mysqlTable(
	'youtube_video',
	{
		/** A key of our own, as every table the dashboard's kit edits has; YouTube's id is `videoId`. */
		id: int('id').primaryKey().autoincrement(),
		videoId: varchar('video_id', { length: 16 }).notNull().unique(),
		title: varchar('title', { length: 255 }).notNull(),
		description: text('description'),
		publishedAt: datetime('published_at').notNull(),
		views: int('views', { unsigned: true }),
		/** A Short: shown 9:16 and listed under Shorts. */
		isShort: boolean('is_short').notNull().default(false),
		/** Hidden from the site when false; the next sync does not switch it back on. */
		status: boolean('status').notNull().default(true),
		/** Shown first, in the large player. */
		isFeatured: boolean('is_featured').notNull().default(false),
		syncedAt: timestamp('synced_at').defaultNow().notNull()
	},
	(table) => [index('youtube_video_published_idx').on(table.status, table.publishedAt)]
);
