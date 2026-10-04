<script lang="ts">
	import type { ClassValue } from 'svelte/elements';

	/**
	 * A soft colour cloud behind a section. Position, size and strength come from `class`
	 * (`absolute top-1/4 left-1/4 h-64 w-64 opacity-20`); see `.glow` in layout.css for why it is a
	 * gradient rather than a blurred circle.
	 */
	let { tone = 'primary', class: className }: { tone?: 'primary' | 'accent'; class?: ClassValue } =
		$props();
</script>

<div
	class={['glow pointer-events-none rounded-full', className]}
	style:--glow-color="var(--{tone})"
	aria-hidden="true"
></div>
