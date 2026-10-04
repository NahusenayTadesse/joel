<script lang="ts">
	import Rss from '@lucide/svelte/icons/rss';
	import PostCard from '$lib/components/site/PostCard.svelte';
	import Seo from '$lib/components/site/Seo.svelte';
	import { inView } from '$lib/attachments';
	import { to } from '$lib/links';
	import { m } from '$lib/paraglide/messages.js';

	let { data } = $props();
	const site = $derived(data.site);

	/* The featured post leads, or else the newest, drawn large; the rest follow in a grid. */
	const lead = $derived(data.tag ? null : (data.posts.find((p) => p.isFeatured) ?? data.posts[0]));
	const rest = $derived(data.posts.filter((p) => p !== lead));
</script>

<Seo
	title="{m.blog_page_title()} · {site.person.fullName}"
	description={m.blog_page_subtitle()}
	path="/blog"
	image={lead?.cover ?? site.person.portrait}
	siteName={site.person.fullName}
/>

<svelte:head>
	<link
		rel="alternate"
		type="application/rss+xml"
		title="{site.person.fullName} · {m.blog_page_title()}"
		href="/blog/rss.xml"
	/>
</svelte:head>

<section class="px-6 pt-36 pb-24">
	<div class="mx-auto max-w-7xl">
		<header class="enter-up mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
			<div class="max-w-3xl">
				<h1 class="mb-4 text-5xl font-extrabold tracking-tight md:text-7xl">
					<span class="text-gradient">{m.blog_page_title()}</span>
				</h1>
				<p class="text-xl text-foreground/70">{m.blog_page_subtitle()}</p>
			</div>
			<!-- eslint-disable svelte/no-navigation-without-resolve -- a feed file, not a page -->
			<a
				href="/blog/rss.xml"
				class="inline-flex min-h-10 shrink-0 items-center gap-2 text-sm font-semibold text-foreground/70 hover:text-primary"
			>
				<Rss class="h-4 w-4" />
				{m.blog_rss()}
			</a>
			<!-- eslint-enable svelte/no-navigation-without-resolve -->
		</header>

		{#if data.tags.length}
			<nav
				aria-label={m.blog_filter_label()}
				class="enter-up mb-12 flex flex-wrap gap-2"
				style:--delay="0.08s"
			>
				{#each ['', ...data.tags] as tag (tag)}
					<a
						href={to('/blog', '', { tag })}
						data-sveltekit-noscroll
						aria-current={data.tag === tag ? 'page' : undefined}
						class={[
							'flex min-h-10 items-center rounded-full border px-4 text-sm font-semibold transition-colors',
							data.tag === tag
								? 'border-primary bg-primary text-white'
								: 'border-foreground/15 text-foreground/75 hover:border-primary hover:text-primary'
						]}
					>
						{tag ? `#${tag}` : m.blog_filter_all()}
					</a>
				{/each}
			</nav>
		{/if}

		{#if lead}
			<div class="enter-up mb-10" style:--delay="0.12s">
				<PostCard post={lead} large />
			</div>
		{/if}

		{#if rest.length}
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each rest as post, i (post.id)}
					<div class="reveal" style:--delay="{(i % 3) * 0.08}s" {@attach inView()}>
						<PostCard {post} />
					</div>
				{/each}
			</div>
		{:else if !lead}
			<p class="glass-card rounded-[2rem] p-12 text-center text-lg text-foreground/70">
				{m.blog_empty()}
			</p>
		{/if}
	</div>
</section>
