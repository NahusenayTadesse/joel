import { contentCrud } from '@nahu/admin-kit/server/crud';
import { lookupDeleteAction } from '@nahu/admin-kit/server/lookupDelete';
import { blankToNull } from '$lib/server/blank';
import { testimonial } from '$lib/server/db/schema';
import { addSchema, editSchema } from './schema';

const crud = contentCrud({
	table: testimonial,
	label: 'Testimonial',
	addSchema,
	editSchema,
	transform: blankToNull
});

export const load = crud.load;
export const actions = {
	add: crud.actions.add,
	edit: crud.actions.edit,
	delete: lookupDeleteAction(testimonial, 'testimonial')
};
