<script lang="ts">
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import { inView } from '$lib/attachments';
	import { compactCount } from '$lib/format';
	import { m } from '$lib/paraglide/messages.js';
	import type { Site } from '$lib/server/site';
	import CountUp from './CountUp.svelte';
	import ExternalLink from './ExternalLink.svelte';
	import Glow from './Glow.svelte';
	import PlatformLogo from './PlatformLogo.svelte';
	import { PLATFORM_COLORS } from './icons';

	let { followers }: { followers: Site['followers'] } = $props();
</script>

<section id="followers" class="relative overflow-hidden px-6 py-20">
	<div class="relative z-10 mx-auto max-w-7xl">
		<div class="reveal mb-16 text-center" style:--reveal-y="20px" {@attach inView()}>
			<h2 class="mb-4 text-4xl font-bold tracking-tight md:text-6xl">
				<span class="text-gradient">{followers.total}</span>
				{m.followers_title()}
			</h2>
			<p class="text-xl text-foreground/70">{m.followers_subtitle()}</p>
		</div>

		<!-- Three to a row, any leftover centred: the cards are rows in the dashboard, not a fixed set. -->
		<div class="flex flex-wrap justify-center gap-8">
			{#each followers.accounts as account, i (account.id)}
				{@const color = PLATFORM_COLORS[account.platform]}
				{@const count = compactCount(account.followers)}
				<!-- The entrance is on the wrapper so the card's own hover transition stays its own. -->
				<div
					class="reveal w-full md:w-[calc((100%-4rem)/3)]"
					style:--delay="{i * 0.1}s"
					{@attach inView()}
				>
					{#snippet body()}
						<div
							class="mb-6 rounded-2xl p-4 transition-transform duration-300 group-hover:scale-110"
							style:color
							style:background-color="{color}10"
						>
							<PlatformLogo platform={account.platform} />
						</div>
						<div class="mb-4 space-y-1">
							<div class="text-4xl font-black tracking-tighter md:text-5xl">
								<CountUp value={count.value} suffix={count.suffix} decimals={count.decimals} />
							</div>
							<div class="text-xs font-bold tracking-widest text-foreground/65 uppercase">
								{m.followers_label()}
							</div>
						</div>
						{#if account.secondaryStat}
							<div
								class="mt-2 rounded-full border border-foreground/10 bg-foreground/5 px-4 py-1.5 text-sm font-semibold text-foreground/85"
							>
								{account.secondaryStat}
							</div>
						{/if}
						{#if account.url}
							<!--
								Shown on hover where there is a pointer to hover with; always on touch
								screens, which have no hover and would otherwise never see it.
							-->
							<div
								class="mt-auto flex items-center gap-2 pt-8 text-sm font-bold text-primary transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:hover)]:opacity-0"
							>
								{m.followers_follow_on({ platform: account.name })}
								<ArrowRight class="h-4 w-4" strokeWidth={3} />
							</div>
						{/if}
					{/snippet}
					{#if account.url}
						<ExternalLink
							href={account.url}
							class="glass-card group flex h-full flex-col items-center rounded-[2.5rem] p-8 text-center transition-transform duration-300 hover:-translate-y-[5px] hover:scale-[1.02]"
						>
							{@render body()}
						</ExternalLink>
					{:else}
						<div
							class="glass-card flex h-full flex-col items-center rounded-[2.5rem] p-8 text-center"
						>
							{@render body()}
						</div>
					{/if}
				</div>
			{/each}
		</div>

		{#if followers.audience.length}
			<div
				class="reveal glass-card mx-auto mt-12 max-w-3xl rounded-[2rem] p-8 md:p-10"
				{@attach inView()}
			>
				<h3 class="mb-6 text-center text-xl font-bold">{m.audience_title()}</h3>
				<ul class="space-y-5">
					{#each followers.audience as stat (stat.id)}
						<li>
							<div class="mb-2 flex items-baseline justify-between gap-4 text-sm">
								<span class="font-semibold text-foreground/85">{stat.label}</span>
								<span class="font-bold text-primary">{stat.value}%</span>
							</div>
							<div class="h-2 overflow-hidden rounded-full bg-foreground/10">
								<div
									class="h-full rounded-full bg-linear-to-r from-primary to-accent"
									style:width="{stat.value}%"
								></div>
							</div>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	</div>

	<div
		class="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-full w-full -translate-x-1/2 -translate-y-1/2"
		aria-hidden="true"
	>
		<Glow class="absolute top-1/4 left-1/4 h-96 w-96 opacity-10" />
		<Glow tone="accent" class="absolute right-1/4 bottom-1/4 h-96 w-96 opacity-10" />
	</div>
</section>
