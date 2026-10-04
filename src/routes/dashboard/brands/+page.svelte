<script lang="ts">
	import PageHeader from '@nahu/admin-kit/components/PageHeader.svelte';
	import LookupPage from '@nahu/admin-kit/components/lookup/LookupPage.svelte';
	import { addSchema, editSchema } from './schema';

	let { data } = $props();
</script>

<div class="flex flex-col gap-6">
	<PageHeader
		title="Brands"
		description="The logos in the “Trusted by Leading Brands” strip, in this order. A logo on a white or transparent background works best: the site shows it on a light tile."
	/>
	<LookupPage
		{data}
		tabTitle={false}
		schemas={{ add: addSchema, edit: editSchema }}
		config={{
			entity: 'Brand',
			plural: 'Brands',
			fields: [
				{ name: 'name', label: 'Name', type: 'text' },
				{ name: 'logo', label: 'Logo', type: 'image' },
				{ name: 'website', label: 'Website', type: 'text', required: false },
				{ name: 'sortOrder', label: 'Order', type: 'number' },
				{ name: 'status', label: 'Status', type: 'boolean' }
			]
		}}
	/>
</div>
