import { and, eq, isNull, ne, type SQL } from 'drizzle-orm';
import type { AnyMySqlColumn, MySqlTable } from 'drizzle-orm/mysql-core';
import { db } from '$lib/server/db';
import { slugify } from '$lib/slug';

/**
 * A slug for `value` that no live row of `table` uses: `launch`, then `launch-2`, `launch-3`.
 *
 * `ignoreId` is the row being saved, so saving without renaming keeps its own slug. Deleted rows
 * do not count: the unique index is on the live slug (`whileNotDeleted`), so a deleted post's
 * address may be reused.
 */
export async function uniqueSlug(
	table: MySqlTable & { id: AnyMySqlColumn; slug: AnyMySqlColumn; deletedAt: AnyMySqlColumn },
	value: string,
	{ ignoreId = 0, fallback = 'item' }: { ignoreId?: number; fallback?: string } = {}
): Promise<string> {
	const base = slugify(value, fallback);
	let candidate = base;
	for (let n = 2; ; n++) {
		const conditions: SQL[] = [eq(table.slug, candidate), isNull(table.deletedAt)];
		if (ignoreId) conditions.push(ne(table.id, ignoreId));
		const [clash] = await db
			.select({ id: table.id })
			.from(table)
			.where(and(...conditions))
			.limit(1);
		if (!clash) return candidate;
		candidate = `${base}-${n}`;
	}
}
