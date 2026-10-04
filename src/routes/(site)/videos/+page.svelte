<script lang="ts">
	import Youtube from '@lucide/svelte/icons/youtube';
	import ExternalLink from '$lib/components/site/ExternalLink.svelte';
	import Seo from '$lib/components/site/Seo.svelte';
	import VideoCard from '$lib/components/site/VideoCard.svelte';
	import { inView } from '$lib/attachments';
	import { to } from '$lib/links';
	import { m } from '$lib/paraglide/messages.js';

	let { data } = $props();
	const site = $derived(data.site);

	const tabs = $derived([
		{ kind: 'all', label: m.videos_filter_all() },
		{ kind: 'videos', label: m.videos_filter_videos() },
		{ kind: 'shorts', label: m.videos_filter_shorts() }
	] as const);
	const shorts = $derived(data.kind === 'shorts');
</script>

<Seo
	title="{m.videos_page_title()} · {site.person.fullName}"
	description={m.videos_page_subtitle()}
	path="/videos"
	image={data.headline ? `https://i.ytimg.com/vi/${data.headline.videoId}/hqdefault.jpg` : null}
	siteName={site.person.fullName}
/>

<section class="px-6 pt-36 pb-24">
	<div class="mx-auto max-w-7xl">
		<header class="enter-up mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
			<div class="max-w-3xl">
				<h1 class="mb-4 text-5xl font-extrabold tracking-tight md:text-7xl">
					<span class="text-gradient">{m.videos_page_title()}</span>
				</h1>
				<p class="text-xl text-foreground/70">{m.videos_page_subtitle()}</p>
			</div>
			{#if site.youtube.url}
				<ExternalLink
					href={site.youtube.url}
					class="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-xl bg-red-600 px-6 font-semibold text-white shadow-site-lg transition-transform hover:scale-105"
				>
					<Youtube class="h-5 w-5" />
					{m.videos_subscribe()}
				</ExternalLink>
			{/if}
		</header>

		{#if data.hasShorts || data.kind !== 'all'}
			<nav
				aria-label={m.videos_filter_label()}
				class="enter-up mb-12 flex gap-2"
				style:--delay="0.08s"
			>
				{#each tabs as tab (tab.kind)}
					<a
						href={to('/videos', '', { kind: tab.kind === 'all' ? null : tab.kind })}
						data-sveltekit-noscroll
						aria-current={data.kind === tab.kind ? 'page' : undefined}
						class={[
							'flex min-h-10 items-center rounded-full border px-5 text-sm font-semibold transition-colors',
							data.kind === tab.kind
								? 'border-primary bg-primary text-white'
								: 'border-foreground/15 text-foreground/75 hover:border-primary hover:text-primary'
						]}
					>
						{tab.label}
					</a>
				{/each}
			</nav>
		{/if}

		{#if data.headline}
			<div class="enter-up mb-16" style:--delay="0.12s">
				<VideoCard video={data.headline} large />
			</div>
		{/if}

		{#if data.videos.length}
			<ul
				class={[
					'grid gap-x-6 gap-y-10',
					shorts
						? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
						: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
				]}
			>
				{#each data.videos as video, i (video.videoId)}
					<li class="reveal" style:--delay="{(i % 3) * 0.06}s" {@attach inView()}>
						<VideoCard {video} upright={shorts} />
					</li>
				{/each}
			</ul>
			{#if data.hasMore}
				<div class="mt-14 flex justify-center">
					<a
						href={to('/videos', '', {
							kind: data.kind === 'all' ? null : data.kind,
							pages: data.pages + 1
						})}
						data-sveltekit-noscroll
						class="glass inline-flex min-h-12 items-center rounded-xl px-8 font-semibold hover:text-primary"
					>
						{m.videos_more()}
					</a>
				</div>
			{/if}
		{:else if !data.headline}
			<p class="glass-card rounded-[2rem] p-12 text-center text-lg text-foreground/70">
				{m.videos_empty()}
			</p>
		{/if}
	</div>
</section>
