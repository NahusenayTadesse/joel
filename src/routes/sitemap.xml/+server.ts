import { baseLocale, locales, localizeHref, type Locale } from '$lib/paraglide/runtime';
import { listPosts } from '$lib/server/posts';
import { listProjects } from '$lib/server/projects';

/**
 * Every public page, once per language. Each entry names its translations, so search engines
 * show the Amharic page to Amharic searchers and the English one to everyone else. The rates
 * page is private and never listed.
 */
export const GET = async ({ url }) => {
	const [projects, posts] = await Promise.all([listProjects(baseLocale), listPosts()]);
	const paths: { path: string; modified?: Date | string | null }[] = [
		{ path: '/' },
		{ path: '/projects' },
		{ path: '/videos' },
		{ path: '/blog' },
		...projects.map((p) => ({ path: `/projects/${p.slug}`, modified: p.completedOn })),
		...posts.map((p) => ({ path: `/blog/${p.slug}`, modified: p.publishedAt }))
	];

	const href = (path: string, locale: Locale) =>
		new URL(localizeHref(path, { locale }), url.origin).href;
	const escape = (text: string) => text.replace(/&/g, '&amp;');

	const urls = paths.flatMap(({ path, modified }) => {
		const alternates = [
			...locales.map(
				(locale) =>
					`<xhtml:link rel="alternate" hreflang="${locale}" href="${escape(href(path, locale))}"/>`
			),
			`<xhtml:link rel="alternate" hreflang="x-default" href="${escape(href(path, baseLocale))}"/>`
		].join('');
		const lastmod = modified
			? `<lastmod>${new Date(modified).toISOString().slice(0, 10)}</lastmod>`
			: '';
		return locales.map(
			(locale) => `<url><loc>${escape(href(path, locale))}</loc>${lastmod}${alternates}</url>`
		);
	});

	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`,
		{ headers: { 'content-type': 'application/xml', 'cache-control': 'public, max-age=3600' } }
	);
};
