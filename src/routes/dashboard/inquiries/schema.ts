import { z } from 'zod/v4';
import { INQUIRY_STAGES } from '$lib/content';
import { choices, optionalText } from '$lib/dashboard/schema';

export const stageChoices = choices(INQUIRY_STAGES, {
	new: 'New',
	contacted: 'Contacted',
	won: 'Booked',
	lost: 'Not going ahead',
	spam: 'Spam'
});

/*
 * Only the stage and Joel's note: everything else is what the sponsor wrote, and stays as they
 * wrote it. Zod strips the other keys, so an edit never touches them.
 */
export const editSchema = z.object({
	id: z.coerce.number(),
	stage: z.enum(INQUIRY_STAGES),
	note: optionalText(2000)
});
