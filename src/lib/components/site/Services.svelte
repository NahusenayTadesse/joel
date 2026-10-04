<script lang="ts">
	import { inView } from '$lib/attachments';
	import { m } from '$lib/paraglide/messages.js';
	import type { Site } from '$lib/server/site';
	import { SERVICE_ICON_MAP } from './icons';
	import SectionHead from './SectionHead.svelte';

	let { services }: { services: Site['services'] } = $props();
</script>

<section id="services" class="px-6 py-24">
	<div class="mx-auto max-w-7xl">
		<SectionHead title={m.services_title()} subtitle={m.services_subtitle()} />
		<ul class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
			{#each services as item, i (item.id)}
				{@const Icon = SERVICE_ICON_MAP[item.icon]}
				<li
					class="reveal glass-card group rounded-[2rem] p-7 transition-transform duration-300 hover:-translate-y-1"
					style:--delay="{(i % 4) * 0.08}s"
					{@attach inView()}
				>
					<span
						class="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-accent text-white shadow-glow transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
					>
						<Icon class="h-6 w-6" />
					</span>
					<h3 class="mb-2 text-xl font-bold">{item.title}</h3>
					<p class="leading-relaxed text-foreground/70">{item.description}</p>
				</li>
			{/each}
		</ul>
	</div>
</section>
