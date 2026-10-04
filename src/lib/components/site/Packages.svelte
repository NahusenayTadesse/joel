<script lang="ts">
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import Check from '@lucide/svelte/icons/check';
	import Sparkles from '@lucide/svelte/icons/sparkles';
	import { inView } from '$lib/attachments';
	import { formatPrice } from '$lib/format';
	import { m } from '$lib/paraglide/messages.js';
	import type { Rates } from '$lib/server/rates';
	import { ICONS, PACKAGE_TONE_TEXT } from './icons';

	let {
		packages,
		customTags,
		terms,
		onchoose,
		heading = true
	}: {
		packages: Rates['packages'];
		customTags: string[];
		terms: Rates['terms'];
		/** A package was picked: its id, or `custom`. The page takes the visitor to the form. */
		onchoose: (choice: string) => void;
		/** The section's own title; off where the page's title already says it (the rates page). */
		heading?: boolean;
	} = $props();

	/**
	 * The buttons are links to `?package=…#contact`, which preselects the package without scripts.
	 * With them, the page does it in place instead of reloading — unless the visitor asked for a
	 * new tab.
	 */
	function choose(event: MouseEvent, choice: string) {
		if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
		event.preventDefault();
		onchoose(choice);
	}
</script>

<section id="packages" class="px-6 py-24">
	<div class="mx-auto max-w-7xl">
		{#if heading}
			<div class="mb-16 text-center">
				<h2 class="mb-4 text-4xl font-extrabold md:text-6xl">{m.packages_title()}</h2>
				<p class="mx-auto max-w-2xl text-lg text-foreground/70">{m.packages_subtitle()}</p>
			</div>
		{/if}

		<!-- Three to a row, any leftover centred, so a fourth package does not sit alone at the left. -->
		<div class="mb-16 flex flex-wrap justify-center gap-8">
			{#each packages as pkg, i (pkg.id)}
				{@const Icon = ICONS[pkg.icon]}
				<div
					class={[
						'reveal glass-card relative flex w-full flex-col rounded-[2rem] p-8 md:w-[calc((100%-4rem)/3)]',
						pkg.isFeatured && 'z-10 md:scale-105'
					]}
					style:--delay="{i * 0.1}s"
					{@attach inView()}
				>
					{#if pkg.isFeatured && pkg.badge}
						<div
							class="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-bold tracking-widest whitespace-nowrap text-white uppercase"
						>
							{pkg.badge}
						</div>
					{/if}
					<div class="mb-6">
						<Icon class={['h-8 w-8', PACKAGE_TONE_TEXT[pkg.tone]]} />
					</div>
					<h3 class="mb-2 text-2xl font-bold">{pkg.name}</h3>
					<div class="mb-8">
						<div class="flex items-baseline gap-1">
							<span class="text-4xl font-extrabold">{formatPrice(pkg.price)}</span>
							<span class="text-sm text-foreground/70">{m.packages_currency()}</span>
						</div>
						{#if terms.netPriceNote}
							<div class="mt-1 text-xs font-medium text-foreground/65">{terms.netPriceNote}</div>
						{/if}
					</div>
					<ul class="mb-10 grow space-y-4">
						{#each pkg.features as feature, f (f)}
							<li class="flex items-start gap-3 text-sm text-foreground/85">
								<Check class="mt-0.5 h-4 w-4 shrink-0 text-primary" />
								<span>{feature}</span>
							</li>
						{/each}
					</ul>
					<!-- eslint-disable svelte/no-navigation-without-resolve -- this page, with a query -->
					<a
						href="?package={pkg.id}#contact"
						onclick={(event) => choose(event, String(pkg.id))}
						class={[
							'flex w-full items-center justify-center gap-2 rounded-xl py-4 text-center font-bold transition-all hover:scale-105 active:scale-95',
							pkg.isFeatured
								? 'bg-accent text-white shadow-site-lg hover:bg-accent/90'
								: 'bg-foreground/10 text-foreground hover:bg-foreground/20'
						]}
					>
						{m.packages_choose()}
						<ArrowRight class="h-4 w-4" />
					</a>
					<!-- eslint-enable svelte/no-navigation-without-resolve -->
				</div>
			{/each}
		</div>

		<div
			class="reveal glass-card flex flex-col items-center gap-10 rounded-[2.5rem] p-8 md:flex-row md:p-12"
			{@attach inView()}
		>
			<div class="flex-1">
				<div class="mb-4 flex items-center gap-3">
					<Sparkles class="h-10 w-10 shrink-0 text-primary" />
					<h3 class="text-3xl font-bold">{m.custom_title()}</h3>
				</div>
				<p class="mb-6 text-lg text-foreground/75">{m.custom_description()}</p>
				<ul class="grid grid-cols-2 gap-3 md:grid-cols-3">
					{#each customTags as tag (tag)}
						<li class="flex items-center gap-2 text-sm font-semibold text-foreground/70">
							<span class="h-1 w-1 shrink-0 rounded-full bg-primary"></span>
							{tag}
						</li>
					{/each}
				</ul>
			</div>
			<div class="flex flex-col items-center gap-4 md:items-end">
				{#if terms.customPrice}
					<div class="text-center md:text-right">
						<p class="mb-1 text-sm font-bold tracking-wider text-foreground/60 uppercase">
							{m.custom_starting_from()}
						</p>
						<p class="text-2xl font-bold">{terms.customPrice}</p>
					</div>
				{/if}
				<!-- eslint-disable svelte/no-navigation-without-resolve -- this page, with a query -->
				<a
					href="?package=custom#contact"
					onclick={(event) => choose(event, 'custom')}
					class="flex items-center gap-2 rounded-xl bg-primary px-10 py-4 font-bold whitespace-nowrap text-white shadow-glow transition-all hover:scale-105 active:scale-95"
				>
					{m.custom_request()}
					<ArrowRight class="h-5 w-5" />
				</a>
				<!-- eslint-enable svelte/no-navigation-without-resolve -->
			</div>
		</div>

		{#if terms.notes.length}
			<div class="mt-12 flex flex-col items-center gap-2 text-center text-sm text-foreground/60">
				{#each terms.notes as note, i (i)}
					<p>{note}</p>
				{/each}
			</div>
		{/if}
	</div>
</section>
