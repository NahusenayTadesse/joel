<script lang="ts">
	import { inView } from '$lib/attachments';
	import { highlightSegments } from '$lib/format';
	import { m } from '$lib/paraglide/messages.js';
	import type { Site } from '$lib/server/site';
	import Glow from './Glow.svelte';

	let { about, firstName }: { about: Site['about']; firstName: string } = $props();

	const segments = $derived(highlightSegments(about.text));
</script>

<section id="about" class="relative overflow-hidden px-6 py-24">
	<div class="relative z-10 mx-auto max-w-4xl text-center">
		<div class="reveal" style:--reveal-duration="0.8s" {@attach inView()}>
			<h2 class="mb-8 text-3xl font-bold md:text-5xl">{m.about_heading({ name: firstName })}</h2>
			<div class="glass relative rounded-[2.5rem] p-8 md:p-12">
				<p class="mb-10 text-xl leading-relaxed text-foreground/85 md:text-2xl">
					<!-- No whitespace between these tags: it would show up as extra spaces in the sentence. -->
					{#each segments as segment, i (i)}{#if segment.tone}<span
								class={[
									'font-semibold',
									segment.tone === 'primary' ? 'text-primary' : 'text-accent'
								]}>{segment.text}</span
							>{:else}{segment.text}{/if}{/each}
				</p>
				<!-- A line of type between two rules, not a pill: a pill reads as a button to press. -->
				<div class="flex items-center justify-center gap-4">
					<span class="h-px w-10 bg-linear-to-r from-transparent to-primary/60" aria-hidden="true"
					></span>
					<p class="text-gradient text-2xl font-extrabold tracking-tight md:text-3xl">
						{about.motto}
					</p>
					<span class="h-px w-10 bg-linear-to-l from-transparent to-accent/60" aria-hidden="true"
					></span>
				</div>
				{#if about.tagline}
					<p class="mt-4 text-sm text-foreground/65">{about.tagline}</p>
				{/if}
			</div>
		</div>
	</div>

	<Glow class="absolute top-1/2 -left-32 h-96 w-96 animate-float opacity-15" />
	<Glow tone="accent" class="absolute top-1/3 -right-32 h-80 w-80 animate-float opacity-15" />
</section>
