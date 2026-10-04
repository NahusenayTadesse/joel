import { error } from '@sveltejs/kit';
import { getLocale } from '$lib/paraglide/runtime';
import { loadSite } from '$lib/server/site';

/** What every public page shares: the header, the footer, the contact details. */
export const load = async () => {
	const site = await loadSite(getLocale());
	if (!site) error(503, 'The site has no content yet — run `npm run db:seed`.');
	return { site };
};
