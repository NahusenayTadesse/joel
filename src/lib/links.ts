import { resolve } from '$app/paths';
import type { ResolvedPathname } from '$app/types';
import { localizeHref } from '$lib/paraglide/runtime';

/**
 * A link to a page of the public site, in the visitor's language: `to('/projects')` is
 * `/projects` on the English site and `/am/projects` on the Amharic one. `hash` adds a section,
 * `to('/', 'contact')`; `query` a query string, `to('/videos', '', { kind: 'shorts' })` (empty
 * values are left out).
 *
 * Typed `ResolvedPathname`, like `resolve()` itself, which is what the lint rule against
 * unresolved links accepts.
 */
export function to(
	path: string,
	hash = '',
	query: Record<string, string | number | null | undefined> = {}
): ResolvedPathname {
	// Already a concrete path, so `resolve` only adds the base path; typed as a static route because
	// its overloads otherwise ask for the parameters of `/projects/[slug]`.
	const href = resolve(localizeHref(path) as '/');
	const search = new URLSearchParams(
		Object.entries(query)
			.filter(([, value]) => value !== null && value !== undefined && value !== '')
			.map(([key, value]) => [key, String(value)])
	).toString();
	return `${href}${search ? `?${search}` : ''}${hash ? `#${hash}` : ''}` as ResolvedPathname;
}

/** Joel Talargie Academy, the separate LMS site; shown as "Academy" in the menus. */
export const ACADEMY_URL = 'http://lms.joeltalargie.com/';
