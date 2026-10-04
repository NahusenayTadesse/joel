<script lang="ts">
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import Eye from '@lucide/svelte/icons/eye';
	import Save from '@lucide/svelte/icons/save';
	import Trash from '@lucide/svelte/icons/trash-2';
	import ConfirmAction from '@nahu/admin-kit/components/ConfirmAction.svelte';
	import PageHeader from '@nahu/admin-kit/components/PageHeader.svelte';
	import { Button } from '@nahu/admin-kit/components/ui/button/index.js';
	import Errors from '@nahu/admin-kit/formComponents/Errors.svelte';
	import FormCard from '@nahu/admin-kit/formComponents/FormCard.svelte';
	import InputComp from '@nahu/admin-kit/formComponents/InputComp.svelte';
	import LoadingBtn from '@nahu/admin-kit/formComponents/LoadingBtn.svelte';
	import RichEditor from '@nahu/admin-kit/formComponents/RichEditor.svelte';
	import { confirmLeave, createForm } from '@nahu/admin-kit/forms/createForm';
	import { localeChoices, postSchema, statusChoices } from '../schema';
	import type { PageData } from './$types';

	/** The editor proper; the page re-creates it per post (see `+page.svelte`). */
	let { data }: { data: PageData } = $props();

	// svelte-ignore state_referenced_locally
	const { form, errors, enhance, delayed, allErrors } = createForm(data.form, postSchema, {
		resetForm: false,
		taintedMessage: confirmLeave
	});
</script>

<div class="flex flex-col gap-6">
	<PageHeader
		title={data.id ? $form.title || 'Post' : 'New post'}
		description="Written in one language and listed on both versions of the site."
	>
		{#snippet actions()}
			<Button href="/dashboard/posts" variant="ghost"><ArrowLeft class="h-4 w-4" /> Posts</Button>
			{#if data.slug}
				<!-- Opens drafts and scheduled posts too, for a signed-in editor: the real page, before it goes out. -->
				<Button href="/blog/{data.slug}?preview=1" target="_blank" variant="outline">
					<Eye class="h-4 w-4" /> Preview
				</Button>
			{/if}
			{#if data.id}
				<ConfirmAction
					action="?/delete"
					label="Delete"
					title="Delete this post?"
					description="It leaves the blog at once."
					icon={Trash}
					variant="destructive"
				/>
			{/if}
		{/snippet}
	</PageHeader>

	<form
		method="post"
		action="?/save"
		enctype="multipart/form-data"
		use:enhance
		class="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_22rem]"
	>
		<div class="flex min-w-0 flex-col gap-6">
			<Errors allErrors={$allErrors} />
			<FormCard title="The post" className="lg:w-full">
				<div class="flex flex-col gap-4">
					<InputComp {form} {errors} name="title" label="Title" required />
					<RichEditor
						name="body"
						label="Body"
						bind:value={$form.body}
						uploadUrl="/dashboard/uploads"
						placeholder="Start writing…"
						minHeight="24rem"
						error={$errors.body?.[0]}
					/>
				</div>
			</FormCard>
		</div>

		<div class="flex flex-col gap-6">
			<FormCard title="Publishing" className="lg:w-full">
				<div class="flex flex-col gap-4">
					<InputComp
						{form}
						{errors}
						name="status"
						label="State"
						type="select"
						items={statusChoices}
					/>
					<InputComp
						{form}
						{errors}
						name="publishedAt"
						label="Publication time (Addis Ababa)"
						type="datetime-local"
						description="Empty when publishing means now. A time still to come schedules the post."
					/>
					<InputComp
						{form}
						{errors}
						name="locale"
						label="Written in"
						type="select"
						items={localeChoices}
					/>
					<InputComp
						{form}
						{errors}
						name="isFeatured"
						label="Featured"
						type="checkboxSingle"
						placeholder="Show first on the blog"
					/>
				</div>
			</FormCard>
			<FormCard title="Card and search" className="lg:w-full">
				<div class="flex flex-col gap-4">
					<InputComp
						{form}
						{errors}
						name="cover"
						label="Cover image"
						type="file"
						image={data.cover ?? ''}
					/>
					<InputComp
						{form}
						{errors}
						name="excerpt"
						label="Excerpt"
						type="textarea"
						rows={3}
						description="Under the title on cards and in search results. Empty: the start of the post."
					/>
					<InputComp
						{form}
						{errors}
						name="tags"
						label="Tags — one per line"
						type="textarea"
						rows={3}
					/>
					<InputComp
						{form}
						{errors}
						name="slug"
						label="Address"
						description="The end of its link, /blog/… Empty: made from the title."
					/>
				</div>
			</FormCard>
			<div class="sticky bottom-2 flex justify-end">
				<Button type="submit" size="lg" class="w-full shadow-lg">
					{#if $delayed}
						<LoadingBtn name="Saving" />
					{:else}
						<Save class="h-4 w-4" />
						{$form.status === 'published' ? 'Save and publish' : 'Save draft'}
					{/if}
				</Button>
			</div>
		</div>
	</form>
</div>
