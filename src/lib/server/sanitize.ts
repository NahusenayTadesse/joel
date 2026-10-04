import sanitizeHtml from 'sanitize-html';

/*
 * What a rich text body (a blog post, a project write-up) may contain.
 *
 * The editor runs in the dashboard, but what reaches the server is whatever was posted, and the
 * page renders it with `{@html}`. So the body is narrowed here, **on write**: every stored body
 * is already allowlisted, and nothing that renders one — the post page, the RSS feed — can forget
 * to sanitise. sanitize-html parses rather than pattern-matches, which is the point of it.
 *
 * Ported from content-svelte's `server/sanitize.ts`.
 */

const ALLOWED_TAGS = [
	'p',
	'br',
	'hr',
	'h2',
	'h3',
	'h4',
	'blockquote',
	'pre',
	'code',
	'strong',
	'b',
	'em',
	'i',
	'u',
	's',
	'del',
	'mark',
	'sub',
	'sup',
	'ul',
	'ol',
	'li',
	'a',
	'img',
	'figure',
	'figcaption',
	'table',
	'thead',
	'tbody',
	'tr',
	'th',
	'td',
	'span'
];

/**
 * Classes the editor emits for code highlighting and task lists. Matched, not free: a free
 * `class` would let a body reach the site's own utility classes and repaint the page around it.
 */
const ALLOWED_CLASSES = [/^language-[\w-]+$/, /^hljs(-[\w-]+)?$/, /^tipex-[\w-]+$/];

const CONFIG: sanitizeHtml.IOptions = {
	allowedTags: ALLOWED_TAGS,
	allowedAttributes: {
		// `target` and `rel` are set by `transformTags`, and must be listed to survive it.
		a: ['href', 'title', 'target', 'rel'],
		img: ['src', 'alt', 'title', 'width', 'height', 'loading', 'decoding'],
		td: ['colspan', 'rowspan'],
		th: ['colspan', 'rowspan', 'scope'],
		ol: ['start'],
		code: ['class'],
		pre: ['class'],
		span: ['class'],
		li: ['class'],
		ul: ['class']
	},
	allowedClasses: { '*': ALLOWED_CLASSES },
	/*
	 * No `javascript:` or `data:` links. An image may not point at another site at all: it would
	 * break the day its host renames it and tell that host who read the post. With no scheme
	 * allowed for `img`, only a path on this site survives — an upload under `/media/`.
	 */
	allowedSchemes: ['http', 'https', 'mailto'],
	allowedSchemesByTag: { img: [] },
	allowProtocolRelative: false,
	disallowedTagsMode: 'discard',
	transformTags: {
		a: (tagName, attribs) => {
			const external = /^https?:\/\//i.test(attribs.href ?? '');
			return {
				tagName,
				attribs: {
					...attribs,
					...(external ? { target: '_blank', rel: 'noopener noreferrer nofollow' } : {})
				}
			};
		},
		img: (tagName, attribs) => ({
			tagName,
			attribs: { ...attribs, loading: 'lazy', decoding: 'async' }
		})
	},
	selfClosing: ['img', 'br', 'hr'],
	// An image whose source was refused would draw as a broken-image icon: drop it whole.
	exclusiveFilter: (frame) => frame.tag === 'img' && !frame.attribs.src
};

/** A body narrowed to the allowlist. Empty for nothing, or for markup with no text or image. */
export function sanitizeRichHtml(html: string | null | undefined): string {
	if (!html) return '';
	const clean = sanitizeHtml(html, CONFIG).trim();
	return htmlToText(clean) || /<img\b/i.test(clean) ? clean : '';
}

/** The body as plain text: for the reading time and an excerpt written from it. */
export function htmlToText(html: string | null | undefined): string {
	if (!html) return '';
	// Block boundaries become spaces first, or `<p>one</p><p>two</p>` reads as "onetwo".
	const spaced = html.replace(
		/<\/?(?:p|br|div|h[1-6]|li|ul|ol|tr|td|th|table|blockquote|pre|figure|figcaption|hr)\b[^>]*>/gi,
		' '
	);
	return sanitizeHtml(spaced, { allowedTags: [], allowedAttributes: {} })
		.replace(/&nbsp;/g, ' ')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
		.replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
		.replace(/&amp;/g, '&')
		.replace(/\s+/g, ' ')
		.trim();
}

/** Whole minutes at 220 words a minute, and never 0 for a body with words in it. */
export function readingMinutes(text: string): number {
	const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
	return words ? Math.max(1, Math.round(words / 220)) : 1;
}

/** The first `limit` characters, cut at a word: an excerpt when none was written. */
export function summarize(text: string, limit = 200): string {
	if (text.length <= limit) return text;
	const cut = text.slice(0, limit);
	const lastSpace = cut.lastIndexOf(' ');
	return `${(lastSpace > limit * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}
