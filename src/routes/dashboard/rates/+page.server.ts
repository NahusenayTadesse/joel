import { contentCrud } from '@nahu/admin-kit/server/crud';
import { lookupDeleteAction } from '@nahu/admin-kit/server/lookupDelete';
import { rateLink } from '$lib/server/db/schema';
import { addisToday, newRateToken } from '$lib/server/rates';
import { addSchema, editSchema } from './schema';

const crud = contentCrud({
	table: rateLink,
	label: 'Rate link',
	addSchema,
	editSchema,
	uniqueField: 'token',
	// The token is made here, on add only: an edit (`before` set) must never change a link already sent.
	transform: (values, event, before) =>
		before ? values : { ...values, token: newRateToken(), createdBy: event.locals.user?.id }
});

/** Newest first, with "today" in Addis Ababa so the page can mark expired links. */
export const load = async () => {
	const loaded = await crud.load();
	return { ...loaded, rows: loaded.rows.toReversed(), today: addisToday() };
};

export const actions = {
	add: crud.actions.add,
	edit: crud.actions.edit,
	delete: lookupDeleteAction(rateLink, 'rate link')
};
