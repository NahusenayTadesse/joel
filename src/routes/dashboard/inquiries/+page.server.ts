import { contentCrud } from '@nahu/admin-kit/server/crud';
import { blankToNull } from '$lib/server/blank';
import { db } from '$lib/server/db';
import { inquiry, rateLink } from '$lib/server/db/schema';
import { editSchema } from './schema';

const crud = contentCrud({
	table: inquiry,
	label: 'Inquiry',
	// Unused: inquiries come from the public contact form, never from here (`fixedRows`).
	addSchema: editSchema,
	editSchema,
	transform: (values, event) => ({ ...blankToNull(values), updatedBy: event.locals.user?.id }),
	// Which sponsor's rate link the inquiry was sent from, by the link's label.
	references: [
		{
			field: 'rateLinkId',
			table: rateLink,
			as: 'rateLink',
			nameColumn: rateLink.label,
			options: async () =>
				(await db.select({ value: rateLink.id, name: rateLink.label }).from(rateLink)).map(
					(row) => ({ value: row.value, name: row.name })
				),
			optionsKey: 'rateLinkList'
		}
	]
});

/** Newest first: the kit lists in id order, and the latest inquiry is the one to answer. */
export const load = async () => {
	const loaded = await crud.load();
	return { ...loaded, rows: loaded.rows.toReversed() };
};

// Edit only. Junk is marked Spam rather than deleted, so nothing a sponsor sent can vanish.
export const actions = { edit: crud.actions.edit };
