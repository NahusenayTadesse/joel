<script lang="ts">
	import { createRawSnippet } from 'svelte';
	import type { ColumnDef } from '@tanstack/table-core';
	import { page } from '$app/state';
	import Copy from '@nahu/admin-kit/Copy.svelte';
	import PageHeader from '@nahu/admin-kit/components/PageHeader.svelte';
	import LookupPage from '@nahu/admin-kit/components/lookup/LookupPage.svelte';
	import type { LookupRow } from '@nahu/admin-kit/components/lookup/types';
	import {
		renderComponent,
		renderSnippet
	} from '@nahu/admin-kit/components/ui/data-table/index.js';
	import { addSchema, editSchema } from './schema';

	let { data } = $props();

	const linkFor = (row: LookupRow) => `${page.url.origin}/rates/${String(row.token ?? '')}`;

	/** Whether the link still opens: lapsed links stay listed, marked, until deleted. */
	const expiryCell = createRawSnippet((args: () => { expired: boolean }) => ({
		render: () =>
			args().expired
				? '<span class="rounded-md bg-destructive/10 px-1.5 py-0.5 text-xs font-medium text-destructive">Expired</span>'
				: '<span class="rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-xs font-medium text-emerald-600">Valid</span>'
	}));

	const viewedCell = createRawSnippet((args: () => { views: number; last: string }) => ({
		render: () => {
			const { views, last } = args();
			return `<span class="text-sm">${views === 0 ? 'Not opened yet' : `${views} · last ${last}`}</span>`;
		}
	}));

	const when = (value: unknown) =>
		value
			? new Intl.DateTimeFormat('en-GB', {
					timeZone: 'Africa/Addis_Ababa',
					dateStyle: 'medium',
					timeStyle: 'short'
				}).format(new Date(value as string))
			: '';

	const extraColumns: ColumnDef<LookupRow>[] = [
		{
			id: 'link',
			header: 'Link (click to copy)',
			enableSorting: false,
			cell: ({ row }) => renderComponent(Copy, { data: linkFor(row.original) })
		},
		{
			id: 'expiry',
			header: 'Opens',
			enableSorting: false,
			cell: ({ row }) =>
				renderSnippet(expiryCell, { expired: String(row.original.expiresOn) < data.today })
		},
		{
			id: 'viewed',
			header: 'Opened',
			enableSorting: false,
			cell: ({ row }) =>
				renderSnippet(viewedCell, {
					views: Number(row.original.views ?? 0),
					last: when(row.original.lastViewedAt)
				})
		}
	];
</script>

<div class="flex flex-col gap-6">
	<PageHeader
		title="Rate links"
		description="The packages, prices and bank accounts are not on the public site. Make a link here for each sponsor and send it to them: it opens the rates page until the end of its expiry day (Addis Ababa time). Switching a link off ends it at once."
	/>
	<LookupPage
		{data}
		tabTitle={false}
		schemas={{ add: addSchema, edit: editSchema }}
		config={{
			entity: 'Rate link',
			plural: 'Rate links',
			fields: [
				{ name: 'label', label: 'Who it is for', type: 'text', placeholder: 'TECNO — Abebe' },
				{ name: 'expiresOn', label: 'Expires on', type: 'date' },
				{ name: 'status', label: 'Status', type: 'boolean' }
			],
			extraColumns
		}}
	/>
</div>
