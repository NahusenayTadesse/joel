<script lang="ts">
	import orbs from '$lib/assets/hero-orbs.webp';
	import shapes from '$lib/assets/floating-shapes.webp';
	import Glow from './Glow.svelte';

	/*
	 * Fixed behind the whole page, so it must be cheap to keep on screen while scrolling: gradient
	 * glows rather than blurred circles, no pulsing, and the floating images moved by `transform`
	 * only, which the compositor does without repainting. The images have dark, square backgrounds;
	 * a radial mask fades their edges (once, when drawn) where a blur filter used to hide them.
	 */
</script>

<div class="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
	<Glow class="absolute top-[-25%] left-[-25%] h-[80%] w-[80%] opacity-25" />
	<Glow tone="accent" class="absolute right-[-25%] bottom-[-25%] h-[80%] w-[80%] opacity-25" />
	<img
		src={orbs}
		alt=""
		class="fade-edges absolute top-[20%] right-[10%] z-0 hidden w-[40%] animate-float opacity-20 will-change-transform dark:block"
	/>
	<img
		src={shapes}
		alt=""
		class="fade-edges absolute bottom-[20%] left-[5%] z-0 hidden w-[30%] animate-float opacity-15 will-change-transform dark:block"
		style:animation-delay="3s"
	/>
</div>
