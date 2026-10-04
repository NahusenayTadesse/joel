import { sql } from 'drizzle-orm';
import { customType, varchar } from 'drizzle-orm/mysql-core';
import { fieldMixins } from '@nahu/admin-kit/server/schema';
import { user } from './auth.schema';

export const { deletionFields, secureFields, lesserFields } = fieldMixins(() => user.id);

/**
 * A list of strings kept as JSON text.
 *
 * Not Drizzle's `json()`: on MariaDB that becomes LONGTEXT with a `CHECK (json_valid(…))`, and
 * drizzle-kit 0.31 fails without a word while reading those checks back, so `db:push` stops
 * working once such a table exists. Plain LONGTEXT has no check; this type does the
 * (de)serialising, and reads the driver's value whether it arrives as text or already parsed.
 */
export const stringList = customType<{ data: string[]; driverData: string }>({
	dataType: () => 'longtext',
	toDriver: (value) => JSON.stringify(value ?? []),
	fromDriver: (value) => {
		const parsed: unknown = typeof value === 'string' ? JSON.parse(value) : value;
		return Array.isArray(parsed) ? parsed.map(String) : [];
	}
});

/**
 * `column`'s value while the row is not deleted, and NULL once it is — the column a table's unique
 * index goes on, instead of the name itself.
 *
 * The kit soft-deletes (it stamps `deleted_at` and keeps the row), so a plain `unique()` name stays
 * taken forever: a deleted brand's name could never be used again, and the form would say it
 * "already exists" about a row nobody can see. A unique index allows any number of NULLs, so
 * deleted rows drop out of it. MariaDB has no partial indexes; a virtual column is the way there.
 */
export const whileNotDeleted = (name: string, column: string, length: number) =>
	varchar(name, { length }).generatedAlwaysAs(
		sql.raw(`if(\`deleted_at\` is null, \`${column}\`, null)`),
		{ mode: 'virtual' }
	);
