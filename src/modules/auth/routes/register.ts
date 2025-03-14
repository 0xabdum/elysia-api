import prismaElysia from '@/decorators/prisma';
import Elysia from 'elysia';
import type { ResponseRegister } from '../auth.model';
import type { RegisterPayload } from '@/schemas/users.schema';
import { registerAuth } from '../auth.handler';
import { authValidationHandler } from '../auth.request';

const register = new Elysia()
	.use(prismaElysia)
	.use(authValidationHandler)
	.post(
		'/register',
		async ({ body, prisma, set }): Promise<ResponseRegister> => {
			const registerRecordUser = await registerAuth(
				prisma,
				body as RegisterPayload,
			);
			set.status = 201;
			return {
				statusCode: 201,
				success: true,
				message: 'Success register user',
				data: registerRecordUser,
			};
		},
	);
export default register;
