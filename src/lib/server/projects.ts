import { and, asc, desc, eq, isNull } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { project, projectImage } from '$lib/server/db/schema';
import type { Locale } from '$lib/paraglide/runtime';
import { cached } from '$lib/server/cache';
import { live, localized } from '$lib/server/content';

/* The Projects pages: every shown project, and one project with its gallery. */

type Row = typeof project.$inferSelect;

const readProjects = cached(() =>
	db
		.select()
		.from(project)
		.where(live(project))
		.orderBy(
			desc(project.isFeatured),
			asc(project.sortOrder),
			desc(project.completedOn),
			desc(project.id)
		)
);

/** A project as a card shows it. */
function card(p: Row, locale: Locale) {
	return {
		id: p.id,
		slug: p.slug,
		title: localized(p.title, p.titleAm, locale),
		client: p.client,
		category: localized(p.category, p.categoryAm, locale),
		summary: localized(p.summary, p.summaryAm, locale),
		result: localized(p.result, p.resultAm, locale),
		cover: p.cover,
		youtubeUrl: p.youtubeUrl,
		completedOn: p.completedOn,
		isFeatured: p.isFeatured
	};
}

export type ProjectCard = ReturnType<typeof card>;

/** Every shown project: featured first, then in the dashboard's order. */
export async function listProjects(locale: Locale) {
	return (await readProjects(null)).map((p) => card(p, locale));
}

/** The home page's few: the featured ones, topped up with the next in order. */
export async function featuredProjects(locale: Locale, limit = 3) {
	return (await listProjects(locale)).slice(0, limit);
}

/** One project with its write-up and gallery, or `null` for an address that is not one. */
export async function projectBySlug(slug: string, locale: Locale) {
	const rows = await readProjects(null);
	const index = rows.findIndex((p) => p.slug === slug);
	if (index === -1) return null;
	const p = rows[index];
	const images = await db
		.select()
		.from(projectImage)
		.where(and(eq(projectImage.projectId, p.id), isNull(projectImage.deletedAt)))
		.orderBy(asc(projectImage.sortOrder), asc(projectImage.id));
	// The neighbours in the list, for "next project" at the foot of the page.
	const next = rows[index + 1] ?? (rows.length > 1 ? rows[0] : null);
	return {
		...card(p, locale),
		body: localized(p.body, p.bodyAm, locale),
		externalUrl: p.externalUrl,
		updatedAt: p.updatedAt,
		images: images.map((i) => ({
			id: i.id,
			fileName: i.fileName,
			caption: localized(i.caption, i.captionAm, locale)
		})),
		next: next && next.id !== p.id ? card(next, locale) : null
	};
}
