<script lang="ts">
	import { publicFileUrl } from '@nahu/admin-kit/files';
	import { readableDate } from '$lib/format';
	import { to } from '$lib/links';
	import { m } from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime';
	import type { PostCard } from '$lib/server/posts';

	let { post, large = false }: { post: PostCard; large?: boolean } = $props();
	const locale = getLocale();
</script>

<a
	href={to(`/blog/${post.slug}`)}
	class={[
		'glass-card group flex h-full overflow-hidden rounded-[2rem] transition-transform duration-300 hover:-translate-y-1',
		large ? 'flex-col md:flex-row' : 'flex-col'
	]}
>
	<div
		class={[
			'relative shrink-0 overflow-hidden',
			large ? 'aspect-[16/10] md:aspect-auto md:w-1/2' : 'aspect-[16/9]'
		]}
	>
		{#if post.cover}
			<img
				src={publicFileUrl(post.cover)}
				alt=""
				loading="lazy"
				decoding="async"
				class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
			/>
		{:else}
			<div
				class="flex h-full w-full items-end bg-linear-to-br from-primary/30 via-accent/20 to-transparent p-6"
				aria-hidden="true"
			>
				<span class="text-gradient line-clamp-2 text-3xl font-black">{post.title}</span>
			</div>
		{/if}
	</div>
	<div class={['flex flex-1 flex-col gap-3', large ? 'p-7 md:p-10' : 'p-6']}>
		<div class="flex flex-wrap items-center gap-2 text-xs font-semibold text-foreground/60">
			{#if post.publishedAt}
				<time datetime={new Date(post.publishedAt).toISOString()}>
					{readableDate(post.publishedAt, locale)}
				</time>
				<span aria-hidden="true">·</span>
			{/if}
			<span>{m.blog_minutes({ count: post.readingMinutes })}</span>
			{#if post.locale !== locale}
				<span class="rounded-full bg-primary/10 px-2 py-0.5 text-primary" lang={post.locale}>
					{post.locale === 'am' ? m.blog_lang_am() : m.blog_lang_en()}
				</span>
			{/if}
		</div>
		<h3
			class={['leading-snug font-bold', large ? 'text-2xl md:text-4xl' : 'text-xl']}
			lang={post.locale}
		>
			{post.title}
		</h3>
		{#if post.excerpt}
			<p
				class={['text-foreground/70', large ? 'line-clamp-4 text-lg' : 'line-clamp-3']}
				lang={post.locale}
			>
				{post.excerpt}
			</p>
		{/if}
		{#if post.tags?.length}
			<ul class="mt-auto flex flex-wrap gap-2 pt-2">
				{#each post.tags.slice(0, 3) as tag (tag)}
					<li
						class="rounded-full border border-foreground/10 px-2.5 py-0.5 text-xs text-foreground/70"
					>
						#{tag}
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</a>
