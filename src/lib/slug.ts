/**
 * A URL slug from a title: `Galaxy S24 Launch!` → `galaxy-s24-launch`.
 *
 * Letters and digits of any script are kept, so an Amharic title gives an Amharic slug
 * (`የቴክ-ምክሮች`) rather than nothing: browsers show it as written and percent-encode it on the
 * wire, and it reads better to an Amharic searcher than `post-7`. Accents are folded first, and
 * everything else becomes a single hyphen.
 */
export function slugify(text: string, fallback = 'item'): string {
	const slug = text
		.normalize('NFKD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/[^\p{L}\p{N}]+/gu, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 100)
		.replace(/-+$/, '');
	return slug || fallback;
}
