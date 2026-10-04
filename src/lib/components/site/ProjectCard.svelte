<script lang="ts">
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import { publicFileUrl } from '@nahu/admin-kit/files';
	import { parseYouTubeUrl, youtubeThumbnail } from '@nahu/admin-kit/youtube';
	import { to } from '$lib/links';
	import { m } from '$lib/paraglide/messages.js';
	import type { ProjectCard } from '$lib/server/projects';

	let { project, large = false }: { project: ProjectCard; large?: boolean } = $props();

	/** The cover, or else the project video's poster, or else a gradient panel. */
	const image = $derived.by(() => {
		if (project.cover) return publicFileUrl(project.cover);
		const video = parseYouTubeUrl(project.youtubeUrl);
		return video ? youtubeThumbnail(video, 'hq') : null;
	});
</script>

<a
	href={to(`/projects/${project.slug}`)}
	class="glass-card group flex h-full flex-col overflow-hidden rounded-[2rem] transition-transform duration-300 hover:-translate-y-1"
>
	<div class={['relative overflow-hidden', large ? 'aspect-[16/10]' : 'aspect-[4/3]']}>
		{#if image}
			<img
				src={image}
				alt=""
				loading="lazy"
				decoding="async"
				class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
			/>
		{:else}
			<div
				class="h-full w-full bg-linear-to-br from-primary/40 via-accent/30 to-primary/10"
				aria-hidden="true"
			></div>
		{/if}
		{#if project.category}
			<span
				class="absolute top-4 left-4 rounded-full bg-site/85 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur-md"
			>
				{project.category}
			</span>
		{/if}
		<span
			class="absolute top-4 right-4 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-primary text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:opacity-100"
			aria-hidden="true"
		>
			<ArrowUpRight class="h-5 w-5" />
		</span>
	</div>
	<div class="flex flex-1 flex-col gap-3 p-6 md:p-7">
		{#if project.client}
			<p class="text-xs font-bold tracking-widest text-foreground/60 uppercase">{project.client}</p>
		{/if}
		<h3 class={['leading-snug font-bold', large ? 'text-2xl md:text-3xl' : 'text-xl']}>
			{project.title}
		</h3>
		<p class="line-clamp-3 text-foreground/70">{project.summary}</p>
		<div class="mt-auto flex items-center justify-between gap-4 pt-2">
			{#if project.result}
				<span class="text-gradient text-xl font-black">{project.result}</span>
			{/if}
			<span class="ms-auto text-sm font-semibold text-primary">{m.projects_view()}</span>
		</div>
	</div>
</a>
