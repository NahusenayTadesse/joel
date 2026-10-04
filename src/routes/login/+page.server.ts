import { redirect } from '@sveltejs/kit';
import { APIError } from 'better-auth/api';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { auth } from '$lib/server/auth';
import { loginSchema } from './schema';
import type { Actions, PageServerLoad } from './$types';

/**
 * Where to go after signing in: the page the kit's guard sent them from, if it is one of ours.
 * Only a local path — `//evil.example` is a protocol-relative URL, not a path.
 */
function afterLogin(url: URL): string {
	const target = url.searchParams.get('redirectTo');
	return target && target.startsWith('/') && !target.startsWith('//') ? target : '/dashboard';
}

export const load: PageServerLoad = async ({ locals, url }) => {
	if (locals.user) redirect(303, afterLogin(url));
	return { form: await superValidate(zod4(loginSchema)) };
};

export const actions: Actions = {
	default: async ({ request, url }) => {
		const form = await superValidate(request, zod4(loginSchema));
		// The password never goes back to the browser, whatever happens.
		const password = form.data.password;
		form.data.password = '';
		if (!form.valid) return fail(400, { form });

		try {
			// The sveltekitCookies plugin sets the session cookie on this response.
			await auth.api.signInEmail({
				body: { email: form.data.email, password },
				headers: request.headers
			});
		} catch (err) {
			if (err instanceof APIError) {
				return message(form, { type: 'error', text: 'Wrong email or password.' }, { status: 400 });
			}
			throw err;
		}

		redirect(303, afterLogin(url));
	}
};
