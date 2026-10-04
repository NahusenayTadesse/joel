import { z } from 'zod/v4';
import { requiredText } from '$lib/dashboard/schema';

/** Two weeks from today, as the add form's starting expiry: long enough to decide, short enough to lapse. */
function inTwoWeeks() {
	const date = new Date(Date.now() + 14 * 86_400_000);
	return new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Addis_Ababa' }).format(date);
}

const expiresOn = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Pick a date');

/*
 * No token field: the server makes it on add and nothing ever changes it, so a link already sent
 * keeps working through every edit. Zod strips keys it does not know.
 */
export const addSchema = z.object({
	label: requiredText(120),
	expiresOn: expiresOn.default(inTwoWeeks),
	status: z.boolean().default(true)
});

export const editSchema = z.object({
	id: z.coerce.number(),
	label: requiredText(120),
	expiresOn,
	status: z.boolean().default(true)
});
