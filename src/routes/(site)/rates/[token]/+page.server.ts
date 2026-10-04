import { getLocale } from '$lib/paraglide/runtime';
import { CUSTOM_PACKAGE, submitInquiry } from '$lib/server/inquiry';
import { loadRates, recordRateView, resolveRateLink } from '$lib/server/rates';

/*
 * The private rates page. The token is checked on every request, including the form action, so
 * a link switched off in the dashboard stops working at once — even for a tab already open.
 */

export const load = async ({ params, url, setHeaders, isDataRequest }) => {
	// A price list must not sit in a shared cache, or outlive its link in one.
	setHeaders({ 'cache-control': 'private, no-store', 'x-robots-tag': 'noindex, nofollow' });

	const link = await resolveRateLink(params.token);
	if (link.state !== 'ok') return { link: { state: link.state }, rates: null, selectedPackage: '' };

	// A view is a page load; the client's own data refreshes (after sending the form) are not.
	if (!isDataRequest) await recordRateView(link.id);

	const rates = await loadRates(getLocale());
	const asked = url.searchParams.get('package') ?? '';
	const selectedPackage =
		asked === CUSTOM_PACKAGE || rates.packages.some((p) => String(p.id) === asked) ? asked : '';

	return {
		link: { state: 'ok' as const, label: link.label, expiresOn: link.expiresOn },
		rates,
		selectedPackage
	};
};

export const actions = {
	inquire: async (event) => {
		const link = await resolveRateLink(event.params.token);
		return submitInquiry(event, link.state === 'ok' ? link.id : null);
	}
};
