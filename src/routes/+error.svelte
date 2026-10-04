<script lang="ts">
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import { ModeWatcher } from 'mode-watcher';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import Glow from '$lib/components/site/Glow.svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';

	/**
	 * An error from outside the public pages' layout — the site itself failing to load. Public
	 * pages' own errors use `(site)/+error.svelte`, inside the header and footer.
	 */
	const notFound = $derived(page.status === 404);
</script>

<ModeWatcher themeColors={{ dark: '#01050d', light: '#f6fafd' }} />

<svelte:head>
	<title>{page.status} · {notFound ? m.error_not_found() : m.error_generic()}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="site relative flex min-h-svh items-center justify-center overflow-hidden bg-site px-6">
	<Glow class="absolute top-[-20%] left-[-20%] h-[70%] w-[70%] opacity-25" />
	<Glow tone="accent" class="absolute right-[-20%] bottom-[-20%] h-[70%] w-[70%] opacity-25" />

	<main class="relative z-10 text-center">
		<p class="text-gradient mb-4 text-8xl font-black tracking-tighter md:text-9xl">
			{page.status}
		</p>
		<h1 class="mb-10 text-2xl font-bold md:text-3xl">
			{notFound ? m.error_not_found() : m.error_generic()}
		</h1>
		<a
			href={resolve(localizeHref('/') as '/')}
			class="inline-flex items-center gap-2 rounded-2xl bg-primary px-8 py-4 font-bold text-white shadow-glow transition-all hover:scale-105"
		>
			<ArrowLeft class="h-5 w-5" />
			{m.error_home()}
		</a>
	</main>
</div>
