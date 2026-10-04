import { and, count, eq, gte, isNull, lte, sql, sum } from 'drizzle-orm';
import type { Stat } from '@nahu/admin-kit/components/reports/types';
import { db } from '$lib/server/db';
import {
	inquiry,
	post,
	project,
	rateLink,
	socialAccount,
	sponsorshipPackage
} from '$lib/server/db/schema';
import { addisToday } from '$lib/server/rates';

export const load = async () => {
	const [[inquiries], [links], [projects], [posts], [packages], [followers]] = await Promise.all([
		db
			.select({ n: count() })
			.from(inquiry)
			.where(and(eq(inquiry.stage, 'new'), isNull(inquiry.deletedAt))),
		db
			.select({ n: count() })
			.from(rateLink)
			.where(
				and(
					eq(rateLink.status, true),
					isNull(rateLink.deletedAt),
					gte(rateLink.expiresOn, addisToday())
				)
			),
		db
			.select({ n: count() })
			.from(project)
			.where(and(eq(project.status, true), isNull(project.deletedAt))),
		db
			.select({ n: count() })
			.from(post)
			.where(
				// `utc_timestamp()`, not `now()`: Drizzle stores datetimes in UTC and the server runs on EAT.
				and(
					eq(post.status, 'published'),
					lte(post.publishedAt, sql`utc_timestamp()`),
					isNull(post.deletedAt)
				)
			),
		db
			.select({ n: count() })
			.from(sponsorshipPackage)
			.where(and(eq(sponsorshipPackage.isActive, true), isNull(sponsorshipPackage.deletedAt))),
		db
			.select({ n: sum(socialAccount.followers) })
			.from(socialAccount)
			.where(
				and(
					eq(socialAccount.status, true),
					eq(socialAccount.showInStats, true),
					isNull(socialAccount.deletedAt)
				)
			)
	]);

	const stats: Stat[] = [
		{
			key: 'inquiries',
			label: 'New inquiries',
			value: inquiries?.n ?? 0,
			format: 'count',
			group: 'site',
			hint: 'From the contact forms, not yet answered'
		},
		{
			key: 'links',
			label: 'Active rate links',
			value: links?.n ?? 0,
			format: 'count',
			group: 'site',
			hint: 'Switched on and not yet expired'
		},
		{
			key: 'projects',
			label: 'Projects',
			value: projects?.n ?? 0,
			format: 'count',
			group: 'site',
			hint: 'Shown on the site'
		},
		{
			key: 'posts',
			label: 'Published posts',
			value: posts?.n ?? 0,
			format: 'count',
			group: 'site',
			hint: 'Live on the blog'
		},
		{
			key: 'packages',
			label: 'Packages',
			value: packages?.n ?? 0,
			format: 'count',
			group: 'site',
			hint: 'On the rates page'
		},
		{
			key: 'followers',
			label: 'Followers',
			value: Number(followers?.n ?? 0),
			format: 'count',
			group: 'site',
			hint: 'Across the accounts in the follower cards'
		}
	];

	return { stats };
};
