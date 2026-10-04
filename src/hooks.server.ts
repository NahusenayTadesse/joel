import { sequence } from '@sveltejs/kit/hooks';
import { building } from '$app/environment';
import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { redirect, type Handle } from '@sveltejs/kit';
import { deLocalizeUrl, getTextDirection } from '$lib/paraglide/runtime';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { configureKit } from '@nahu/admin-kit/server/db';
import { db } from '$lib/server/db';
import { kitHandle } from '@nahu/admin-kit/server/hooks';
import { access } from '$lib/access';
import { invalidateContent } from '$lib/server/cache';

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) =>
				html
					.replace('%paraglide.lang%', locale)
					.replace('%paraglide.dir%', getTextDirection(locale))
		});
	});

const handleBetterAuth: Handle = async ({ event, resolve }) => {
	const session = await auth.api.getSession({ headers: event.request.headers });

	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	}

	return svelteKitHandler({ event, resolve, auth, building });
};

/**
 * The dashboard lives at one address, in no language prefix. Paraglide's reroute would also answer
 * `/am/dashboard/…`, but the kit's guard reads `event.url.pathname` and only knows `/dashboard`, so
 * a prefixed path must never reach a page: it is sent to the unprefixed one first.
 */
const handleDashboardPath: Handle = ({ event, resolve }) => {
	const path = deLocalizeUrl(event.url).pathname;
	if (path !== event.url.pathname && (path === '/dashboard' || path.startsWith('/dashboard/'))) {
		redirect(308, path + event.url.search);
	}
	return resolve(event);
};

/**
 * The public site's content is cached (`$lib/server/cache`). Every dashboard write — a settings
 * save, a row added, edited or deleted — is a non-GET request under /dashboard, so one rule here
 * keeps the page fresh without each route having to remember to clear it.
 */
const handleSiteCache: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	if (event.request.method !== 'GET' && event.url.pathname.startsWith('/dashboard')) {
		invalidateContent();
	}
	return response;
};

configureKit({ db });

/**
 * The kit's permission hook. There are no roles yet, so every signed-in user is treated as a
 * super admin: they may open every page with a rule and delete through the CRUD helpers.
 * Replace this with the user's real permissions once roles exist.
 */
const handleKit = kitHandle({
	access,
	permissions: (event) => ({ permList: [], isSuperAdmin: Boolean(event.locals.user) })
});

export const handle: Handle = sequence(
	handleParaglide,
	handleDashboardPath,
	handleBetterAuth,
	handleKit,
	handleSiteCache
);
