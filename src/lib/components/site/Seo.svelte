<script lang="ts">
	import { publicFileUrl } from '@nahu/admin-kit/files';
	import { page } from '$app/state';
	import {
		baseLocale,
		getLocale,
		locales,
		localizeHref,
		type Locale
	} from '$lib/paraglide/runtime';

	/**
	 * A page's head: title, description, canonical address, the other language's address, and
	 * what link previews (Telegram, WhatsApp, X) and search engines read.
	 */
	let {
		title,
		description,
		path,
		image = null,
		type = 'website',
		publishedTime = null,
		noindex = false,
		jsonLd = null,
		siteName
	}: {
		title: string;
		description: string;
		/** The page's path without a language prefix: `/projects/launch`. */
		path: string;
		/** A stored file name (served from /media) or a full URL. */
		image?: string | null;
		type?: 'website' | 'article' | 'profile';
		publishedTime?: Date | string | null;
		/** Keep it out of search results: a private or a preview page. */
		noindex?: boolean;
		/** Structured data for search engines, as a plain object. */
		jsonLd?: Record<string, unknown> | null;
		siteName: string;
	} = $props();

	/** Open Graph wants a territory with the language. */
	const OG_LOCALES: Record<Locale, string> = { en: 'en_US', am: 'am_ET' };

	const locale = getLocale();
	const absolute = (href: string) => new URL(href, page.url.origin).href;
	const canonical = $derived(absolute(localizeHref(path, { locale })));
	const imageUrl = $derived(
		image ? absolute(/^https?:\/\//.test(image) ? image : publicFileUrl(image)) : null
	);
	// `<` escaped, so no text in the data can close the script tag early.
	const structured = $derived(
		jsonLd
			? `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</` +
					'script>'
			: ''
	);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	{#if noindex}
		<meta name="robots" content="noindex, nofollow" />
	{:else}
		<link rel="canonical" href={canonical} />
		{#each locales as other (other)}
			<link
				rel="alternate"
				hreflang={other}
				href={absolute(localizeHref(path, { locale: other }))}
			/>
		{/each}
		<link
			rel="alternate"
			hreflang="x-default"
			href={absolute(localizeHref(path, { locale: baseLocale }))}
		/>
	{/if}

	<meta property="og:type" content={type} />
	<meta property="og:site_name" content={siteName} />
	<meta property="og:url" content={canonical} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:locale" content={OG_LOCALES[locale]} />
	{#each locales.filter((other) => other !== locale) as other (other)}
		<meta property="og:locale:alternate" content={OG_LOCALES[other]} />
	{/each}
	{#if imageUrl}
		<meta property="og:image" content={imageUrl} />
		<meta property="og:image:alt" content={title} />
	{/if}
	{#if publishedTime}
		<meta property="article:published_time" content={new Date(publishedTime).toISOString()} />
	{/if}
	<meta name="twitter:card" content={imageUrl ? 'summary_large_image' : 'summary'} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	{#if imageUrl}
		<meta name="twitter:image" content={imageUrl} />
	{/if}

	{#if structured}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- JSON from our own data, `<` escaped -->
		{@html structured}
	{/if}
</svelte:head>
