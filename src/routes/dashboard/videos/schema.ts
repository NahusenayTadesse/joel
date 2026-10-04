import { z } from 'zod/v4';

/*
 * Only Joel's two choices: whether a video shows, and whether it is the one in the big player.
 * Everything else comes from YouTube and is overwritten by the next sync.
 */
export const editSchema = z.object({
	id: z.coerce.number(),
	isFeatured: z.boolean().default(false),
	status: z.boolean().default(true)
});
