import { createAccess } from '@nahu/admin-kit/access';

/**
 * Who may open what: one rule per route prefix, first match wins, so specific prefixes go before
 * general ones. Pages under /dashboard with no rule are closed — add a rule with every new page.
 * `permission: null` means any signed-in user; there are no roles yet (see hooks.server.ts).
 */
export const access = createAccess({
	root: '/dashboard',
	rules: [
		{ prefix: '/dashboard', permission: null, exact: true },
		{ prefix: '/dashboard/settings', permission: null },
		{ prefix: '/dashboard/highlights', permission: null },
		{ prefix: '/dashboard/brands', permission: null },
		{ prefix: '/dashboard/socials', permission: null },
		{ prefix: '/dashboard/audience', permission: null },
		{ prefix: '/dashboard/testimonials', permission: null },
		{ prefix: '/dashboard/inquiries', permission: null },
		{ prefix: '/dashboard/projects', permission: null },
		{ prefix: '/dashboard/posts', permission: null },
		{ prefix: '/dashboard/uploads', permission: null },
		{ prefix: '/dashboard/rates', permission: null },
		{ prefix: '/dashboard/videos', permission: null },
		{ prefix: '/dashboard/services', permission: null },
		{ prefix: '/dashboard/packages', permission: null },
		{ prefix: '/dashboard/banks', permission: null },
		{ prefix: '/dashboard/files/', permission: null }
	]
});
