<script lang="ts">
	import LockKeyhole from '@lucide/svelte/icons/lock-keyhole';
	import Contact from '$lib/components/site/Contact.svelte';
	import HowItWorks from '$lib/components/site/HowItWorks.svelte';
	import Packages from '$lib/components/site/Packages.svelte';
	import Payment from '$lib/components/site/Payment.svelte';
	import Seo from '$lib/components/site/Seo.svelte';
	import { readableDate } from '$lib/format';
	import { to } from '$lib/links';
	import { m } from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime';

	let { data, form } = $props();
	const site = $derived(data.site);
	const locale = getLocale();

	/** The package in the contact form. Set by "Choose Package"; `?package=` sets it without scripts. */
	let selectedPackage = $derived(data.selectedPackage);

	function choosePackage(choice: string) {
		selectedPackage = choice;
		document.getElementById('contact')?.scrollIntoView();
		document.getElementById('contact-title')?.focus({ preventScroll: true });
	}

	const deadTitle = $derived(
		data.link.state === 'expired'
			? m.rates_expired_title()
			: data.link.state === 'off'
				? m.rates_off_title()
				: m.rates_unknown_title()
	);
</script>

<Seo
	title="{m.rates_title()} · {site.person.fullName}"
	description={site.meta.description}
	path="/"
	noindex
	siteName={site.person.fullName}
/>

{#if data.link.state === 'ok' && data.rates}
	<section class="px-6 pt-36 pb-4">
		<div class="mx-auto max-w-7xl">
			<header class="enter-up mx-auto max-w-3xl text-center">
				<p
					class="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary"
				>
					<LockKeyhole class="h-4 w-4" />
					{m.rates_for({ label: data.link.label })}
				</p>
				<h1 class="mb-5 text-5xl font-extrabold tracking-tight md:text-7xl">
					<span class="text-gradient">{m.rates_title()}</span>
				</h1>
				<p class="mb-3 text-lg text-foreground/75">{m.packages_subtitle()}</p>
				<p class="text-sm text-foreground/60">
					{m.rates_valid_until({ date: readableDate(data.link.expiresOn, locale) })}
				</p>
			</header>
		</div>
	</section>

	<Packages
		packages={data.rates.packages}
		customTags={data.rates.customTags}
		terms={data.rates.terms}
		onchoose={choosePackage}
		heading={false}
	/>
	<HowItWorks />
	<Payment payment={data.rates.payment} />
	<Contact
		firstName={site.person.firstName}
		contact={site.contact}
		packages={data.rates.packages}
		bind:selected={selectedPackage}
		{form}
	/>
{:else}
	<section class="flex min-h-[70vh] items-center justify-center px-6 pt-32 pb-24">
		<div class="enter-up glass-card max-w-xl rounded-[2rem] p-10 text-center">
			<span
				class="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"
			>
				<LockKeyhole class="h-7 w-7" />
			</span>
			<h1 class="mb-4 text-3xl font-extrabold">{deadTitle}</h1>
			<p class="mb-8 text-foreground/70">
				{m.rates_dead_body({ name: site.person.firstName })}
			</p>
			<a
				href={to('/', 'contact')}
				class="inline-flex min-h-12 items-center rounded-xl bg-primary px-6 font-semibold text-white shadow-glow"
			>
				{m.rates_ask()}
			</a>
		</div>
	</section>
{/if}
