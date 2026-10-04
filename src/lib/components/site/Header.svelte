<script lang="ts">
	import Menu from '@lucide/svelte/icons/menu';
	import X from '@lucide/svelte/icons/x';
	import { page } from '$app/state';
	import { to } from '$lib/links';
	import { m } from '$lib/paraglide/messages.js';
	import { deLocalizeUrl } from '$lib/paraglide/runtime';
	import type { Site } from '$lib/server/site';
	import LanguageSwitch from './LanguageSwitch.svelte';
	import ThemeToggle from './ThemeToggle.svelte';

	let { person }: { person: Site['person'] } = $props();

	const links = $derived([
		{ href: to('/projects'), path: '/projects', label: m.nav_projects() },
		{ href: to('/videos'), path: '/videos', label: m.nav_videos() },
		{ href: to('/blog'), path: '/blog', label: m.nav_blog() },
		{ href: to('/', 'about'), path: null, label: m.nav_about() },
		{ href: to('/', 'contact'), path: null, label: m.nav_contact() }
	]);

	/** The page being shown, without its language prefix, for marking the current link. */
	const current = $derived(deLocalizeUrl(page.url).pathname);
	const isCurrent = (path: string | null) =>
		path !== null && (current === path || current.startsWith(`${path}/`));

	/** The phone menu. A `<details>`, so it opens without scripts too; scripts add the closing. */
	let menuOpen = $state(false);
</script>

<svelte:window onkeydown={(event) => event.key === 'Escape' && (menuOpen = false)} />

<header class="site-header enter-down fixed top-0 right-0 left-0 z-50 px-4 py-4 sm:px-6">
	<div
		class="glass mx-auto flex max-w-7xl items-center justify-between gap-2 rounded-2xl px-4 py-3 sm:gap-3 sm:px-6"
	>
		<a href={to('/')} class="flex min-h-10 items-center gap-2" aria-label={person.fullName}>
			<span
				class="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-primary to-accent font-bold text-white shadow-site-lg"
			>
				{person.initials}
			</span>
			<span class="hidden text-xl font-bold tracking-tight sm:block">
				{person.firstName} <span class="text-primary">{person.lastName}</span>
			</span>
		</a>

		<nav aria-label={m.nav_sections()} class="hidden items-center gap-6 lg:flex">
			{#each links as link (link.href)}
				<a
					href={link.href}
					aria-current={isCurrent(link.path) ? 'page' : undefined}
					class={[
						'relative py-2 text-sm font-medium transition-colors hover:text-primary',
						isCurrent(link.path) ? 'text-primary' : 'text-foreground/75'
					]}
				>
					{link.label}
					{#if isCurrent(link.path)}
						<span
							class="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-linear-to-r from-primary to-accent"
							aria-hidden="true"
						></span>
					{/if}
				</a>
			{/each}
		</nav>

		<div class="flex items-center gap-2">
			<div class="hidden sm:block"><LanguageSwitch /></div>
			<ThemeToggle />
			<a
				href={to('/', 'contact')}
				class="hidden min-h-10 items-center rounded-xl bg-primary px-4 text-sm font-semibold whitespace-nowrap text-white shadow-glow transition-all hover:scale-105 hover:bg-primary/90 active:scale-95 sm:flex sm:px-5"
			>
				{m.nav_cta({ name: person.firstName })}
			</a>

			<details class="relative lg:hidden" bind:open={menuOpen}>
				<summary
					class="flex h-10 w-10 items-center justify-center rounded-xl border border-foreground/10 bg-foreground/5 text-foreground/85"
					aria-label={m.nav_menu()}
				>
					{#if menuOpen}<X class="h-5 w-5" />{:else}<Menu class="h-5 w-5" />{/if}
				</summary>
				<div
					class="absolute top-full right-0 mt-5 flex w-64 flex-col gap-1 rounded-2xl border border-foreground/10 bg-site-deep/95 p-2 shadow-site-2xl backdrop-blur-xl"
				>
					<nav aria-label={m.nav_sections()} class="flex flex-col">
						{#each links as link (link.href)}
							<a
								href={link.href}
								onclick={() => (menuOpen = false)}
								aria-current={isCurrent(link.path) ? 'page' : undefined}
								class={[
									'rounded-xl px-4 py-3 font-medium transition-colors hover:bg-foreground/5 hover:text-primary',
									isCurrent(link.path) ? 'text-primary' : 'text-foreground/85'
								]}
							>
								{link.label}
							</a>
						{/each}
					</nav>
					<a
						href={to('/', 'contact')}
						onclick={() => (menuOpen = false)}
						class="mt-1 rounded-xl bg-primary px-4 py-3 text-center font-semibold text-white sm:hidden"
					>
						{m.nav_cta({ name: person.firstName })}
					</a>
					<div class="flex justify-center p-2 sm:hidden"><LanguageSwitch /></div>
				</div>
			</details>
		</div>
	</div>
</header>
