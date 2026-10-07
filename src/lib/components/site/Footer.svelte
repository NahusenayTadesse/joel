<script lang="ts">
	import Globe from '@lucide/svelte/icons/globe';
	import Mail from '@lucide/svelte/icons/mail';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import Phone from '@lucide/svelte/icons/phone';
	import { formatPhone } from '$lib/format';
	import { ACADEMY_URL, to } from '$lib/links';
	import { m } from '$lib/paraglide/messages.js';
	import type { Site } from '$lib/server/site';
	import ExternalLink from './ExternalLink.svelte';
	import { PLATFORM_ICONS } from './icons';

	let {
		person,
		contact,
		footer
	}: { person: Site['person']; contact: Site['contact']; footer: Site['footer'] } = $props();

	const year = new Date().getFullYear();
	const quickLinks = $derived([
		{ href: to('/projects'), label: m.nav_projects() },
		{ href: to('/videos'), label: m.nav_videos() },
		{ href: to('/blog'), label: m.nav_blog() },
		{ href: to('/', 'about'), label: m.about_heading({ name: person.firstName }) },
		{ href: to('/', 'contact'), label: m.nav_contact() }
	]);
	const websiteLabel = $derived(contact.website?.replace(/^https?:\/\//, '').replace(/\/$/, ''));
</script>

{#snippet founder()}
	{#if footer.founderUrl}
		<ExternalLink href={footer.founderUrl} class="font-bold text-primary"
			>{footer.founderOf}</ExternalLink
		>
	{:else}
		<span class="font-bold text-primary">{footer.founderOf}</span>
	{/if}
{/snippet}

<footer class="relative border-t border-foreground/5 bg-site-deep px-6 pt-20 pb-10">
	<div class="mx-auto mb-16 grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
		<div class="lg:col-span-2">
			<div class="mb-6 flex items-center gap-2">
				<div
					class="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-primary to-accent text-xl font-bold text-white"
				>
					{person.initials}
				</div>
				<span class="text-2xl font-bold tracking-tight">
					{person.firstName} <span class="text-primary">{person.lastName}</span>
				</span>
			</div>
			{#if footer.blurb}
				<p class="mb-8 max-w-sm leading-relaxed text-foreground/70">{footer.blurb}</p>
			{/if}
			<div class="flex gap-4">
				{#each footer.socials.filter((social) => social.url) as social (social.id)}
					{@const { icon: Icon, hover } = PLATFORM_ICONS[social.platform]}
					<ExternalLink
						href={social.url ?? ''}
						aria-label={social.name}
						class={[
							'glass flex h-11 w-11 items-center justify-center rounded-full transition-all hover:scale-110',
							hover
						]}
					>
						<Icon class="h-5 w-5" />
					</ExternalLink>
				{/each}
			</div>
		</div>

		<div>
			<h4 class="mb-6 text-lg font-bold">{m.footer_contact()}</h4>
			<ul class="space-y-1">
				<li>
					<a
						href="mailto:{contact.email}"
						class="flex min-h-10 items-center gap-3 text-foreground/70 transition-colors hover:text-primary"
					>
						<Mail class="h-5 w-5 shrink-0" />
						<span>{contact.email}</span>
					</a>
				</li>
				<li>
					<a
						href="tel:{contact.phoneIntl}"
						class="flex min-h-10 items-center gap-3 text-foreground/70 transition-colors hover:text-primary"
					>
						<Phone class="h-5 w-5 shrink-0" />
						<span>{formatPhone(contact.phoneIntl)}</span>
					</a>
				</li>
				{#if contact.website}
					<li>
						<ExternalLink
							href={contact.website}
							class="flex min-h-10 items-center gap-3 text-foreground/70 transition-colors hover:text-primary"
						>
							<Globe class="h-5 w-5 shrink-0" />
							<span>{websiteLabel}</span>
						</ExternalLink>
					</li>
				{/if}
				{#if contact.location}
					<li class="flex min-h-10 items-center gap-3 text-foreground/70">
						<MapPin class="h-5 w-5 shrink-0" />
						<span>{contact.location}</span>
					</li>
				{/if}
			</ul>
		</div>

		<div>
			<h4 class="mb-6 text-lg font-bold">{m.footer_links()}</h4>
			<ul class="space-y-1">
				{#each quickLinks as link (link.href)}
					<li>
						<a
							href={link.href}
							class="flex min-h-10 items-center text-foreground/70 transition-colors hover:text-primary"
						>
							{link.label}
						</a>
					</li>
				{/each}
				<li>
					<ExternalLink
						href={ACADEMY_URL}
						class="flex min-h-10 items-center text-foreground/70 transition-colors hover:text-primary"
					>
						{m.nav_academy()}
					</ExternalLink>
				</li>
			</ul>
		</div>
	</div>

	<div
		class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-foreground/5 pt-8 md:flex-row"
	>
		<p class="text-sm text-foreground/60">{m.footer_rights({ year, name: person.fullName })}</p>
		{#if footer.founderOf}
			<p class="text-sm text-foreground/60">
				{m.footer_founder_before()}{@render founder()}{m.footer_founder_after()}
			</p>
		{/if}
	</div>
</footer>
