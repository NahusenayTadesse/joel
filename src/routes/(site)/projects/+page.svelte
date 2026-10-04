<script lang="ts">
	import ProjectCard from '$lib/components/site/ProjectCard.svelte';
	import Seo from '$lib/components/site/Seo.svelte';
	import { inView } from '$lib/attachments';
	import { m } from '$lib/paraglide/messages.js';

	let { data } = $props();
	const site = $derived(data.site);

	/** Every category in use, for the filter; "all" when none is picked. */
	const categories = $derived([
		...new Set(data.projects.map((p) => p.category).filter((c): c is string => !!c))
	]);
	let category = $state<string | null>(null);
	const shown = $derived(
		category ? data.projects.filter((p) => p.category === category) : data.projects
	);
</script>

<Seo
	title="{m.projects_page_title()} · {site.person.fullName}"
	description={m.projects_page_subtitle()}
	path="/projects"
	image={data.projects[0]?.cover ?? site.person.portrait}
	siteName={site.person.fullName}
/>

<section class="px-6 pt-36 pb-24">
	<div class="mx-auto max-w-7xl">
		<header class="enter-up mb-12 max-w-3xl">
			<h1 class="mb-4 text-5xl font-extrabold tracking-tight md:text-7xl">
				<span class="text-gradient">{m.projects_page_title()}</span>
			</h1>
			<p class="text-xl text-foreground/70">{m.projects_page_subtitle()}</p>
		</header>

		{#if categories.length > 1}
			<div class="enter-up mb-10 flex flex-wrap gap-2" style:--delay="0.1s" role="group">
				{#each [null, ...categories] as option (option)}
					<button
						type="button"
						onclick={() => (category = option)}
						aria-pressed={category === option}
						class={[
							'min-h-10 rounded-full border px-4 text-sm font-semibold transition-colors',
							category === option
								? 'border-primary bg-primary text-white'
								: 'border-foreground/15 text-foreground/75 hover:border-primary hover:text-primary'
						]}
					>
						{option ?? m.videos_filter_all()}
					</button>
				{/each}
			</div>
		{/if}

		{#if shown.length}
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each shown as project, i (project.id)}
					<div
						class={['reveal', i === 0 && !category ? 'md:col-span-2' : '']}
						style:--delay="{(i % 3) * 0.08}s"
						{@attach inView()}
					>
						<ProjectCard {project} large={i === 0 && !category} />
					</div>
				{/each}
			</div>
		{:else}
			<p class="glass-card rounded-[2rem] p-12 text-center text-lg text-foreground/70">
				{m.projects_empty()}
			</p>
		{/if}
	</div>
</section>
