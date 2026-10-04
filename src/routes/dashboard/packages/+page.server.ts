import { contentCrud } from '@nahu/admin-kit/server/crud';
import { lookupDeleteAction } from '@nahu/admin-kit/server/lookupDelete';
import { blankToNull } from '$lib/server/blank';
import { sponsorshipPackage } from '$lib/server/db/schema';
import { addSchema, editSchema } from './schema';

const crud = contentCrud({
	table: sponsorshipPackage,
	label: 'Package',
	addSchema,
	editSchema,
	// Typed one per line, stored as a list.
	listFields: ['features', 'featuresAm'],
	transform: blankToNull
});

/**
 * The lists go to the page as one line per feature: the edit dialog seeds its textareas straight
 * from the row, and an array there would show as "a,b,c" and save back as one feature.
 */
export const load = async () => {
	const loaded = await crud.load();
	return {
		...loaded,
		rows: loaded.rows.map((row) => ({
			...row,
			features: row.features.join('\n'),
			featuresAm: row.featuresAm?.join('\n') ?? ''
		}))
	};
};

/*
 * The delete is `lookupDeleteAction`, not `crud.actions.delete`: the table's delete button posts a
 * plain form, and only the lookup action answers with the flash message the layout shows.
 */
export const actions = {
	add: crud.actions.add,
	edit: crud.actions.edit,
	delete: lookupDeleteAction(sponsorshipPackage, 'package')
};
