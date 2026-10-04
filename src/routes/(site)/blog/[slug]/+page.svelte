<script lang="ts">
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import Eye from '@lucide/svelte/icons/eye';
	import { publicFileUrl } from '@nahu/admin-kit/files';
	import PostCard from '$lib/components/site/PostCard.svelte';
	import Seo from '$lib/components/site/Seo.svelte';
	import { inView } from '$lib/attachments';
	import { readableDate } from '$lib/format';
	import { to } from '$lib/links';
	import { m } from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime';

	let { data } = $props();
	const site = $derived(data.site);
	const post = $derived(data.post);
	const locale = getLocale();

	const structured = $derived({
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: post.title,
		description: post.excerpt ?? undefined,
		inLanguage: post.locale,
		datePublished: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
		dateModified: new Date(post.updatedAt).toISOString(),
		author: { '@type': 'Person', name: site.person.fullName },
		keywords: post.tags?.join(', ') || undefined,
		...(post.cover ? { image: publicFileUrl(post.cover) } : {})
	});
</script>

<Seo
	title="{post.title} · {site.person.fullName}"
	description={post.excerpt ?? site.meta.description}
	path="/blog/{post.slug}"
	image={post.cover ?? site.person.portrait}
	type="article"
	publishedTime={post.publishedAt}
	noindex={data.preview}
	siteName={site.person.fullName}
	jsonLd={data.preview ? null : structured}
/>

<article class="px-6 pt-32 pb-24" lang={post.locale}>
	<div class="mx-auto max-w-3xl">
		{#if data.preview}
			<p
				class="mb-8 flex items-center gap-2 rounded-2xl border border-primary/30 bg-primary/10 px-5 py-3 text-sm font-semibold text-primary"
				lang={locale}
			>
				<Eye class="h-4 w-4" />
				{m.blog_preview()}
			</p>
		{/if}

		<a
			href={to('/blog')}
			class="enter-up mb-8 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-foreground/70 hover:text-primary"
			lang={locale}
		>
			<ArrowLeft class="h-4 w-4" />
			{m.blog_back()}
		</a>

		<header class="enter-up mb-10" style:--delay="0.05s">
			<div
				class="mb-5 flex flex-wrap items-center gap-2 text-sm font-semibold text-foreground/60"
				lang={locale}
			>
				{#if post.publishedAt}
					<time datetime={new Date(post.publishedAt).toISOString()}>
						{readableDate(post.publishedAt, locale)}
					</time>
					<span aria-hidden="true">·</span>
				{/if}
				<span>{m.blog_minutes({ count: post.readingMinutes })}</span>
			</div>
			<h1 class="mb-6 text-4xl leading-tight font-extrabold tracking-tight md:text-6xl">
				{post.title}
			</h1>
			{#if post.excerpt}
				<p class="text-xl leading-relaxed text-foreground/75">{post.excerpt}</p>
			{/if}
			{#if post.tags?.length}
				<ul class="mt-6 flex flex-wrap gap-2">
					{#each post.tags as tag (tag)}
						<li>
							<a
								href={to('/blog', '', { tag })}
								class="flex min-h-9 items-center rounded-full border border-foreground/15 px-3 text-sm text-foreground/75 hover:border-primary hover:text-primary"
							>
								#{tag}
							</a>
						</li>
					{/each}
				</ul>
			{/if}
		</header>
	</div>

	{#if post.cover}
		<div class="mx-auto mb-14 max-w-5xl">
			<img
				src={publicFileUrl(post.cover)}
				alt=""
				class="enter-zoom w-full rounded-[2rem] border border-foreground/10 object-cover shadow-site-2xl"
			/>
		</div>
	{/if}

	<div class="mx-auto max-w-3xl">
		<div class="article-body">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -- sanitised on save ($lib/server/sanitize) -->
			{@html post.body}
		</div>

		<aside
			class="reveal glass-card mt-16 flex flex-col items-center gap-5 rounded-[2rem] p-8 text-center sm:flex-row sm:text-left"
			lang={locale}
			{@attach inView()}
		>
			{#if site.person.portrait}
				<img
					src={publicFileUrl(site.person.portrait)}
					alt=""
					class="h-20 w-20 shrink-0 rounded-full object-cover object-top"
				/>
			{/if}
			<div class="flex-1">
				<p class="text-lg font-bold">{site.person.fullName}</p>
				<p class="text-foreground/70">{site.hero.description}</p>
			</div>
			<a
				href={to('/videos')}
				class="inline-flex min-h-11 shrink-0 items-center rounded-xl bg-primary px-5 font-semibold text-white shadow-glow"
			>
				{m.hero_watch()}
			</a>
		</aside>
	</div>

	{#if data.related.length}
		<section class="mx-auto mt-20 max-w-5xl" lang={locale}>
			<h2 class="mb-8 text-2xl font-bold">{m.blog_more()}</h2>
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				{#each data.related as other (other.id)}
					<PostCard post={other} />
				{/each}
			</div>
		</section>
	{/if}
</article>
