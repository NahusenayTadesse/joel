<script lang="ts">
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import CirclePlay from '@lucide/svelte/icons/circle-play';
	import { publicFileUrl } from '@nahu/admin-kit/files';
	import { to } from '$lib/links';
	import { m } from '$lib/paraglide/messages.js';
	import type { Site } from '$lib/server/site';
	import Glow from './Glow.svelte';
	import { ICONS } from './icons';

	let { person, hero }: { person: Site['person']; hero: Site['hero'] } = $props();
</script>

<section id="top" class="overflow-hidden px-6 pt-32 pb-20">
	<div class="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
		<div class="enter-left relative z-10">
			<span
				class="mb-6 inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium whitespace-nowrap text-primary"
			>
				{hero.badge}
			</span>
			<h1 class="mb-6 text-5xl leading-[1.1] font-extrabold md:text-7xl">
				{m.hero_title()}
				<br />
				<span class="text-gradient">{person.fullName}</span>
			</h1>
			<p class="mb-10 max-w-xl text-xl leading-relaxed text-foreground/75">
				{hero.description}
			</p>

			<div class="mb-12 flex flex-col gap-4 sm:flex-row">
				<a
					href={to('/videos')}
					class="flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 text-center text-lg font-bold text-white transition-all hover:scale-105 hover:shadow-glow-strong"
				>
					<CirclePlay class="h-5 w-5" />
					{m.hero_watch()}
				</a>
				<a
					href={to('/', 'contact')}
					class="glass flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-center text-lg font-bold text-foreground transition-all hover:text-primary"
				>
					{m.hero_work_with()}
					<ArrowRight class="h-5 w-5" />
				</a>
			</div>

			<!-- Chips that wrap, so three or five highlights sit as well as four. -->
			<ul class="flex flex-wrap gap-3">
				{#each hero.highlights as highlight, i (highlight.id)}
					{@const Icon = ICONS[highlight.icon]}
					<li
						class="glass enter-up flex items-center gap-2 rounded-xl px-3 py-2"
						style:--delay="{0.5 + i * 0.1}s"
					>
						<Icon class="h-4 w-4 shrink-0 text-primary" />
						<span class="text-xs font-semibold whitespace-nowrap text-foreground/85">
							{highlight.name}
						</span>
					</li>
				{/each}
			</ul>
		</div>

		<div class="enter-zoom relative mx-2 sm:mx-0">
			<div
				class="group relative z-10 overflow-hidden rounded-[3rem] border-2 border-foreground/10 shadow-site-2xl"
			>
				{#if person.portrait}
					<!-- Capped on phones, so the photo does not push everything below it out of reach. -->
					<img
						src={publicFileUrl(person.portrait)}
						alt={person.fullName}
						width="1122"
						height="1402"
						fetchpriority="high"
						class="h-auto max-h-[70svh] w-full transform object-cover object-top transition-transform duration-700 group-hover:scale-105 lg:max-h-none"
					/>
				{:else}
					<div class="aspect-[1122/1402] max-h-[70svh] w-full bg-foreground/5 lg:max-h-none"></div>
				{/if}
				<div
					class="absolute inset-0 bg-linear-to-t from-site via-transparent to-transparent opacity-60"
				></div>
			</div>

			<div
				class="glass absolute -top-4 -right-2 z-20 animate-bob-up rounded-2xl p-3 sm:-top-6 sm:-right-6 sm:p-4"
			>
				<div class="text-lg font-bold text-primary sm:text-xl">{hero.reach.value}</div>
				<div class="text-[11px] font-bold tracking-widest text-foreground/75 uppercase">
					{hero.reach.label}
				</div>
			</div>
			<div
				class="glass absolute -bottom-4 -left-2 z-20 animate-bob-down rounded-2xl p-3 sm:-bottom-6 sm:-left-6 sm:p-4"
			>
				<div class="text-lg font-bold text-accent sm:text-xl">{hero.audience.value}</div>
				<div class="text-[11px] font-bold tracking-widest text-foreground/75 uppercase">
					{hero.audience.label}
				</div>
			</div>

			<Glow
				class="absolute top-1/2 left-1/2 -z-10 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 opacity-15"
			/>
		</div>
	</div>
</section>
