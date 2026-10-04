<script lang="ts">
	import Editor from './Editor.svelte';

	let { data } = $props();
</script>

<!--
	Keyed by project: saving a new project moves to its own address, which SvelteKit renders with
	this same component. Without the key the form would keep the empty "new" form it started with.
-->
{#key data.id}
	<Editor {data} />
{/key}
