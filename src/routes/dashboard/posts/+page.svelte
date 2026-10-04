<script lang="ts">
	import Plus from '@lucide/svelte/icons/plus';
	import type { ColumnDef } from '@tanstack/table-core';
	import PageHeader from '@nahu/admin-kit/components/PageHeader.svelte';
	import DataTable from '@nahu/admin-kit/components/Table/data-table.svelte';
	import DataTableLinks from '@nahu/admin-kit/components/Table/data-table-links.svelte';
	import Statuses from '@nahu/admin-kit/components/Table/statuses.svelte';
	import { Button } from '@nahu/admin-kit/components/ui/button/index.js';
	import { renderComponent } from '@nahu/admin-kit/components/ui/data-table/index.js';

	let { data } = $props();

	type Row = (typeof data.rows)[number];

	const when = (value: Date | string | null) =>
		value
			? new Intl.DateTimeFormat('en-GB', {
					timeZone: 'Africa/Addis_Ababa',
					dateStyle: 'medium',
					timeStyle: 'short'
				}).format(new Date(value))
			: '—';

	/** Published, scheduled (published with a time still to come) or draft. */
	const state = (row: Row) =>
		row.status === 'draft'
			? 'Draft'
			: row.publishedAt && new Date(row.publishedAt) > new Date()
				? 'Scheduled'
				: 'Published';

	const columns: ColumnDef<Row>[] = [
		{
			accessorKey: 'title',
			header: 'Post',
			cell: ({ row }) =>
				renderComponent(DataTableLinks, {
					id: row.original.id,
					name: row.original.title,
					link: '/dashboard/posts'
				})
		},
		{
			id: 'state',
			header: 'State',
			accessorFn: state,
			cell: ({ row }) => {
				const label = state(row.original);
				return renderComponent(Statuses, {
					status: label === 'Published' ? 'Active' : label === 'Draft' ? 'Inactive' : 'Pending',
					label
				});
			}
		},
		{
			id: 'locale',
			header: 'Language',
			accessorFn: (row) => (row.locale === 'am' ? 'Amharic' : 'English')
		},
		{ id: 'publishedAt', header: 'Published', accessorFn: (row) => when(row.publishedAt) },
		{ id: 'featured', header: 'Featured', accessorFn: (row) => (row.isFeatured ? 'Yes' : '') }
	];
</script>

<div class="flex flex-col gap-6">
	<PageHeader
		title="Blog posts"
		description="The Blog. A post is a draft until published; a publication time still to come schedules it."
	>
		{#snippet actions()}
			<Button href="/dashboard/posts/new"><Plus class="h-4 w-4" /> New post</Button>
		{/snippet}
	</PageHeader>
	<DataTable {columns} data={data.rows} fileName="posts" />
</div>
