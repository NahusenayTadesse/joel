<script lang="ts">
	import CircleCheck from '@lucide/svelte/icons/circle-check';
	import Download from '@lucide/svelte/icons/download';
	import Mail from '@lucide/svelte/icons/mail';
	import MessageCircle from '@lucide/svelte/icons/message-circle';
	import Phone from '@lucide/svelte/icons/phone';
	import Send from '@lucide/svelte/icons/send';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { publicFileUrl } from '@nahu/admin-kit/files';
	import { enhance } from '$app/forms';
	import { formatPhone } from '$lib/format';
	import { m } from '$lib/paraglide/messages.js';
	import type { FieldError, FormError, InquiryResult, InquiryValues } from '$lib/server/inquiry';
	import type { Site } from '$lib/server/site';
	import ExternalLink from './ExternalLink.svelte';
	import Glow from './Glow.svelte';

	let {
		firstName,
		contact,
		packages,
		selected = $bindable(''),
		form
	}: {
		firstName: string;
		contact: Site['contact'];
		/** The packages to choose from: the rates page's; empty on the home page, which has none. */
		packages: { id: number; name: string }[];
		/** The package select's value: a package id, `custom`, or '' for not decided yet. */
		selected?: string;
		/** The `inquire` action's answer, when there is one. */
		form: InquiryResult | null | undefined;
	} = $props();

	const CUSTOM = 'custom';

	const chosenName = $derived(
		selected === CUSTOM
			? m.form_package_custom()
			: packages.find((p) => String(p.id) === selected)?.name
	);
	/** The opening line of a WhatsApp message or an email, naming the package when one is chosen. */
	const opener = $derived(
		chosenName
			? m.contact_message_package({ name: firstName, package: chosenName })
			: m.contact_message_general({ name: firstName })
	);

	const failed = $derived(form && !form.sent ? form : null);
	const values = $derived<Partial<InquiryValues>>(failed?.values ?? {});
	const errors = $derived(failed?.errors ?? {});

	const FIELD_ERRORS: Record<FieldError, () => string> = {
		required: m.form_error_required,
		email: m.form_error_email,
		contact: m.form_error_contact,
		too_long: m.form_error_too_long
	};
	const FORM_ERRORS: Record<FormError, () => string> = {
		check: m.form_error_check,
		rate: m.form_error_rate,
		failed: m.form_error_failed
	};

	let sending = $state(false);
	const submit: SubmitFunction = () => {
		sending = true;
		return async ({ update }) => {
			await update();
			sending = false;
		};
	};

	const input =
		'w-full rounded-xl border border-foreground/10 bg-foreground/5 px-4 py-3 text-foreground placeholder:text-foreground/45 transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none aria-invalid:border-red-400/70';
</script>

{#snippet error(field: keyof InquiryValues)}
	{#if errors[field]}
		<p id="inquiry-{field}-error" class="mt-1.5 text-sm text-red-300">
			{FIELD_ERRORS[errors[field]]()}
		</p>
	{/if}
{/snippet}

<section id="contact" class="relative overflow-hidden px-6 pt-16 pb-28">
	<div class="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-[1fr_1.1fr]">
		<div>
			<!-- Focused when a package is chosen, so keyboard and screen reader users land here too. -->
			<h2
				id="contact-title"
				tabindex="-1"
				class="mb-4 text-4xl font-extrabold outline-none md:text-6xl"
			>
				{m.contact_title()}
			</h2>
			<p class="mb-4 max-w-lg text-lg text-foreground/75">
				{m.contact_subtitle({ name: firstName })}
			</p>
			{#if !packages.length}
				<p class="mb-10 max-w-lg text-sm font-medium text-primary">{m.contact_rates_hint()}</p>
			{:else}
				<div class="mb-10"></div>
			{/if}

			<ul class="grid grid-cols-1 gap-3 sm:grid-cols-2">
				<li>
					<a href="tel:{contact.phoneIntl}" class="glass flex items-center gap-4 rounded-2xl p-4">
						<span
							class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary"
						>
							<Phone class="h-5 w-5" />
						</span>
						<span class="min-w-0">
							<span class="block font-bold">{m.contact_call()}</span>
							<span class="block truncate text-sm text-foreground/70">
								{formatPhone(contact.phoneIntl)}
							</span>
						</span>
					</a>
				</li>
				{#if contact.telegram}
					<li>
						<ExternalLink
							href="https://t.me/{contact.telegram}"
							class="glass flex items-center gap-4 rounded-2xl p-4"
						>
							<span
								class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-500/15 text-sky-400"
							>
								<Send class="h-5 w-5" />
							</span>
							<span class="min-w-0">
								<span class="block font-bold">{m.contact_telegram()}</span>
								<span class="block truncate text-sm text-foreground/70">@{contact.telegram}</span>
							</span>
						</ExternalLink>
					</li>
				{/if}
				{#if contact.whatsapp}
					<li>
						<ExternalLink
							href="https://wa.me/{contact.whatsapp}?text={encodeURIComponent(opener)}"
							class="glass flex items-center gap-4 rounded-2xl p-4"
						>
							<span
								class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-500/15 text-green-400"
							>
								<MessageCircle class="h-5 w-5" />
							</span>
							<span class="min-w-0">
								<span class="block font-bold">{m.contact_whatsapp()}</span>
								<span class="block truncate text-sm text-foreground/70">
									{formatPhone(`+${contact.whatsapp}`)}
								</span>
							</span>
						</ExternalLink>
					</li>
				{/if}
				<li>
					<a
						href="mailto:{contact.email}?subject={encodeURIComponent(
							chosenName ? `${m.contact_email_subject()}: ${chosenName}` : m.contact_email_subject()
						)}&body={encodeURIComponent(opener)}"
						class="glass flex items-center gap-4 rounded-2xl p-4"
					>
						<span
							class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent"
						>
							<Mail class="h-5 w-5" />
						</span>
						<span class="min-w-0">
							<span class="block font-bold">{m.contact_email()}</span>
							<span class="block truncate text-sm text-foreground/70">{contact.email}</span>
						</span>
					</a>
				</li>
			</ul>

			{#if contact.mediaKit}
				<!-- eslint-disable svelte/no-navigation-without-resolve -- a file download, not a page -->
				<a
					href={publicFileUrl(contact.mediaKit)}
					download
					class="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl border border-foreground/15 px-5 font-semibold text-foreground/90 transition-colors hover:border-primary hover:text-primary"
				>
					<Download class="h-5 w-5" />
					{m.contact_media_kit()}
				</a>
				<!-- eslint-enable svelte/no-navigation-without-resolve -->
			{/if}
		</div>

		<div class="glass-card rounded-[2rem] p-6 sm:p-8 md:p-10">
			{#if form?.sent}
				<div class="flex flex-col items-center py-10 text-center" role="status">
					<CircleCheck class="mb-5 h-14 w-14 text-green-400" />
					<p class="mb-2 text-2xl font-bold">{m.form_sent_title()}</p>
					<p class="text-foreground/75">{m.form_sent_body({ name: firstName })}</p>
				</div>
			{:else}
				<h3 class="mb-6 text-2xl font-bold">{m.form_title()}</h3>
				<form method="POST" action="?/inquire" use:enhance={submit} class="relative space-y-5">
					{#if failed}
						<p
							class="rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200"
							role="alert"
						>
							{FORM_ERRORS[failed.formError]()}
						</p>
					{/if}

					<!-- The honeypot: hidden from people, filled in by bots. See `$lib/server/inquiry`. -->
					<div class="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
						<label>Website <input name="website" tabindex="-1" autocomplete="off" /></label>
					</div>

					<div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
						<div>
							<label for="inquiry-name" class="mb-1.5 block text-sm font-semibold"
								>{m.form_name()}</label
							>
							<input
								id="inquiry-name"
								name="name"
								autocomplete="name"
								required
								maxlength="120"
								value={values.name ?? ''}
								aria-invalid={errors.name ? 'true' : undefined}
								aria-describedby={errors.name ? 'inquiry-name-error' : undefined}
								class={input}
							/>
							{@render error('name')}
						</div>
						<div>
							<label for="inquiry-company" class="mb-1.5 block text-sm font-semibold">
								{m.form_company()}
								<span class="font-normal text-foreground/60">({m.form_optional()})</span>
							</label>
							<input
								id="inquiry-company"
								name="company"
								autocomplete="organization"
								maxlength="120"
								value={values.company ?? ''}
								class={input}
							/>
						</div>
						<div>
							<label for="inquiry-email" class="mb-1.5 block text-sm font-semibold"
								>{m.form_email()}</label
							>
							<input
								id="inquiry-email"
								name="email"
								type="email"
								autocomplete="email"
								maxlength="160"
								value={values.email ?? ''}
								aria-invalid={errors.email ? 'true' : undefined}
								aria-describedby={errors.email ? 'inquiry-email-error' : 'inquiry-contact-hint'}
								class={input}
							/>
							{@render error('email')}
						</div>
						<div>
							<label for="inquiry-phone" class="mb-1.5 block text-sm font-semibold"
								>{m.form_phone()}</label
							>
							<input
								id="inquiry-phone"
								name="phone"
								type="tel"
								autocomplete="tel"
								maxlength="30"
								value={values.phone ?? ''}
								aria-describedby="inquiry-contact-hint"
								class={input}
							/>
						</div>
					</div>
					<p id="inquiry-contact-hint" class="-mt-2 text-sm text-foreground/60">
						{m.form_contact_hint()}
					</p>

					{#if packages.length}
						<div>
							<label for="inquiry-package" class="mb-1.5 block text-sm font-semibold"
								>{m.form_package()}</label
							>
							<select
								id="inquiry-package"
								name="package"
								bind:value={selected}
								class={[input, 'bg-site-deep']}
							>
								<option value="">{m.form_package_undecided()}</option>
								{#each packages as pkg (pkg.id)}
									<option value={String(pkg.id)}>{pkg.name}</option>
								{/each}
								<option value={CUSTOM}>{m.form_package_custom()}</option>
							</select>
						</div>
					{/if}

					<div>
						<label for="inquiry-message" class="mb-1.5 block text-sm font-semibold"
							>{m.form_message()}</label
						>
						<textarea
							id="inquiry-message"
							name="message"
							required
							rows="5"
							maxlength="4000"
							placeholder={m.form_message_placeholder()}
							value={values.message ?? ''}
							aria-invalid={errors.message ? 'true' : undefined}
							aria-describedby={errors.message ? 'inquiry-message-error' : undefined}
							class={[input, 'resize-y']}></textarea>
						{@render error('message')}
					</div>

					<button
						type="submit"
						disabled={sending}
						class="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-bold text-white shadow-glow transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-70"
					>
						<Send class="h-5 w-5" />
						{sending ? m.form_sending() : m.form_submit()}
					</button>
				</form>
			{/if}
		</div>
	</div>

	<Glow class="absolute -bottom-40 left-1/4 h-[32rem] w-[32rem] opacity-15" />
	<Glow tone="accent" class="absolute top-0 right-0 h-96 w-96 opacity-10" />
</section>
