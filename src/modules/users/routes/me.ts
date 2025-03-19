import prismaElysia from '@/decorators/prisma';
import Elysia from 'elysia';
import { jwtAccessSetup, jwtRefreshSetup } from '@/helpers/jwt';
import type { ResponseMeModel } from '../users.models';
import authPlugin from '@/plugin/authPlugin';

const me = new Elysia()
	.use(jwtAccessSetup)
	.use(jwtRefreshSetup)
	.use(prismaElysia)
	.use(authPlugin)
	.get(
		'/me',
		async ({
			body,
			prisma,
			set,
			jwtAccess,
			jwtRefresh,
			headers,
			request,
			...ctx
		}) => {
			return {
				statusCode: 200,
				success: true,
				message: 'Success find user',
				data: {},
			};
		},
	);
export default me;
