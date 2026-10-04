import { and, asc, eq, isNotNull, isNull } from 'drizzle-orm';
import { db } from '$lib/server/db';
import {
	audienceStat,
	brand,
	editorUpload,
	heroHighlight,
	post,
	project,
	projectImage,
	service,
	siteSettings,
	socialAccount,
	testimonial
} from '$lib/server/db/schema';
import type { Locale } from '$lib/paraglide/runtime';
import { cached } from '$lib/server/cache';
import { live, localized } from '$lib/server/content';

/*
 * What every public page shares: who Joel is, the numbers, the brands, the services, the footer.
 *
 * Not the packages, prices or bank accounts. Those are the rates page's alone
 * (`$lib/server/rates`), behind a link from the dashboard; anything here goes into the data of
 * every public page, where anyone can read it.
 */

const readRows = cached(async () => {
	const [settings] = await db.select().from(siteSettings).limit(1);
	if (!settings) return null;

	const [highlights, brands, socials, audience, testimonials, services] = await Promise.all([
		db
			.select()
			.from(heroHighlight)
			.where(live(heroHighlight))
			.orderBy(asc(heroHighlight.sortOrder), asc(heroHighlight.id)),
		db.select().from(brand).where(live(brand)).orderBy(asc(brand.sortOrder), asc(brand.id)),
		db
			.select()
			.from(socialAccount)
			.where(live(socialAccount))
			.orderBy(asc(socialAccount.sortOrder), asc(socialAccount.id)),
		db
			.select()
			.from(audienceStat)
			.where(live(audienceStat))
			.orderBy(asc(audienceStat.sortOrder), asc(audienceStat.id)),
		db
			.select()
			.from(testimonial)
			.where(live(testimonial))
			.orderBy(asc(testimonial.sortOrder), asc(testimonial.id)),
		db.select().from(service).where(live(service)).orderBy(asc(service.sortOrder), asc(service.id))
	]);

	return { settings, highlights, brands, socials, audience, testimonials, services };
});

/** The site settings row as stored, for server modules that need a column the page does not. */
export async function settingsRow() {
	return (await readRows(null))?.settings ?? null;
}

/** Everything the public pages share, in the visitor's language. `null` before the first seed. */
export async function loadSite(locale: Locale) {
	const r = await readRows(null);
	if (!r) return null;

	const s = r.settings;
	const firstName = localized(s.firstName, s.firstNameAm, locale);
	const lastName = localized(s.lastName, s.lastNameAm, locale);
	const youtube = r.socials.find((a) => a.platform === 'youtube');

	return {
		person: {
			firstName,
			lastName,
			fullName: `${firstName} ${lastName}`,
			initials: s.initials,
			portrait: s.portrait
		},
		hero: {
			badge: localized(s.heroBadge, s.heroBadgeAm, locale),
			description: localized(s.heroDescription, s.heroDescriptionAm, locale),
			highlights: r.highlights.map((h) => ({
				id: h.id,
				name: localized(h.name, h.nameAm, locale),
				icon: h.icon
			})),
			reach: { value: s.reachValue, label: localized(s.reachLabel, s.reachLabelAm, locale) },
			audience: {
				value: s.audienceValue,
				label: localized(s.audienceLabel, s.audienceLabelAm, locale)
			}
		},
		brands: r.brands.map((b) => ({ id: b.id, name: b.name, logo: b.logo, website: b.website })),
		followers: {
			total: s.totalFollowers,
			accounts: r.socials
				.filter((a) => a.showInStats)
				.map((a) => ({
					id: a.id,
					platform: a.platform,
					name: a.name,
					url: a.url,
					followers: a.followers ?? 0,
					secondaryStat: localized(a.secondaryStat, a.secondaryStatAm, locale)
				})),
			audience: r.audience.map((a) => ({
				id: a.id,
				label: localized(a.label, a.labelAm, locale),
				value: Math.min(100, a.value)
			}))
		},
		about: {
			text: localized(s.aboutText, s.aboutTextAm, locale),
			motto: localized(s.motto, s.mottoAm, locale),
			tagline: localized(s.aboutTagline, s.aboutTaglineAm, locale)
		},
		services: r.services.map((x) => ({
			id: x.id,
			title: localized(x.title, x.titleAm, locale),
			description: localized(x.description, x.descriptionAm, locale),
			icon: x.icon
		})),
		testimonials: r.testimonials.map((t) => ({
			id: t.id,
			quote: localized(t.quote, t.quoteAm, locale),
			author: t.author,
			role: localized(t.role, t.roleAm, locale)
		})),
		contact: {
			phone: s.phone,
			phoneIntl: s.phoneIntl,
			email: s.email,
			website: s.website,
			location: localized(s.location, s.locationAm, locale),
			telegram: s.telegramUsername?.replace(/^@/, '') || null,
			whatsapp: s.whatsappNumber?.replace(/\D/g, '') || null,
			mediaKit: s.mediaKit
		},
		youtube: { url: youtube?.url ?? null, name: youtube?.name ?? 'YouTube' },
		footer: {
			blurb: localized(s.footerBlurb, s.footerBlurbAm, locale),
			founderOf: s.founderOf,
			founderUrl: s.founderUrl,
			socials: r.socials
				.filter((a) => a.showInFooter)
				.sort((a, b) => a.footerSortOrder - b.footerSortOrder || a.id - b.id)
				.map((a) => ({ id: a.id, platform: a.platform, name: a.name, url: a.url }))
		},
		meta: {
			title: localized(s.metaTitle, s.metaTitleAm, locale),
			description: localized(s.metaDescription, s.metaDescriptionAm, locale)
		}
	};
}

export type Site = NonNullable<Awaited<ReturnType<typeof loadSite>>>;

/**
 * The stored file names the public site may show: the portrait, the media kit, the brand logos,
 * project covers and galleries, post covers and images put into posts. The media route serves
 * these and nothing else, so an upload that belongs to the dashboard stays private.
 */
export const publicFileNames = cached(async (): Promise<Set<string>> => {
	const r = await readRows(null);
	const [projects, images, posts, uploads] = await Promise.all([
		db
			.select({ name: project.cover })
			.from(project)
			.where(and(live(project), isNotNull(project.cover))),
		db
			.select({ name: projectImage.fileName })
			.from(projectImage)
			.innerJoin(project, eq(project.id, projectImage.projectId))
			.where(and(isNull(projectImage.deletedAt), live(project))),
		db
			.select({ name: post.cover })
			.from(post)
			.where(and(isNull(post.deletedAt), isNotNull(post.cover))),
		db.select({ name: editorUpload.fileName }).from(editorUpload)
	]);
	const names = [
		r?.settings.portrait,
		r?.settings.mediaKit,
		...(r?.brands ?? []).map((b) => b.logo),
		...[...projects, ...images, ...posts, ...uploads].map((row) => row.name)
	];
	return new Set(names.filter((n): n is string => !!n));
});
