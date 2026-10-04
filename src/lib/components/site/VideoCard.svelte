<script lang="ts">
	import YouTubeEmbed from '@nahu/admin-kit/components/YouTubeEmbed.svelte';
	import { youtubeVideo } from '@nahu/admin-kit/youtube';
	import { compactNumber, readableDate } from '$lib/format';
	import { m } from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime';
	import type { Video } from '$lib/server/youtube';

	/**
	 * A video that plays where it is: the kit's click-to-load player, then the title and figures.
	 * `upright` draws a Short 9:16; in a mixed grid it is drawn wide like the rest.
	 */
	let {
		video,
		upright = false,
		large = false
	}: { video: Video; upright?: boolean; large?: boolean } = $props();

	const locale = getLocale();
</script>

<article class="flex flex-col gap-4">
	<div class="overflow-hidden rounded-[1.5rem] border border-foreground/10 shadow-site-lg">
		<YouTubeEmbed
			video={youtubeVideo(video.videoId, upright && video.isShort)}
			title={video.title}
			class="rounded-none"
		/>
	</div>
	<div class="px-1">
		<h3 class={['line-clamp-2 leading-snug font-bold', large ? 'text-2xl md:text-3xl' : 'text-lg']}>
			{video.title}
		</h3>
		<p class="mt-1.5 text-sm text-foreground/65">
			<time datetime={new Date(video.publishedAt).toISOString()}>
				{readableDate(video.publishedAt, locale)}
			</time>
			{#if video.views != null}
				· {m.videos_views({ count: compactNumber(video.views, locale) })}
			{/if}
		</p>
	</div>
</article>
