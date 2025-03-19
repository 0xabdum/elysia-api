import type { PrismaClient } from '@prisma/client';
import { endpointToSlug } from '@/helpers/utils';
import { GlobalResponseError } from '@/helpers/errors';

export const authorize = async (
	prisma: PrismaClient,
	roleId: number,
	path: string,
) => {
	const requiredPermission = endpointToSlug(path);

	const user = await prisma.user.findFirst({
		where: {
			roleId: roleId,
			role: {
				permissions: {
					some: { permission: { name: requiredPermission } },
				},
			},
		},
	});

	if (!user) {
		throw new GlobalResponseError(
			403,
			'You are not allowed to access this resource',
			{
				client: 'Forbidden',
			},
		);
	}

	return { user };
};
