/** A follower count as the cards show it: 440000 → { value: 440, suffix: 'k' }, 4500000 → 4.5 'M'. */
export function compactCount(count: number): { value: number; suffix: string; decimals: number } {
	if (count >= 1_000_000) {
		const value = Math.floor(count / 100_000) / 10;
		return { value, suffix: 'M', decimals: Number.isInteger(value) ? 0 : 1 };
	}
	if (count >= 1_000) return { value: Math.floor(count / 1_000), suffix: 'k', decimals: 0 };
	return { value: count, suffix: '', decimals: 0 };
}

/** Birr amounts with thousands separators, as on the original: 129,999. */
export function formatPrice(price: number): string {
	return new Intl.NumberFormat('en-US').format(price);
}

/** +251955928986 → +251 955 928 986. Anything else is returned as it was typed. */
export function formatPhone(phone: string): string {
	const match = phone.replace(/\s+/g, '').match(/^\+251(\d{3})(\d{3})(\d{3})$/);
	return match ? `+251 ${match[1]} ${match[2]} ${match[3]}` : phone;
}

/**
 * Splits the about text on its highlight markers: `**words**` → primary, `__words__` → accent.
 */
export function highlightSegments(text: string): { text: string; tone?: 'primary' | 'accent' }[] {
	return text
		.split(/(\*\*[^*]+\*\*|__[^_]+__)/)
		.filter(Boolean)
		.map((part) => {
			if (part.startsWith('**') && part.endsWith('**'))
				return { text: part.slice(2, -2), tone: 'primary' };
			if (part.startsWith('__') && part.endsWith('__'))
				return { text: part.slice(2, -2), tone: 'accent' };
			return { text: part };
		});
}

/** 24483 → "24K" / "24 ሺ": view counts on video cards, in the page's language. */
export function compactNumber(value: number, locale: string): string {
	return new Intl.NumberFormat(locale === 'am' ? 'am-ET' : 'en', {
		notation: 'compact',
		maximumFractionDigits: 1
	}).format(value);
}

/** A date as a reader expects it: "Sep 27, 2026" / "ሴፕቴ 27, 2026". */
export function readableDate(value: Date | string, locale: string): string {
	const date = typeof value === 'string' ? new Date(value) : value;
	return new Intl.DateTimeFormat(locale === 'am' ? 'am-ET' : 'en', { dateStyle: 'medium' }).format(
		date
	);
}
