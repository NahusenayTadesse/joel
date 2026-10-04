<script lang="ts">
	import PageHeader from '@nahu/admin-kit/components/PageHeader.svelte';
	import LookupPage from '@nahu/admin-kit/components/lookup/LookupPage.svelte';
	import { addSchema, editSchema, iconChoices } from './schema';

	let { data } = $props();
</script>

<div class="flex flex-col gap-6">
	<PageHeader
		title="Hero highlights"
		description="The small chips under the hero buttons. Four fit on one row."
	/>
	<LookupPage
		{data}
		tabTitle={false}
		schemas={{ add: addSchema, edit: editSchema }}
		config={{
			entity: 'Highlight',
			plural: 'Hero highlights',
			fields: [
				{ name: 'name', label: 'Label', type: 'text' },
				{ name: 'nameAm', label: 'Label (Amharic)', type: 'text', required: false },
				{ name: 'icon', label: 'Icon', type: 'select', choices: iconChoices },
				{ name: 'sortOrder', label: 'Order', type: 'number' },
				{ name: 'status', label: 'Status', type: 'boolean' }
			]
		}}
	/>
</div>
