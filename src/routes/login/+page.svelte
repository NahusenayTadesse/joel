<script lang="ts">
	import LogIn from '@lucide/svelte/icons/log-in';
	import { Button } from '@nahu/admin-kit/components/ui/button/index.js';
	import Errors from '@nahu/admin-kit/formComponents/Errors.svelte';
	import FormCard from '@nahu/admin-kit/formComponents/FormCard.svelte';
	import InputComp from '@nahu/admin-kit/formComponents/InputComp.svelte';
	import LoadingBtn from '@nahu/admin-kit/formComponents/LoadingBtn.svelte';
	import { createForm } from '@nahu/admin-kit/forms/createForm';
	import { Toaster } from 'svelte-sonner';
	import { loginSchema } from './schema';

	let { data } = $props();

	// svelte-ignore state_referenced_locally
	const { form, errors, enhance, delayed, allErrors } = createForm(data.form, loginSchema);
</script>

<svelte:head>
	<title>Sign in · Dashboard</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<Toaster richColors />

<main class="flex min-h-screen items-center justify-center p-4">
	<FormCard title="Sign in" description="The dashboard for the sponsorship site.">
		<form method="post" use:enhance class="flex flex-col gap-4">
			<Errors allErrors={$allErrors} />
			<InputComp {form} {errors} name="email" label="Email" type="email" required />
			<InputComp {form} {errors} name="password" label="Password" type="password" required />
			<Button type="submit" class="mt-2">
				{#if $delayed}
					<LoadingBtn name="Signing in" />
				{:else}
					<LogIn class="h-4 w-4" /> Sign in
				{/if}
			</Button>
		</form>
	</FormCard>
</main>
