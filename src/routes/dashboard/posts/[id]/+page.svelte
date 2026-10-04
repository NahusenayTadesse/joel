<script lang="ts">
	import Editor from './Editor.svelte';

	let { data } = $props();
</script>

<!-- Keyed by post, for the reason the project editor gives: "new" becomes its own address on save. -->
{#key data.id}
	<Editor {data} />
{/key}
