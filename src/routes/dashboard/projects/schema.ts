import { z } from 'zod/v4';
import { isUsableYouTubeUrl } from '@nahu/admin-kit/youtube';
import {
	imageFile,
	optionalDate,
	optionalText,
	optionalUrl,
	orderField,
	requiredText,
	richText
} from '$lib/dashboard/schema';

export const projectSchema = z.object({
	title: requiredText(160),
	titleAm: optionalText(160),
	/** Left empty, it is made from the title; either way it is made unique on save. */
	slug: optionalText(120),
	client: optionalText(120),
	category: optionalText(60),
	categoryAm: optionalText(60),
	summary: requiredText(300),
	summaryAm: optionalText(300),
	result: optionalText(60),
	resultAm: optionalText(60),
	youtubeUrl: optionalText(255).refine(
		(value) => !value || isUsableYouTubeUrl(value),
		'Paste a YouTube video link: youtube.com/watch?v=…, youtu.be/… or a Shorts link'
	),
	externalUrl: optionalUrl,
	completedOn: optionalDate,
	cover: imageFile.optional(),
	body: richText,
	bodyAm: richText,
	isFeatured: z.boolean().default(false),
	sortOrder: orderField,
	status: z.boolean().default(true)
});

/** Several images at once, from the kit's `GalleryUpload`. */
export const imagesAddSchema = z.object({
	images: z.array(imageFile).min(1, 'Choose at least one image').default([])
});

export const imageEditSchema = z.object({
	id: z.coerce.number(),
	caption: optionalText(200),
	captionAm: optionalText(200)
});
