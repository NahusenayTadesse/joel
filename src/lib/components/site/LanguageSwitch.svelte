<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { m } from '$lib/paraglide/messages.js';
	import { getLocale, locales, localizeHref, type Locale } from '$lib/paraglide/runtime';

	const labels: Record<Locale, { short: string; name: string }> = {
		en: { short: 'EN', name: 'English' },
		am: { short: 'አማ', name: 'አማርኛ' }
	};

	const current = getLocale();
</script>

<!--
	A full page load, not client-side navigation: messages are read once per render, so the whole
	page has to be drawn again in the new language.
-->
<nav aria-label={m.nav_language()} class="glass flex items-center gap-0.5 rounded-xl p-1">
	{#each locales as locale (locale)}
		<a
			href={resolve(localizeHref(page.url.pathname, { locale }) as '/')}
			hreflang={locale}
			lang={locale}
			aria-label={labels[locale].name}
			aria-current={locale === current ? 'true' : undefined}
			data-sveltekit-reload
			class={[
				'flex h-8 items-center rounded-lg px-2.5 text-xs font-semibold transition-colors',
				locale === current
					? 'bg-foreground/10 text-foreground'
					: 'text-foreground/70 hover:text-primary'
			]}
		>
			{labels[locale].short}
		</a>
	{/each}
</nav>
