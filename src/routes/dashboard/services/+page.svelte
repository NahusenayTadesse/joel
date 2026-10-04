<script lang="ts">
	import PageHeader from '@nahu/admin-kit/components/PageHeader.svelte';
	import LookupPage from '@nahu/admin-kit/components/lookup/LookupPage.svelte';
	import { addSchema, editSchema, iconChoices } from './schema';

	let { data } = $props();
</script>

<div class="flex flex-col gap-6">
	<PageHeader
		title="Services"
		description="“What I do” on the home page: the kinds of work Joel takes on, in this order."
	/>
	<LookupPage
		{data}
		tabTitle={false}
		schemas={{ add: addSchema, edit: editSchema }}
		config={{
			entity: 'Service',
			plural: 'Services',
			fields: [
				{ name: 'title', label: 'Title', type: 'text' },
				{
					name: 'titleAm',
					label: 'Title (Amharic)',
					type: 'text',
					required: false,
					inTable: false
				},
				{ name: 'description', label: 'Description', type: 'textarea', rows: 4 },
				{
					name: 'descriptionAm',
					label: 'Description (Amharic)',
					type: 'textarea',
					rows: 4,
					required: false,
					inTable: false
				},
				{ name: 'icon', label: 'Icon', type: 'select', choices: iconChoices },
				{ name: 'sortOrder', label: 'Order', type: 'number' },
				{ name: 'status', label: 'Status', type: 'boolean' }
			]
		}}
	/>
</div>
