<script lang="ts">
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import { page } from '$app/state';
	import { to } from '$lib/links';
	import { m } from '$lib/paraglide/messages.js';

	/** A public page's error, inside the site's own header and footer. */
	const notFound = $derived(page.status === 404);
</script>

<svelte:head>
	<title>{page.status} · {notFound ? m.error_not_found() : m.error_generic()}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="flex min-h-[75vh] items-center justify-center px-6 pt-32 pb-24">
	<div class="enter-up text-center">
		<p class="text-gradient mb-4 text-8xl font-black tracking-tighter md:text-9xl">
			{page.status}
		</p>
		<h1 class="mb-10 text-2xl font-bold md:text-3xl">
			{notFound ? m.error_not_found() : m.error_generic()}
		</h1>
		<a
			href={to('/')}
			class="inline-flex items-center gap-2 rounded-2xl bg-primary px-8 py-4 font-bold text-white shadow-glow transition-all hover:scale-105"
		>
			<ArrowLeft class="h-5 w-5" />
			{m.error_home()}
		</a>
	</div>
</section>
