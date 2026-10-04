import { publicFileUrl } from '@nahu/admin-kit/files';
import { listPosts } from '$lib/server/posts';
import { loadSite } from '$lib/server/site';

const escape = (text: string) =>
	text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** The blog as RSS 2.0: the 40 newest public posts, linked at the English addresses. */
export const GET = async ({ url }) => {
	const [posts, site] = await Promise.all([listPosts(), loadSite('en')]);
	const name = site?.person.fullName ?? 'Blog';
	const items = posts.slice(0, 40).map((post) => {
		const link = new URL(`/blog/${encodeURIComponent(post.slug)}`, url.origin).href;
		const image = post.cover ? new URL(publicFileUrl(post.cover), url.origin).href : null;
		return `<item>
<title>${escape(post.title)}</title>
<link>${link}</link>
<guid isPermaLink="true">${link}</guid>
${post.publishedAt ? `<pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>` : ''}
${post.excerpt ? `<description>${escape(post.excerpt)}</description>` : ''}
${(post.tags ?? []).map((tag) => `<category>${escape(tag)}</category>`).join('')}
${image ? `<enclosure url="${image}" type="image/${image.split('.').pop() === 'png' ? 'png' : image.endsWith('.webp') ? 'webp' : 'jpeg'}" length="0"/>` : ''}
</item>`;
	});
	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
<title>${escape(name)}</title>
<link>${new URL('/blog', url.origin).href}</link>
<description>${escape(site?.meta.description ?? '')}</description>
${items.join('\n')}
</channel>
</rss>
`,
		{
			headers: {
				'content-type': 'application/rss+xml; charset=utf-8',
				'cache-control': 'public, max-age=900'
			}
		}
	);
};
