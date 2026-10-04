import { contentCrud } from '@nahu/admin-kit/server/crud';
import { lookupDeleteAction } from '@nahu/admin-kit/server/lookupDelete';
import { blankToNull } from '$lib/server/blank';
import { socialAccount } from '$lib/server/db/schema';
import { addSchema, editSchema } from './schema';

const crud = contentCrud({
	table: socialAccount,
	label: 'Social account',
	addSchema,
	editSchema,
	// One row per platform: a second TikTok is reported under the platform picker.
	uniqueField: 'platform',
	transform: blankToNull
});

export const load = crud.load;
export const actions = {
	add: crud.actions.add,
	edit: crud.actions.edit,
	delete: lookupDeleteAction(socialAccount, 'social account')
};
