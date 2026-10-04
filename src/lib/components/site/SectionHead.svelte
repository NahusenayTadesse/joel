<script lang="ts">
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import type { ResolvedPathname } from '$app/types';
	import { inView } from '$lib/attachments';

	/** A section's title, its line under it, and a link to the full page when there is one. */
	let {
		title,
		subtitle = '',
		link = null,
		align = 'left'
	}: {
		title: string;
		subtitle?: string;
		link?: { href: ResolvedPathname; label: string } | null;
		align?: 'left' | 'center';
	} = $props();
</script>

<div
	class={[
		'reveal mb-12 flex flex-col gap-4',
		align === 'center' ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between'
	]}
	style:--reveal-y="20px"
	{@attach inView()}
>
	<div class={align === 'center' ? 'max-w-2xl' : 'max-w-2xl'}>
		<h2 class="mb-3 text-4xl font-extrabold tracking-tight md:text-5xl">{title}</h2>
		{#if subtitle}
			<p class="text-lg text-foreground/70">{subtitle}</p>
		{/if}
	</div>
	{#if link}
		<a
			href={link.href}
			class="group inline-flex min-h-10 shrink-0 items-center gap-2 font-semibold text-primary"
		>
			{link.label}
			<ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" />
		</a>
	{/if}
</div>
