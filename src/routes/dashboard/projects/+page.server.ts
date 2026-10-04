import { and, asc, count, desc, eq, isNull } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { project, projectImage } from '$lib/server/db/schema';

/** Every project that is not deleted, in the site's order, with how many gallery images each has. */
export const load = async () => {
	const rows = await db
		.select({
			id: project.id,
			title: project.title,
			slug: project.slug,
			client: project.client,
			category: project.category,
			completedOn: project.completedOn,
			isFeatured: project.isFeatured,
			status: project.status,
			sortOrder: project.sortOrder,
			images: count(projectImage.id)
		})
		.from(project)
		.leftJoin(
			projectImage,
			and(eq(projectImage.projectId, project.id), isNull(projectImage.deletedAt))
		)
		.where(isNull(project.deletedAt))
		.groupBy(project.id)
		.orderBy(desc(project.isFeatured), asc(project.sortOrder), desc(project.id));
	return { rows };
};
