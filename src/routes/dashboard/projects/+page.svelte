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

	const columns: ColumnDef<Row>[] = [
		{
			accessorKey: 'title',
			header: 'Project',
			cell: ({ row }) =>
				renderComponent(DataTableLinks, {
					id: row.original.id,
					name: row.original.title,
					link: '/dashboard/projects'
				})
		},
		{ accessorKey: 'client', header: 'For' },
		{ accessorKey: 'category', header: 'Kind' },
		{ accessorKey: 'completedOn', header: 'Done' },
		{ accessorKey: 'images', header: 'Gallery', meta: { align: 'right' } },
		{
			id: 'featured',
			header: 'Home page',
			accessorFn: (row) => (row.isFeatured ? 'Featured' : ''),
			cell: ({ row }) =>
				renderComponent(Statuses, {
					status: row.original.isFeatured ? 'Featured' : 'No',
					label: row.original.isFeatured ? 'Featured' : '—'
				})
		},
		{
			id: 'status',
			header: 'Status',
			accessorFn: (row) => (row.status ? 'Active' : 'Inactive'),
			cell: ({ row }) =>
				renderComponent(Statuses, { status: row.original.status ? 'Active' : 'Inactive' })
		}
	];
</script>

<div class="flex flex-col gap-6">
	<PageHeader
		title="Projects"
		description="The work on the Projects page, each with its own page: a write-up, a video and a gallery. Featured ones also show on the home page."
	>
		{#snippet actions()}
			<Button href="/dashboard/projects/new"><Plus class="h-4 w-4" /> New project</Button>
		{/snippet}
	</PageHeader>
	<DataTable {columns} data={data.rows} fileName="projects" />
</div>
