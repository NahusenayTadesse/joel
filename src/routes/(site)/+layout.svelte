<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import { setKitLabels } from '@nahu/admin-kit/labels';
	import { onNavigate } from '$app/navigation';
	import Background from '$lib/components/site/Background.svelte';
	import Footer from '$lib/components/site/Footer.svelte';
	import Header from '$lib/components/site/Header.svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime';

	let { data, children } = $props();
	const site = $derived(data.site);

	// The kit's video player speaks the visitor's language too.
	setKitLabels(() => ({
		youtubePlay: (title: string) => m.video_play({ title }),
		youtubeWatch: m.videos_watch()
	}));

	/*
	 * Page changes cross-fade (see "Page transitions" in layout.css). Browsers without the View
	 * Transitions API, and visitors who prefer less motion, simply change page.
	 */
	onNavigate((navigation) => {
		if (!document.startViewTransition) return;
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		// Moving within one page (a section link, a filter) is not a page change.
		if (navigation.from?.url.pathname === navigation.to?.url.pathname) return;
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<!-- Light or dark before the first paint, from the visitor's choice or their system's. -->
<ModeWatcher themeColors={{ dark: '#01050d', light: '#f6fafd' }} />

<svelte:head>
	{#if getLocale() === 'am'}
		<link rel="preconnect" href="https://fonts.googleapis.com" />
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
		<link
			rel="stylesheet"
			href="https://fonts.googleapis.com/css2?family=Noto+Sans+Ethiopic:wght@400..900&display=swap"
		/>
	{/if}
</svelte:head>

<div class="site relative min-h-screen w-full overflow-x-hidden bg-site text-foreground">
	<a
		href="#main"
		class="fixed top-4 left-4 z-[60] -translate-y-24 rounded-xl bg-primary px-4 py-3 font-semibold text-white transition-transform focus:translate-y-0"
	>
		{m.skip_to_content()}
	</a>

	<Background />

	<div class="relative z-10 flex min-h-screen flex-col">
		<Header person={site.person} />
		<main id="main" class="flex-1">
			{@render children()}
		</main>
		<Footer person={site.person} contact={site.contact} footer={site.footer} />
	</div>
</div>
