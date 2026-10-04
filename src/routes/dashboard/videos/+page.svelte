<script lang="ts">
	import RefreshCw from '@lucide/svelte/icons/refresh-cw';
	import { createRawSnippet } from 'svelte';
	import type { ColumnDef } from '@tanstack/table-core';
	import { youtubeThumbnail } from '@nahu/admin-kit/youtube';
	import ConfirmAction from '@nahu/admin-kit/components/ConfirmAction.svelte';
	import Notice from '@nahu/admin-kit/components/Notice.svelte';
	import PageHeader from '@nahu/admin-kit/components/PageHeader.svelte';
	import LookupPage from '@nahu/admin-kit/components/lookup/LookupPage.svelte';
	import type { LookupRow } from '@nahu/admin-kit/components/lookup/types';
	import { renderSnippet } from '@nahu/admin-kit/components/ui/data-table/index.js';
	import { editSchema } from './schema';

	let { data } = $props();

	/** The poster, linking to the video on YouTube. Ids are YouTube's eleven URL-safe characters. */
	const thumbCell = createRawSnippet((args: () => { id: string; short: boolean }) => ({
		render: () => {
			const { id, short } = args();
			const href = short
				? `https://www.youtube.com/shorts/${id}`
				: `https://www.youtube.com/watch?v=${id}`;
			return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="block w-24 overflow-hidden rounded-md"><img src="${youtubeThumbnail({ id }, 'mq')}" alt="" loading="lazy" class="aspect-video w-full object-cover" /></a>`;
		}
	}));

	const extraColumns: ColumnDef<LookupRow>[] = [
		{
			id: 'thumb',
			header: 'Video',
			enableSorting: false,
			cell: ({ row }) =>
				renderSnippet(thumbCell, {
					id: String(row.original.videoId ?? ''),
					short: Boolean(row.original.isShort)
				})
		}
	];
</script>

<div class="flex flex-col gap-6">
	<PageHeader
		title="Videos"
		description="Joel's YouTube uploads, as the Videos page shows them. Hide one, or feature one in the big player."
	>
		{#snippet actions()}
			<ConfirmAction
				action="?/sync"
				label="Sync now"
				title="Read the channel now?"
				description="New videos and fresh view counts come in; hidden and featured choices are kept."
				icon={RefreshCw}
				variant="outline"
			/>
		{/snippet}
	</PageHeader>
	<Notice tone="info" title="These update themselves.">
		Every half hour the site reads the channel's public feed, which lists the latest 15 uploads;
		every video it has seen stays here. To pull in the whole back catalogue as well, set
		<code>YOUTUBE_API_KEY</code> (a free YouTube Data API key) in the server's <code>.env</code>.
	</Notice>
	<LookupPage
		{data}
		tabTitle={false}
		schemas={{ edit: editSchema }}
		config={{
			entity: 'Video',
			plural: 'Videos',
			fixedRows: true,
			fields: [
				{ name: 'title', label: 'Title', type: 'text', inForm: false, long: 50 },
				{ name: 'publishedAt', label: 'Published', type: 'date', inForm: false },
				{ name: 'views', label: 'Views', type: 'number', inForm: false },
				{
					name: 'isShort',
					label: 'Short',
					type: 'checkbox',
					inForm: false,
					trueLabel: 'Short',
					falseLabel: 'Video'
				},
				{
					name: 'isFeatured',
					label: 'Big player',
					type: 'checkbox',
					required: false,
					trueLabel: 'Featured',
					falseLabel: 'No'
				},
				{ name: 'status', label: 'Shown', type: 'boolean' }
			],
			extraColumns
		}}
	/>
</div>
