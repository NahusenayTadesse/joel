<script lang="ts">
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import YouTubeEmbed from '@nahu/admin-kit/components/YouTubeEmbed.svelte';
	import { publicFileUrl } from '@nahu/admin-kit/files';
	import ExternalLink from '$lib/components/site/ExternalLink.svelte';
	import Gallery from '$lib/components/site/Gallery.svelte';
	import Seo from '$lib/components/site/Seo.svelte';
	import { inView } from '$lib/attachments';
	import { readableDate } from '$lib/format';
	import { to } from '$lib/links';
	import { m } from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime';

	let { data } = $props();
	const site = $derived(data.site);
	const project = $derived(data.project);
	const locale = getLocale();

	const facts = $derived(
		[
			{ label: m.project_client(), value: project.client },
			{ label: m.project_category(), value: project.category },
			{
				label: m.project_date(),
				value: project.completedOn ? readableDate(project.completedOn, locale) : null
			},
			{ label: m.project_result(), value: project.result }
		].flatMap((fact) => (fact.value ? [{ label: fact.label, value: fact.value }] : []))
	);

	const structured = $derived({
		'@context': 'https://schema.org',
		'@type': 'CreativeWork',
		name: project.title,
		description: project.summary,
		creator: { '@type': 'Person', name: site.person.fullName },
		...(project.completedOn ? { dateCreated: project.completedOn } : {}),
		...(project.cover ? { image: publicFileUrl(project.cover) } : {})
	});
</script>

<Seo
	title="{project.title} · {site.person.fullName}"
	description={project.summary}
	path="/projects/{project.slug}"
	image={project.cover ?? site.person.portrait}
	type="article"
	siteName={site.person.fullName}
	jsonLd={structured}
/>

<article class="px-6 pt-32 pb-24">
	<div class="mx-auto max-w-5xl">
		<a
			href={to('/projects')}
			class="enter-up mb-8 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-foreground/70 hover:text-primary"
		>
			<ArrowLeft class="h-4 w-4" />
			{m.projects_all()}
		</a>

		<header class="enter-up mb-10" style:--delay="0.05s">
			<h1 class="mb-5 text-4xl leading-tight font-extrabold tracking-tight md:text-6xl">
				{project.title}
			</h1>
			<p class="max-w-3xl text-xl leading-relaxed text-foreground/75">{project.summary}</p>
		</header>

		{#if facts.length || project.externalUrl}
			<div
				class="enter-up glass mb-12 flex flex-wrap items-center gap-x-10 gap-y-5 rounded-[2rem] px-8 py-6"
				style:--delay="0.1s"
			>
				{#each facts as fact (fact.label)}
					<div>
						<p class="text-xs font-bold tracking-widest text-foreground/55 uppercase">
							{fact.label}
						</p>
						<p
							class={[
								'mt-1 font-bold',
								fact.label === m.project_result() ? 'text-gradient text-2xl' : 'text-lg'
							]}
						>
							{fact.value}
						</p>
					</div>
				{/each}
				{#if project.externalUrl}
					<ExternalLink
						href={project.externalUrl}
						class="ms-auto inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 font-semibold text-white shadow-glow transition-transform hover:scale-105"
					>
						{m.project_visit()}
						<ArrowUpRight class="h-4 w-4" />
					</ExternalLink>
				{/if}
			</div>
		{/if}

		{#if project.youtubeUrl}
			<section class="reveal mb-14" aria-label={m.project_video()} {@attach inView()}>
				<div class="overflow-hidden rounded-[2rem] border border-foreground/10 shadow-site-2xl">
					<YouTubeEmbed url={project.youtubeUrl} title={project.title} class="rounded-none" />
				</div>
			</section>
		{:else if project.cover}
			<img
				src={publicFileUrl(project.cover)}
				alt=""
				class="enter-zoom mb-14 w-full rounded-[2rem] border border-foreground/10 object-cover shadow-site-2xl"
			/>
		{/if}

		{#if project.body}
			<div class="reveal article-body mx-auto max-w-3xl" {@attach inView()}>
				<!-- eslint-disable-next-line svelte/no-at-html-tags -- sanitised on save ($lib/server/sanitize) -->
				{@html project.body}
			</div>
		{/if}

		{#if project.images.length}
			<section class="mt-16">
				<h2 class="mb-6 text-2xl font-bold">{m.project_gallery()}</h2>
				<Gallery images={project.images} />
			</section>
		{/if}

		{#if project.next}
			<a
				href={to(`/projects/${project.next.slug}`)}
				class="reveal glass-card group mt-20 flex items-center justify-between gap-6 rounded-[2rem] p-8"
				{@attach inView()}
			>
				<span>
					<span class="block text-xs font-bold tracking-widest text-foreground/55 uppercase">
						{m.project_next()}
					</span>
					<span class="mt-1 block text-2xl font-bold group-hover:text-primary">
						{project.next.title}
					</span>
				</span>
				<span
					class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-transform group-hover:translate-x-1"
				>
					<ArrowRight class="h-5 w-5" />
				</span>
			</a>
		{/if}
	</div>
</article>
