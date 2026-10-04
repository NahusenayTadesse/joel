import { fail, type RequestEvent } from '@sveltejs/kit';
import { z } from 'zod/v4';
import { db } from '$lib/server/db';
import { inquiry } from '$lib/server/db/schema';
import { packageName } from '$lib/server/rates';
import { getLocale } from '$lib/paraglide/runtime';

/*
 * The contact form's server side. The answers carry codes, not sentences: the page turns a code
 * into words in the visitor's language (`Contact.svelte`), so this file needs no translations.
 */

/** Why a field was refused. */
export type FieldError = 'required' | 'email' | 'contact' | 'too_long';
/** Why the whole form was refused. */
export type FormError = 'check' | 'rate' | 'failed';

export type InquiryValues = {
	name: string;
	company: string;
	email: string;
	phone: string;
	package: string;
	message: string;
};

export type FieldErrors = Partial<Record<keyof InquiryValues, FieldError>>;

/** What the action answers: the typed values back with what was wrong, or that it went through. */
export type InquiryResult =
	| { sent: true }
	| { sent?: false; values: InquiryValues; errors: FieldErrors; formError: FormError };

/** The package select: a shown package's id, `custom`, or nothing (not decided yet). */
export const CUSTOM_PACKAGE = 'custom';

const text = (max: number) => z.string().trim().max(max, 'too_long');

const schema = z
	.object({
		name: text(120).min(1, 'required'),
		company: text(120),
		email: text(160).refine((v) => v === '' || z.email().safeParse(v).success, 'email'),
		phone: text(30),
		package: text(20),
		message: text(4000).min(1, 'required')
	})
	.refine((v) => v.email !== '' || v.phone !== '', { message: 'contact', path: ['email'] });

/*
 * ─── Rate limit ───────────────────────────────────────────────────────────────────────────────
 * Five inquiries per connection per ten minutes: more than a real sponsor sends, few enough that
 * a script cannot fill the dashboard. In memory, so it resets on restart; that is fine for one
 * server, and the honeypot below catches the plainer bots anyway.
 */
const WINDOW_MS = 10 * 60_000;
const LIMIT = 5;
const recent = new Map<string, number[]>();

function allowed(address: string): boolean {
	const now = Date.now();
	const times = (recent.get(address) ?? []).filter((t) => now - t < WINDOW_MS);
	if (times.length >= LIMIT) {
		recent.set(address, times);
		return false;
	}
	times.push(now);
	recent.set(address, times);
	// Forget quiet connections, so the map does not grow for ever.
	if (recent.size > 5_000) {
		for (const [key, list] of recent) {
			if (list.every((t) => now - t >= WINDOW_MS)) recent.delete(key);
		}
	}
	return true;
}

/**
 * The `inquire` form action, on the home page and on the rates page. `rateLinkId` is the link the
 * rates page was opened with, recorded so the dashboard shows which sponsor's link led here.
 */
export async function submitInquiry(
	{ request, getClientAddress }: RequestEvent,
	rateLinkId: number | null = null
) {
	const posted = await request.formData();
	const field = (name: string) => String(posted.get(name) ?? '');
	const values: InquiryValues = {
		name: field('name'),
		company: field('company'),
		email: field('email'),
		phone: field('phone'),
		package: field('package'),
		message: field('message')
	};
	const refuse = (status: number, formError: FormError, errors: FieldErrors = {}) =>
		fail(status, { values, errors, formError } satisfies InquiryResult);

	// The honeypot: a field people never see. Whatever fills it is a script, and is told it worked.
	if (field('website') !== '') return { sent: true } satisfies InquiryResult;

	const parsed = schema.safeParse(values);
	if (!parsed.success) {
		const errors: FieldErrors = {};
		for (const issue of parsed.error.issues) {
			const key = issue.path[0] as keyof InquiryValues;
			errors[key] ??= issue.message as FieldError;
		}
		return refuse(400, 'check', errors);
	}

	if (!allowed(getClientAddress())) return refuse(429, 'rate');

	const data = parsed.data;
	const chosen =
		data.package === CUSTOM_PACKAGE
			? 'Custom campaign'
			: /^\d+$/.test(data.package)
				? await packageName(Number(data.package))
				: null;

	try {
		await db.insert(inquiry).values({
			name: data.name,
			company: data.company || null,
			email: data.email || null,
			phone: data.phone || null,
			packageName: chosen,
			message: data.message,
			rateLinkId,
			locale: getLocale()
		});
	} catch (err) {
		console.error('Could not save an inquiry', err);
		return refuse(500, 'failed');
	}

	return { sent: true } satisfies InquiryResult;
}
