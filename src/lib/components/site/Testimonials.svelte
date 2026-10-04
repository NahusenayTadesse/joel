<script lang="ts">
	import Quote from '@lucide/svelte/icons/quote';
	import { inView } from '$lib/attachments';
	import { m } from '$lib/paraglide/messages.js';
	import type { Site } from '$lib/server/site';
	import SectionHead from './SectionHead.svelte';

	/** What sponsors said. The page leaves this out while there are none. */
	let { testimonials }: { testimonials: Site['testimonials'] } = $props();
</script>

<section id="testimonials" class="px-6 py-24">
	<div class="mx-auto max-w-7xl">
		<SectionHead title={m.testimonials_title()} align="center" />
		<div class="flex flex-wrap justify-center gap-6">
			{#each testimonials as item, i (item.id)}
				<figure
					class="reveal glass relative w-full rounded-[2rem] p-8 md:w-[calc((100%-1.5rem)/2)]"
					style:--delay="{(i % 2) * 0.1}s"
					{@attach inView()}
				>
					<Quote class="mb-4 h-8 w-8 text-primary/60" aria-hidden="true" />
					<blockquote class="mb-6 text-lg leading-relaxed text-foreground/85">
						{item.quote}
					</blockquote>
					<figcaption>
						<span class="block font-bold">{item.author}</span>
						{#if item.role}
							<span class="block text-sm text-foreground/65">{item.role}</span>
						{/if}
					</figcaption>
				</figure>
			{/each}
		</div>
	</div>
</section>
