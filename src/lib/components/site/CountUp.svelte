<script lang="ts">
	import { inView } from '$lib/attachments';

	let {
		value,
		suffix = '',
		decimals = 0,
		duration = 2000
	}: { value: number; suffix?: string; decimals?: number; duration?: number } = $props();

	/** The figure while counting; `null` shows the real one (before, after, and without scripts). */
	let current = $state<number | null>(null);
	let frame = 0;

	function start() {
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const began = performance.now();
		const step = (now: number) => {
			const t = Math.min(1, (now - began) / duration);
			current = value * (1 - (1 - t) ** 2);
			frame = t < 1 ? requestAnimationFrame(step) : 0;
			if (t === 1) current = null;
		};
		current = 0;
		frame = requestAnimationFrame(step);
	}

	$effect(() => () => cancelAnimationFrame(frame));

	const factor = $derived(10 ** decimals);
	const shown = $derived(
		current === null
			? value.toFixed(decimals)
			: (Math.floor(current * factor) / factor).toFixed(decimals)
	);
</script>

<span {@attach inView(start)}>{shown}{suffix}</span>
