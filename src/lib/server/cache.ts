/*
 * The public site's content cache.
 *
 * The content changes only when the dashboard saves, yet every page view and every image asked
 * the database for it. Readers are wrapped in `cached()` instead: any write under /dashboard
 * clears them all (`invalidateContent`, called from `hooks.server.ts`), and each entry expires
 * on its own after `ttl` anyway, for changes made outside the dashboard — a seed, a sync, an
 * edit in the database itself.
 */

const clears = new Set<() => void>();

/**
 * `read`, remembered per key for `ttl` milliseconds. A failed read is not remembered: the next
 * call tries again rather than serving the failure for a minute.
 */
export function cached<K, T>(read: (key: K) => Promise<T>, ttl = 60_000) {
	const entries = new Map<string, { value: Promise<T>; at: number }>();
	clears.add(() => entries.clear());
	return (key: K): Promise<T> => {
		const id = JSON.stringify(key ?? null);
		const hit = entries.get(id);
		if (hit && Date.now() - hit.at < ttl) return hit.value;
		const entry = { value: read(key), at: Date.now() };
		entry.value.catch(() => {
			if (entries.get(id) === entry) entries.delete(id);
		});
		entries.set(id, entry);
		return entry.value;
	};
}

/** Forgets every cached read, so the next view sees what was just saved. */
export function invalidateContent() {
	for (const clear of clears) clear();
}
