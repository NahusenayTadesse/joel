/**
 * A `contentCrud` transform: an optional text left empty is stored as NULL, not as ''. The public
 * page reads NULL as "not given" — an Amharic column falls back to English, a link is left out.
 */
export function blankToNull(values: Record<string, unknown>): Record<string, unknown> {
	for (const [key, value] of Object.entries(values)) {
		if (typeof value === 'string' && value.trim() === '') values[key] = null;
	}
	return values;
}
