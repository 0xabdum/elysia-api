import { endpointToSlug } from '@/helpers/utils';
import { PrismaClient } from '@prisma/client';
import type Elysia from 'elysia';
const prisma = new PrismaClient();
const registerRoutesOnStartup = async (app: Elysia) => {
	const routes = app.routes
		.map((route) => route.path)
		.filter((item) => !item.includes('auth') && item !== '/' && item !== '/*');

	for (const route of routes) {
		const slug = endpointToSlug(route);

		const exists = await prisma.permission.findUnique({
			where: { name: slug },
		});

		if (!exists) {
			await prisma.permission.create({
				data: {
					name: slug,
					description: `Permission for ${route}`,
				},
			});
			console.log(`✅ Permission '${slug}' registered`);
		}
	}
};
export default registerRoutesOnStartup;
