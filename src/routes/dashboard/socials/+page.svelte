<script lang="ts">
	import PageHeader from '@nahu/admin-kit/components/PageHeader.svelte';
	import LookupPage from '@nahu/admin-kit/components/lookup/LookupPage.svelte';
	import { addSchema, editSchema, platformChoices } from './schema';

	let { data } = $props();
</script>

<div class="flex flex-col gap-6">
	<PageHeader
		title="Social accounts"
		description="Follower cards show the accounts marked “In follower cards”; the footer's round icons show those marked “In footer”. The big “600k+” is in Site settings."
	/>
	<LookupPage
		{data}
		tabTitle={false}
		schemas={{ add: addSchema, edit: editSchema }}
		config={{
			entity: 'Social account',
			plural: 'Social accounts',
			fields: [
				{ name: 'name', label: 'Name', type: 'text', placeholder: 'TikTok' },
				{ name: 'platform', label: 'Platform', type: 'select', choices: platformChoices },
				{
					name: 'url',
					label: 'Link',
					type: 'text',
					required: false,
					long: 30,
					placeholder: 'https://…'
				},
				{
					name: 'followers',
					label: 'Followers',
					type: 'number',
					required: false,
					placeholder: '440000'
				},
				{
					name: 'secondaryStat',
					label: 'Extra figure',
					type: 'text',
					required: false,
					placeholder: '4.5M Likes'
				},
				{
					name: 'secondaryStatAm',
					label: 'Extra figure (Amharic)',
					type: 'text',
					required: false,
					inTable: false
				},
				{
					name: 'showInStats',
					label: 'In follower cards',
					type: 'checkbox',
					required: false,
					trueLabel: 'Yes',
					falseLabel: 'No'
				},
				{
					name: 'showInFooter',
					label: 'In footer',
					type: 'checkbox',
					required: false,
					trueLabel: 'Yes',
					falseLabel: 'No'
				},
				{ name: 'sortOrder', label: 'Card order', type: 'number' },
				{ name: 'footerSortOrder', label: 'Footer order', type: 'number' },
				{ name: 'status', label: 'Status', type: 'boolean' }
			]
		}}
	/>
</div>
