import { randomBytes } from 'node:crypto';
import { and, asc, eq, isNull, sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { bankAccount, rateLink, sponsorshipPackage } from '$lib/server/db/schema';
import type { Locale } from '$lib/paraglide/runtime';
import { cached } from '$lib/server/cache';
import { live, localized } from '$lib/server/content';
import { settingsRow } from '$lib/server/site';

/*
 * The rates page: packages, prices, price terms and where to pay. Private — reached only through
 * a link made in the dashboard (`rate_link`), valid until its expiry date.
 */

/** A fresh link token: 32 random bytes, URL-safe. Unguessable; see `rateLink` in the schema. */
export const newRateToken = () => randomBytes(32).toString('base64url');

/** Today in Addis Ababa, as `YYYY-MM-DD`: a link is good through the whole of its expiry day there. */
export const addisToday = () =>
	new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Addis_Ababa' }).format(new Date());

export type RateLinkState =
	| { state: 'ok'; id: number; label: string; expiresOn: string }
	| { state: 'expired' | 'off' | 'unknown' };

/**
 * What a token opens. `off` is a link switched off in the dashboard; `unknown` is anything else,
 * including a deleted link — a page must not tell a guesser which tokens once existed.
 */
export async function resolveRateLink(token: string): Promise<RateLinkState> {
	// Real tokens are 43 characters; anything else is not worth a query.
	if (!/^[\w-]{20,64}$/.test(token)) return { state: 'unknown' };
	const [link] = await db
		.select()
		.from(rateLink)
		.where(and(eq(rateLink.token, token), isNull(rateLink.deletedAt)))
		.limit(1);
	if (!link) return { state: 'unknown' };
	if (!link.status) return { state: 'off' };
	if (link.expiresOn < addisToday()) return { state: 'expired' };
	return { state: 'ok', id: link.id, label: link.label, expiresOn: link.expiresOn };
}

/** Counts a view, so the dashboard shows whether the sponsor opened the link. */
export async function recordRateView(id: number) {
	await db
		.update(rateLink)
		.set({ views: sql`${rateLink.views} + 1`, lastViewedAt: new Date() })
		.where(eq(rateLink.id, id));
}

const readRates = cached(async () => {
	const [packages, banks] = await Promise.all([
		db
			.select()
			.from(sponsorshipPackage)
			.where(and(eq(sponsorshipPackage.isActive, true), isNull(sponsorshipPackage.deletedAt)))
			.orderBy(asc(sponsorshipPackage.sortOrder), asc(sponsorshipPackage.id)),
		db
			.select()
			.from(bankAccount)
			.where(live(bankAccount))
			.orderBy(asc(bankAccount.sortOrder), asc(bankAccount.id))
	]);
	return { packages, banks };
});

/** The rates page's content, in the visitor's language. */
export async function loadRates(locale: Locale) {
	const [{ packages, banks }, s] = await Promise.all([readRates(null), settingsRow()]);
	return {
		packages: packages.map((p) => ({
			id: p.id,
			name: localized(p.name, p.nameAm, locale),
			price: p.price,
			icon: p.icon,
			tone: p.tone,
			isFeatured: p.isFeatured,
			badge: localized(p.badge, p.badgeAm, locale),
			features: localized(p.features, p.featuresAm, locale)
		})),
		terms: {
			netPriceNote: s ? localized(s.netPriceNote, s.netPriceNoteAm, locale) : null,
			customPrice: s ? localized(s.customPrice, s.customPriceAm, locale) : null,
			notes: s ? localized(s.packageNotes ?? [], s.packageNotesAm, locale) : []
		},
		customTags: s ? localized(s.customTags, s.customTagsAm, locale) : [],
		payment: {
			holder: s?.accountHolder ?? '',
			note: s ? localized(s.paymentNote, s.paymentNoteAm, locale) : null,
			banks: banks.map((b) => ({
				id: b.id,
				name: localized(b.name, b.nameAm, locale),
				accountNumber: b.accountNumber,
				tone: b.tone,
				icon: b.icon
			}))
		}
	};
}

export type Rates = Awaited<ReturnType<typeof loadRates>>;

/** A shown package's English name, for an inquiry; `null` for an id that is not one. */
export async function packageName(id: number): Promise<string | null> {
	const { packages } = await readRates(null);
	return packages.find((p) => p.id === id)?.name ?? null;
}
