import { error, json } from '@sveltejs/kit';
import { publicFileUrl } from '@nahu/admin-kit/files';
import { saveUploadedFile, UploadRefused } from '@nahu/admin-kit/server/files';
import { db } from '$lib/server/db';
import { editorUpload } from '$lib/server/db/schema';

/**
 * Images put into a post or project body from the rich text editor's image button.
 *
 * Saved like any upload, then recorded in `editor_upload`: the public media route serves only
 * names the database vouches for, and a body image belongs to no other row. Answers `{ url }`,
 * which the editor inserts.
 */
export const POST = async ({ request, locals }) => {
	// `kitHandle` already refuses a signed-out POST here; this keeps the route safe on its own.
	if (!locals.user) error(401, 'Sign in to upload.');

	const posted = await request.formData().catch(() => null);
	const file = posted?.get('file');
	if (!(file instanceof File) || !file.type.startsWith('image/')) {
		return json({ message: 'Choose an image to upload.' }, { status: 400 });
	}

	try {
		const fileName = await saveUploadedFile(file);
		await db.insert(editorUpload).values({ fileName, createdBy: locals.user.id });
		return json({ url: publicFileUrl(fileName) });
	} catch (err) {
		if (err instanceof UploadRefused) return json({ message: err.message }, { status: 400 });
		throw err;
	}
};
