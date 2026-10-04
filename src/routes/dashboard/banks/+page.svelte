<script lang="ts">
	import PageHeader from '@nahu/admin-kit/components/PageHeader.svelte';
	import LookupPage from '@nahu/admin-kit/components/lookup/LookupPage.svelte';
	import { addSchema, editSchema, iconChoices, toneChoices } from './schema';

	let { data } = $props();
</script>

<div class="flex flex-col gap-6">
	<PageHeader
		title="Bank accounts"
		description="Listed under “Payment Details” on the site. The account holder's name is in Site settings."
	/>
	<LookupPage
		{data}
		tabTitle={false}
		schemas={{ add: addSchema, edit: editSchema }}
		config={{
			entity: 'Bank account',
			plural: 'Bank accounts',
			fields: [
				{ name: 'name', label: 'Bank', type: 'text' },
				{ name: 'nameAm', label: 'Bank (Amharic)', type: 'text', required: false },
				{ name: 'accountNumber', label: 'Account number', type: 'text' },
				{ name: 'tone', label: 'Colour', type: 'select', choices: toneChoices },
				{ name: 'icon', label: 'Icon', type: 'select', choices: iconChoices },
				{ name: 'sortOrder', label: 'Order', type: 'number' },
				{ name: 'status', label: 'Status', type: 'boolean' }
			]
		}}
	/>
</div>
