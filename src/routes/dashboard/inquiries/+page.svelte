<script lang="ts">
	import PageHeader from '@nahu/admin-kit/components/PageHeader.svelte';
	import LookupPage from '@nahu/admin-kit/components/lookup/LookupPage.svelte';
	import { editSchema, stageChoices } from './schema';

	let { data } = $props();
</script>

<div class="flex flex-col gap-6">
	<PageHeader
		title="Inquiries"
		description="Messages from the contact form on the site, newest first. Open one to set where it stands and keep a note."
	/>
	<LookupPage
		{data}
		tabTitle={false}
		schemas={{ edit: editSchema }}
		config={{
			entity: 'Inquiry',
			plural: 'Inquiries',
			fixedRows: true,
			fields: [
				{ name: 'name', label: 'From', type: 'text', inForm: false },
				{ name: 'company', label: 'Company', type: 'text', inForm: false },
				{ name: 'packageName', label: 'Package', type: 'text', inForm: false },
				{
					name: 'rateLinkId',
					label: 'Rate link',
					type: 'reference',
					options: 'rateLinkList',
					display: 'rateLink',
					required: false,
					inForm: false
				},
				{ name: 'email', label: 'Email', type: 'text', inForm: false },
				{ name: 'phone', label: 'Phone', type: 'text', inForm: false },
				{ name: 'message', label: 'Message', type: 'textarea', inForm: false, long: 40 },
				{ name: 'locale', label: 'Language', type: 'text', inForm: false },
				{ name: 'createdAt', label: 'Received', type: 'date', inForm: false },
				{ name: 'stage', label: 'Stage', type: 'select', choices: stageChoices },
				{ name: 'note', label: 'Note', type: 'textarea', rows: 4, required: false, long: 30 }
			]
		}}
	/>
</div>
