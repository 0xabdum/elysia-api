import prismaElysia from '@/decorators/prisma';
import Elysia from 'elysia';
import { jwtAccessSetup, jwtRefreshSetup } from '@/helpers/jwt';
import type { ResponseMe } from '../users.models';
import authPlugin from '@/plugin/authPlugin';
import { authorize } from '@/middleware/authorize';

const me = new Elysia()
	.use(jwtAccessSetup)
	.use(jwtRefreshSetup)
	.use(prismaElysia)
	.use(authPlugin)
	.onBeforeHandle(async ({ prisma, user, path }) => {
		await authorize(prisma, user.roleId, path);
	})
	.get('/me', async ({ user }): Promise<ResponseMe> => {
		return {
			statusCode: 200,
			success: true,
			message: 'Success find user',
			data: user,
		};
	});
export default me;
