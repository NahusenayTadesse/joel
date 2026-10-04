import { and, eq, isNull } from 'drizzle-orm';
import type { AnyMySqlColumn } from 'drizzle-orm/mysql-core';
import type { Locale } from '$lib/paraglide/runtime';

/**
 * The Amharic column when the page is in Amharic and the column is filled in, else the English.
 * An untranslated field shows in English rather than blank.
 */
export function localized<T>(english: T, amharic: T | null | undefined, locale: Locale): T {
	if (locale !== 'am' || amharic == null) return english;
	if (typeof amharic === 'string' && amharic.trim() === '') return english;
	if (Array.isArray(amharic) && amharic.length === 0) return english;
	return amharic;
}

/** A list table's rows that are switched on and not deleted. */
export const live = (table: { status: AnyMySqlColumn; deletedAt: AnyMySqlColumn }) =>
	and(eq(table.status, true), isNull(table.deletedAt));
