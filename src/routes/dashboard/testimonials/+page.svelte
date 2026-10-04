<script lang="ts">
	import PageHeader from '@nahu/admin-kit/components/PageHeader.svelte';
	import LookupPage from '@nahu/admin-kit/components/lookup/LookupPage.svelte';
	import { addSchema, editSchema } from './schema';

	let { data } = $props();
</script>

<div class="flex flex-col gap-6">
	<PageHeader
		title="Testimonials"
		description="What sponsors said about working with Joel, under “What Brands Say”. Only add words a sponsor actually gave, with their permission."
	/>
	<LookupPage
		{data}
		tabTitle={false}
		schemas={{ add: addSchema, edit: editSchema }}
		config={{
			entity: 'Testimonial',
			plural: 'Testimonials',
			fields: [
				{ name: 'author', label: 'Who said it', type: 'text' },
				{
					name: 'role',
					label: 'Position and company',
					type: 'text',
					required: false,
					placeholder: 'Marketing Lead, TECNO Ethiopia'
				},
				{
					name: 'roleAm',
					label: 'Position and company (Amharic)',
					type: 'text',
					required: false,
					inTable: false
				},
				{ name: 'quote', label: 'What they said', type: 'textarea', rows: 5 },
				{
					name: 'quoteAm',
					label: 'What they said (Amharic)',
					type: 'textarea',
					rows: 5,
					required: false,
					inTable: false
				},
				{ name: 'sortOrder', label: 'Order', type: 'number' },
				{ name: 'status', label: 'Status', type: 'boolean' }
			]
		}}
	/>
</div>
