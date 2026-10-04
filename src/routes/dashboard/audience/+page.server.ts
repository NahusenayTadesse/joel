import { contentCrud } from '@nahu/admin-kit/server/crud';
import { lookupDeleteAction } from '@nahu/admin-kit/server/lookupDelete';
import { blankToNull } from '$lib/server/blank';
import { audienceStat } from '$lib/server/db/schema';
import { addSchema, editSchema } from './schema';

const crud = contentCrud({
	table: audienceStat,
	label: 'Audience figure',
	addSchema,
	editSchema,
	transform: blankToNull
});

export const load = crud.load;
export const actions = {
	add: crud.actions.add,
	edit: crud.actions.edit,
	delete: lookupDeleteAction(audienceStat, 'audience figure')
};
