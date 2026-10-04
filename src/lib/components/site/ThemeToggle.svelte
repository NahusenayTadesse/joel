<script lang="ts">
	import Moon from '@lucide/svelte/icons/moon';
	import Sun from '@lucide/svelte/icons/sun';
	import { toggleMode } from 'mode-watcher';
	import { m } from '$lib/paraglide/messages.js';

	/*
	 * Light or dark. Which icon shows is decided by the `.dark` class mode-watcher puts on <html>
	 * before the first paint, not by script state, so the server-rendered button is already right.
	 */
</script>

<button
	type="button"
	onclick={toggleMode}
	aria-label={m.theme_toggle()}
	title={m.theme_toggle()}
	class="flex h-10 w-10 items-center justify-center rounded-xl border border-foreground/10 bg-foreground/5 text-foreground/80 transition-colors hover:text-primary"
>
	<Sun class="hidden h-5 w-5 dark:block" />
	<Moon class="h-5 w-5 dark:hidden" />
</button>
