<script lang="ts">
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	/** A link off the site: opens in a new tab, and tells the other site nothing about this one. */
	let { href, children, ...rest }: HTMLAnchorAttributes & { href: string } = $props();
</script>

<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- always an external URL -->
<a {href} target="_blank" rel="noopener noreferrer" {...rest}>{@render children?.()}</a>
