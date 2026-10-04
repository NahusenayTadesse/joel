<script lang="ts">
	import Save from '@lucide/svelte/icons/save';
	import PageHeader from '@nahu/admin-kit/components/PageHeader.svelte';
	import { Button } from '@nahu/admin-kit/components/ui/button/index.js';
	import Errors from '@nahu/admin-kit/formComponents/Errors.svelte';
	import FormCard from '@nahu/admin-kit/formComponents/FormCard.svelte';
	import InputComp from '@nahu/admin-kit/formComponents/InputComp.svelte';
	import LoadingBtn from '@nahu/admin-kit/formComponents/LoadingBtn.svelte';
	import { confirmLeave, createForm } from '@nahu/admin-kit/forms/createForm';
	import { settingsSchema } from './schema';

	let { data } = $props();

	// svelte-ignore state_referenced_locally
	const { form, errors, enhance, delayed, allErrors } = createForm(data.form, settingsSchema, {
		resetForm: false,
		// Long enough that losing it matters.
		taintedMessage: confirmLeave
	});

	type Field = {
		name: string;
		label: string;
		type?: 'text' | 'textarea' | 'email' | 'url' | 'tel';
		rows?: number;
		description?: string;
		required?: boolean;
	};
	/** A row of the form: one field, or an English field and its Amharic twin side by side. */
	type Row = Field | [Field, Field];

	const am = (field: Field): Field => ({
		...field,
		name: `${field.name}Am`,
		label: `${field.label} (Amharic)`,
		required: false,
		description: undefined
	});
	/** An English field and its Amharic twin. */
	const pair = (field: Field): [Field, Field] => [{ required: true, ...field }, am(field)];

	const sections: { title: string; description: string; rows: Row[] }[] = [
		{
			title: 'Name',
			description: 'Shown in the header, the hero headline and the footer.',
			rows: [
				pair({ name: 'firstName', label: 'First name' }),
				pair({ name: 'lastName', label: 'Last name' }),
				{ name: 'initials', label: 'Initials in the logo', required: true }
			]
		},
		{
			title: 'Hero',
			description: 'The top of the page.',
			rows: [
				pair({ name: 'heroBadge', label: 'Badge above the headline' }),
				pair({ name: 'heroDescription', label: 'Introduction', type: 'textarea', rows: 4 }),
				[
					{ name: 'reachValue', label: 'Reach figure', required: true },
					{ name: 'audienceValue', label: 'Audience figure', required: true }
				],
				pair({ name: 'reachLabel', label: 'Reach label' }),
				pair({ name: 'audienceLabel', label: 'Audience label' }),
				{
					name: 'totalFollowers',
					label: 'Total followers headline',
					required: true,
					description: 'The large figure over the follower cards, such as “600k+”.'
				}
			]
		},
		{
			title: 'About',
			description: 'The quote card.',
			rows: [
				pair({
					name: 'aboutText',
					label: 'Quote',
					type: 'textarea',
					rows: 7,
					description:
						'Wrap words in **double stars** to colour them purple, or in __double underscores__ for pink.'
				}),
				pair({ name: 'motto', label: 'Motto pill' }),
				[{ name: 'aboutTagline', label: 'Tagline' }, am({ name: 'aboutTagline', label: 'Tagline' })]
			]
		},
		{
			title: 'Contact',
			description: 'The call buttons, the contact section and the footer.',
			rows: [
				[
					{
						name: 'phone',
						label: 'Phone, local',
						type: 'tel',
						required: true,
						description: 'Shown on the hero’s call button: 0955928986.'
					},
					{
						name: 'phoneIntl',
						label: 'Phone, international',
						type: 'tel',
						required: true,
						description: 'What every call button dials, and the footer: +251955928986.'
					}
				],
				[
					{ name: 'email', label: 'Email', type: 'email', required: true },
					{ name: 'website', label: 'Website', type: 'url' }
				],
				[{ name: 'location', label: 'Location' }, am({ name: 'location', label: 'Location' })],
				[
					{
						name: 'telegramUsername',
						label: 'Telegram username',
						description: 'For the Telegram button in the contact section, without the @.'
					},
					{
						name: 'whatsappNumber',
						label: 'WhatsApp number',
						type: 'tel',
						description: 'International form: +251955928986. Empty hides the button.'
					}
				]
			]
		},
		{
			title: 'YouTube',
			description: 'The Videos page and the latest videos on the home page.',
			rows: [
				{
					name: 'youtubeChannelId',
					label: 'Channel id',
					description:
						'UC… — the channel whose videos fill the Videos page. On YouTube: your channel → About → Share channel → Copy channel ID.'
				}
			]
		},
		{
			title: 'Price terms',
			description: 'The small print around the packages. Each one is left out when empty.',
			rows: [
				[
					{
						name: 'netPriceNote',
						label: 'Under each price',
						description: '(Net Price before Tax)'
					},
					am({ name: 'netPriceNote', label: 'Under each price' })
				],
				[
					{
						name: 'customPrice',
						label: 'Custom campaign price',
						description: '“Custom Pricing”, or a starting figure.'
					},
					am({ name: 'customPrice', label: 'Custom campaign price' })
				],
				[
					{
						name: 'packageNotes',
						label: 'Notes under the packages — one per line',
						type: 'textarea',
						rows: 3
					},
					am({ name: 'packageNotes', label: 'Notes under the packages', type: 'textarea', rows: 3 })
				]
			]
		},
		{
			title: 'Custom campaigns',
			description: 'The small list in the “Custom Campaign Request” card.',
			rows: [
				pair({
					name: 'customTags',
					label: 'Campaign types — one per line',
					type: 'textarea',
					rows: 6
				})
			]
		},
		{
			title: 'Payment',
			description: 'Under “Payment Details”. The accounts themselves are under Bank accounts.',
			rows: [
				{ name: 'accountHolder', label: 'Account holder', required: true },
				[
					{ name: 'paymentNote', label: 'Note under the accounts', type: 'textarea', rows: 4 },
					am({ name: 'paymentNote', label: 'Note under the accounts', type: 'textarea', rows: 4 })
				]
			]
		},
		{
			title: 'Footer',
			description: 'The text beside the logo, and the “Founder of” line.',
			rows: [
				[
					{ name: 'footerBlurb', label: 'Blurb', type: 'textarea', rows: 4 },
					am({ name: 'footerBlurb', label: 'Blurb', type: 'textarea', rows: 4 })
				],
				[
					{ name: 'founderOf', label: 'Founder of' },
					{ name: 'founderUrl', label: 'Its website', type: 'url' }
				]
			]
		},
		{
			title: 'Search and sharing',
			description: 'The browser tab and what Google and link previews show.',
			rows: [
				pair({ name: 'metaTitle', label: 'Page title' }),
				pair({ name: 'metaDescription', label: 'Description', type: 'textarea', rows: 3 })
			]
		}
	];
</script>

{#snippet input(field: Field)}
	<InputComp
		{form}
		{errors}
		name={field.name}
		label={field.label}
		type={field.type ?? 'text'}
		rows={field.rows}
		required={field.required ?? false}
		description={field.description}
	/>
{/snippet}

<div class="flex flex-col gap-6">
	<PageHeader
		title="Site settings"
		description="Everything on the page that is not a list. An empty Amharic field shows the English one."
	/>

	<form method="post" enctype="multipart/form-data" use:enhance class="flex flex-col gap-6">
		<Errors allErrors={$allErrors} />

		<div class="grid grid-cols-1 gap-6 2xl:grid-cols-2">
			<FormCard title="Photo" description="The portrait beside the headline." className="lg:w-full">
				<InputComp
					{form}
					{errors}
					name="portrait"
					label="Portrait"
					type="file"
					image={data.portrait ?? ''}
				/>
			</FormCard>

			<FormCard
				title="Media kit"
				description="A PDF sponsors can download from the contact section. None hides the button."
				className="lg:w-full"
			>
				<InputComp
					{form}
					{errors}
					name="mediaKit"
					label="Media kit (PDF)"
					type="file"
					image={data.mediaKit ?? ''}
				/>
			</FormCard>

			{#each sections as section (section.title)}
				<FormCard title={section.title} description={section.description} className="lg:w-full">
					<div class="flex flex-col gap-4">
						{#each section.rows as row, i (i)}
							{#if Array.isArray(row)}
								<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
									{@render input(row[0])}
									{@render input(row[1])}
								</div>
							{:else}
								{@render input(row)}
							{/if}
						{/each}
					</div>
				</FormCard>
			{/each}
		</div>

		<div class="sticky bottom-2 flex justify-end">
			<Button type="submit" size="lg" class="shadow-lg">
				{#if $delayed}
					<LoadingBtn name="Saving" />
				{:else}
					<Save class="h-4 w-4" /> Save settings
				{/if}
			</Button>
		</div>
	</form>
</div>
