import { contentCrud } from '@nahu/admin-kit/server/crud';
import { lookupDeleteAction } from '@nahu/admin-kit/server/lookupDelete';
import { blankToNull } from '$lib/server/blank';
import { brand } from '$lib/server/db/schema';
import { addSchema, editSchema } from './schema';

const crud = contentCrud({
	table: brand,
	label: 'Brand',
	addSchema,
	editSchema,
	// Stored by the kit; an edit with no new logo keeps the one there is.
	fileFields: ['logo'],
	transform: blankToNull
});

export const load = crud.load;
export const actions = {
	add: crud.actions.add,
	edit: crud.actions.edit,
	delete: lookupDeleteAction(brand, 'brand')
};
