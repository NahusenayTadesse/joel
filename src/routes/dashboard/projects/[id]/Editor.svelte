<script lang="ts">
	import ArrowDown from '@lucide/svelte/icons/arrow-down';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import ArrowUp from '@lucide/svelte/icons/arrow-up';
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import Save from '@lucide/svelte/icons/save';
	import Trash from '@lucide/svelte/icons/trash-2';
	import { enhance } from '$app/forms';
	import { publicFileUrl } from '@nahu/admin-kit/files';
	import ConfirmAction from '@nahu/admin-kit/components/ConfirmAction.svelte';
	import Notice from '@nahu/admin-kit/components/Notice.svelte';
	import PageHeader from '@nahu/admin-kit/components/PageHeader.svelte';
	import YouTubeEmbed from '@nahu/admin-kit/components/YouTubeEmbed.svelte';
	import { Button } from '@nahu/admin-kit/components/ui/button/index.js';
	import Errors from '@nahu/admin-kit/formComponents/Errors.svelte';
	import FormCard from '@nahu/admin-kit/formComponents/FormCard.svelte';
	import FormDialog from '@nahu/admin-kit/formComponents/FormDialog.svelte';
	import GalleryUpload from '@nahu/admin-kit/formComponents/GalleryUpload.svelte';
	import InputComp from '@nahu/admin-kit/formComponents/InputComp.svelte';
	import LoadingBtn from '@nahu/admin-kit/formComponents/LoadingBtn.svelte';
	import RichEditor from '@nahu/admin-kit/formComponents/RichEditor.svelte';
	import { confirmLeave, createForm } from '@nahu/admin-kit/forms/createForm';
	import { imageEditSchema, imagesAddSchema, projectSchema } from '../schema';
	import type { PageData } from './$types';

	/** The editor proper; the page re-creates it per project (see `+page.svelte`). */
	let { data }: { data: PageData } = $props();

	// svelte-ignore state_referenced_locally
	const {
		form,
		errors,
		enhance: formEnhance,
		delayed,
		allErrors
	} = createForm(data.form, projectSchema, { resetForm: false, taintedMessage: confirmLeave });

	type Image = { id: number; fileName: string; caption: string | null; captionAm: string | null };
	const gallery = $derived((data.gallery?.rows ?? []) as Image[]);
</script>

{#snippet pair(name: string, label: string, type: 'text' | 'textarea' = 'text', required = false)}
	<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
		<InputComp {form} {errors} {name} {label} {type} {required} rows={3} />
		<InputComp {form} {errors} name="{name}Am" label="{label} (Amharic)" {type} rows={3} />
	</div>
{/snippet}

<div class="flex flex-col gap-6">
	<PageHeader
		title={data.id ? $form.title || 'Project' : 'New project'}
		description="A piece of work with its own page: the card on the Projects page, a write-up, a video and a gallery."
	>
		{#snippet actions()}
			<Button href="/dashboard/projects" variant="ghost"
				><ArrowLeft class="h-4 w-4" /> Projects</Button
			>
			{#if data.slug && data.status}
				<Button href="/projects/{data.slug}" target="_blank" variant="outline">
					<ExternalLink class="h-4 w-4" /> View on site
				</Button>
			{/if}
			{#if data.id}
				<ConfirmAction
					action="?/delete"
					label="Delete"
					title="Delete this project?"
					description="It leaves the site at once, with its page and gallery."
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
		use:formEnhance
		class="flex flex-col gap-6"
	>
		<Errors allErrors={$allErrors} />

		<div class="grid grid-cols-1 gap-6 2xl:grid-cols-2">
			<FormCard
				title="The project"
				description="Its name, who it was for and where it shows."
				className="lg:w-full"
			>
				<div class="flex flex-col gap-4">
					{@render pair('title', 'Title', 'text', true)}
					<InputComp
						{form}
						{errors}
						name="slug"
						label="Address"
						description="The end of its link, /projects/… Left empty, it is made from the title."
					/>
					<InputComp {form} {errors} name="client" label="For (client or brand)" />
					{@render pair('category', 'Kind of work')}
					<InputComp {form} {errors} name="completedOn" label="Finished on" type="date" />
					<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
						<InputComp {form} {errors} name="sortOrder" label="Order" type="number" />
						<InputComp
							{form}
							{errors}
							name="isFeatured"
							label="Home page"
							type="checkboxSingle"
							placeholder="Feature on the home page"
						/>
						<InputComp
							{form}
							{errors}
							name="status"
							label="Status"
							type="checkboxSingle"
							placeholder="Shown on the site"
						/>
					</div>
				</div>
			</FormCard>

			<FormCard
				title="The card"
				description="What the Projects page shows before it is opened."
				className="lg:w-full"
			>
				<div class="flex flex-col gap-4">
					{@render pair('summary', 'Summary', 'textarea', true)}
					{@render pair('result', 'Headline result')}
					<InputComp
						{form}
						{errors}
						name="cover"
						label="Cover image"
						type="file"
						image={data.cover ?? ''}
					/>
				</div>
			</FormCard>

			<FormCard
				title="Video and link"
				description="A YouTube video plays on the project's page."
				className="lg:w-full"
			>
				<div class="flex flex-col gap-4">
					<InputComp
						{form}
						{errors}
						name="youtubeUrl"
						label="YouTube link"
						type="url"
						description="Paste the link from the address bar or the Share button, not the embed code."
					/>
					<YouTubeEmbed url={$form.youtubeUrl} title={$form.title || 'Project video'} />
					<InputComp {form} {errors} name="externalUrl" label="Link to the work" type="url" />
				</div>
			</FormCard>

			<FormCard
				title="Write-up"
				description="The story of the project, on its own page."
				className="lg:w-full 2xl:col-span-2"
			>
				<div class="flex flex-col gap-6">
					<RichEditor
						name="body"
						label="Write-up"
						bind:value={$form.body}
						uploadUrl="/dashboard/uploads"
						placeholder="What was the brief, what did you make, how did it do?"
						error={$errors.body?.[0]}
					/>
					<RichEditor
						name="bodyAm"
						label="Write-up (Amharic)"
						bind:value={$form.bodyAm}
						uploadUrl="/dashboard/uploads"
						error={$errors.bodyAm?.[0]}
					/>
				</div>
			</FormCard>
		</div>

		<div class="sticky bottom-2 flex justify-end">
			<Button type="submit" size="lg" class="shadow-lg">
				{#if $delayed}
					<LoadingBtn name="Saving" />
				{:else}
					<Save class="h-4 w-4" /> {data.id ? 'Save project' : 'Create project'}
				{/if}
			</Button>
		</div>
	</form>

	{#if data.gallery}
		<FormCard
			title="Gallery"
			description="Shown on the project's page, in this order. Several images can be added at once."
			className="lg:w-full"
		>
			<div class="flex flex-col gap-5">
				<FormDialog
					title="Add images"
					description="Each image is optimised in your browser before it uploads."
					action="?/addImages"
					data={data.gallery.addForm}
					schema={imagesAddSchema}
					triggerLabel="Add images"
					submitLabel="Upload"
					multipart
					resetOnSuccess
				>
					{#snippet fields({ form: addForm })}
						<GalleryUpload form={addForm} name="images" />
					{/snippet}
				</FormDialog>

				{#if gallery.length === 0}
					<Notice tone="info" title="No images yet."
						>The project's page shows its cover until you add some.</Notice
					>
				{:else}
					<ul class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
						{#each gallery as image, i (image.id)}
							<li class="flex flex-col overflow-hidden rounded-lg border bg-card">
								<img
									src={publicFileUrl(image.fileName)}
									alt={image.caption ?? ''}
									class="aspect-[4/3] w-full object-cover"
									loading="lazy"
								/>
								<p class="min-h-9 px-3 py-2 text-xs text-muted-foreground">
									{image.caption || 'No caption'}
								</p>
								<div class="mt-auto flex items-center gap-1 border-t px-2 py-1.5">
									<form method="post" action="?/moveImage" use:enhance>
										<input type="hidden" name="id" value={image.id} />
										<input type="hidden" name="direction" value="up" />
										<Button
											type="submit"
											size="icon"
											variant="ghost"
											class="size-8"
											disabled={i === 0}
											aria-label="Move earlier"
										>
											<ArrowUp class="h-4 w-4" />
										</Button>
									</form>
									<form method="post" action="?/moveImage" use:enhance>
										<input type="hidden" name="id" value={image.id} />
										<input type="hidden" name="direction" value="down" />
										<Button
											type="submit"
											size="icon"
											variant="ghost"
											class="size-8"
											disabled={i === gallery.length - 1}
											aria-label="Move later"
										>
											<ArrowDown class="h-4 w-4" />
										</Button>
									</form>
									<div class="ms-auto flex items-center gap-1">
										<FormDialog
											title="Caption"
											action="?/editImage"
											data={data.gallery.editForm}
											schema={imageEditSchema}
											seed={{
												id: image.id,
												caption: image.caption ?? '',
												captionAm: image.captionAm ?? ''
											}}
											triggerLabel="Caption"
											submitLabel="Save"
										>
											{#snippet fields({ form: editForm, errors: editErrors })}
												<input type="hidden" name="id" value={image.id} />
												<InputComp
													form={editForm}
													errors={editErrors}
													name="caption"
													label="Caption"
												/>
												<InputComp
													form={editForm}
													errors={editErrors}
													name="captionAm"
													label="Caption (Amharic)"
												/>
											{/snippet}
										</FormDialog>
										<ConfirmAction
											action="?/deleteImage"
											label="Remove"
											title="Remove this image?"
											description="It leaves the project's gallery."
											icon={Trash}
											variant="ghost"
											fields={{ id: image.id }}
										/>
									</div>
								</div>
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		</FormCard>
	{/if}
</div>
