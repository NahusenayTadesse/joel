<script lang="ts">
	import PageHeader from '@nahu/admin-kit/components/PageHeader.svelte';
	import LookupPage from '@nahu/admin-kit/components/lookup/LookupPage.svelte';
	import { addSchema, editSchema, iconChoices, toneChoices } from './schema';

	let { data } = $props();
</script>

<div class="flex flex-col gap-6">
	<PageHeader
		title="Packages"
		description="The sponsorship packages and their prices. A featured package is drawn larger, with its badge above it."
	/>
	<LookupPage
		{data}
		tabTitle={false}
		schemas={{ add: addSchema, edit: editSchema }}
		config={{
			entity: 'Package',
			plural: 'Packages',
			fields: [
				{ name: 'name', label: 'Name', type: 'text' },
				{ name: 'nameAm', label: 'Name (Amharic)', type: 'text', required: false, inTable: false },
				{ name: 'price', label: 'Price (before tax)', type: 'money' },
				{
					name: 'features',
					label: 'Features — one per line',
					type: 'textarea',
					rows: 8,
					long: 40
				},
				{
					name: 'featuresAm',
					label: 'Features (Amharic) — one per line',
					type: 'textarea',
					rows: 8,
					required: false,
					inTable: false
				},
				{ name: 'icon', label: 'Icon', type: 'select', choices: iconChoices },
				{ name: 'tone', label: 'Colour', type: 'select', choices: toneChoices },
				{
					name: 'isFeatured',
					label: 'Featured',
					type: 'checkbox',
					required: false,
					trueLabel: 'Yes',
					falseLabel: 'No'
				},
				{
					name: 'badge',
					label: 'Badge',
					type: 'text',
					required: false,
					placeholder: 'Best Seller'
				},
				{
					name: 'badgeAm',
					label: 'Badge (Amharic)',
					type: 'text',
					required: false,
					inTable: false
				},
				{ name: 'sortOrder', label: 'Order', type: 'number' },
				{ name: 'status', label: 'Status', type: 'boolean' }
			]
		}}
	/>
</div>
