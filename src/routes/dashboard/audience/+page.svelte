<script lang="ts">
	import PageHeader from '@nahu/admin-kit/components/PageHeader.svelte';
	import LookupPage from '@nahu/admin-kit/components/lookup/LookupPage.svelte';
	import { addSchema, editSchema } from './schema';

	let { data } = $props();
</script>

<div class="flex flex-col gap-6">
	<PageHeader
		title="Audience"
		description="Who follows Joel, as bars under the follower cards: “18–24 years · 62%”. The block is hidden while this list is empty."
	/>
	<LookupPage
		{data}
		tabTitle={false}
		schemas={{ add: addSchema, edit: editSchema }}
		config={{
			entity: 'Audience figure',
			plural: 'Audience figures',
			fields: [
				{ name: 'label', label: 'Label', type: 'text', placeholder: '18–24 years' },
				{
					name: 'labelAm',
					label: 'Label (Amharic)',
					type: 'text',
					required: false,
					inTable: false
				},
				{ name: 'value', label: 'Share (%)', type: 'number' },
				{ name: 'sortOrder', label: 'Order', type: 'number' },
				{ name: 'status', label: 'Status', type: 'boolean' }
			]
		}}
	/>
</div>
