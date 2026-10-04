<script lang="ts">
	import { publicFileUrl } from '@nahu/admin-kit/files';
	import { m } from '$lib/paraglide/messages.js';
	import type { Site } from '$lib/server/site';

	let { brands }: { brands: Site['brands'] } = $props();
</script>

<section
	id="collabs"
	class="overflow-hidden border-y border-foreground/5 bg-foreground/[0.02] py-14"
>
	<div class="mx-auto mb-8 flex max-w-7xl flex-col items-center px-6">
		<p class="text-sm font-bold tracking-[0.3em] text-foreground/60 uppercase">
			{m.brands_heading()}
		</p>
	</div>

	<!-- The logos twice over, scrolled by half their width: the second copy lands where the first began. -->
	<div class="relative flex overflow-x-hidden">
		<!--
			Light tiles, full colour: the uploaded logos mix white backgrounds with dark text on
			transparent ones, and only a light tile keeps every one of them legible.
		-->
		<div class="flex animate-scroll py-4 whitespace-nowrap hover:[animation-play-state:paused]">
			{#each [0, 1] as copy (copy)}
				{#each brands as brand (brand.id)}
					<div
						class="mx-4 flex h-24 min-w-[150px] items-center justify-center rounded-2xl border border-foreground/5 bg-white/95 px-6 py-4 shadow-site-lg md:mx-6 md:min-w-[200px]"
						aria-hidden={copy === 1 ? 'true' : undefined}
					>
						<img
							src={publicFileUrl(brand.logo)}
							alt={copy === 0 ? brand.name : ''}
							loading="lazy"
							class="max-h-14 w-auto object-contain"
						/>
					</div>
				{/each}
			{/each}
		</div>
	</div>
</section>
