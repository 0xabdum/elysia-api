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
	.get(
		'/me',
		async ({ user }): Promise<ResponseMe> => {
			return {
				statusCode: 200,
				success: true,
				message: 'Success find user',
				data: user,
			};
		},
		{
			detail: {
				summary: 'Get My Profile',
				tags: ['Users'],
				parameters: [
					{
						name: 'Authorization',
						in: 'header',
						required: true,
						description: 'Token Bearer untuk autentikasi',
						schema: {
							type: 'string',
							example: 'Bearer your_access_token_here',
						},
					},
				],
			},
		},
	)
	.put(
		'/profile',
		async ({ user }): Promise<ResponseMe> => {
			return {
				statusCode: 200,
				success: true,
				message: 'Success find user',
				data: user,
			};
		},
		{
			detail: {
				summary: 'Get My Profile',
				tags: ['Users'],
				parameters: [
					{
						name: 'Authorization',
						in: 'header',
						required: true,
						description: 'Token Bearer untuk autentikasi',
						schema: {
							type: 'string',
							example: 'Bearer your_access_token_here',
						},
					},
				],
			},
		},
	);
export default me;
