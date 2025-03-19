import prismaElysia from '@/decorators/prisma';
import { GlobalResponseError } from '@/helpers/errors';
import { jwtAccessSetup, jwtRefreshSetup } from '@/helpers/jwt';
import type { UserType } from '@/schemas/users.schema';
import type Elysia from 'elysia';

const authPlugin = (app: Elysia) =>
	app
		.use(prismaElysia)
		.use(jwtAccessSetup)
		.use(jwtRefreshSetup)
		.derive(
			async ({
				headers,
				jwtAccess,
				prisma,
				route,
			}): Promise<{
				user: Omit<UserType, 'password' | 'lastName'> & {
					auth: undefined;
					lastName?: string | null;
				};
			}> => {
				// Don't check auth when route is public
				if (route.includes('public')) {
					// @ts-expect-error
					return;
				}

				const headerAuth = headers.authorization;
				const bearer = headerAuth?.startsWith('Bearer ')
					? headerAuth.slice(7)
					: null;

				if (!bearer) {
					throw new GlobalResponseError(400, 'Token not found', {
						client: 'Authorization header not found',
					});
				}

				const jwtPayload = await jwtAccess.verify(bearer);

				if (!jwtPayload || !jwtPayload.sub) {
					throw new GlobalResponseError(401, 'Invalid token', {
						client: 'Invalid credentials',
					});
				}

				const parse = JSON.parse(jwtPayload.sub) || null;

				if (!parse || parse === null) {
					throw new GlobalResponseError(401, 'Invalid token', {
						client: 'Invalid credentials',
					});
				}

				const user = await prisma.user.findUnique({
					where: {
						id: parse.userId,
					},
					select: {
						id: true,
						email: true,
						username: true,
						firstName: true,
						lastName: true,
						roleId: true,
					},
				});

				if (!user) {
					throw new GlobalResponseError(401, 'Invalid user', {
						client: 'Invalid credentials',
					});
				}

				return {
					user: {
						...user,
						auth: undefined,
					},
				};
			},
		);
export default authPlugin;
