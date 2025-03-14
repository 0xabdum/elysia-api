import prismaElysia from "@/decorators/prisma";
import Elysia from "elysia";
import type { ResponseLogin } from "../auth.model";
import type { RegisterPayload } from "@/schemas/users.schema";
import { loginAuth, sessionAuth } from "../auth.handler";
import { authValidationHandler } from "../auth.request";
import { jwtAccessSetup, jwtRefreshSetup } from "@/helpers/jwt";
import env from "@/helpers/env";

const login = new Elysia()
	.use(jwtAccessSetup)
	.use(jwtRefreshSetup)
	.use(prismaElysia)
	.use(authValidationHandler)
	.post(
		"/login",
		async ({
			body,
			prisma,
			set,
			jwtAccess,
			jwtRefresh,
			headers,
			request,
			...ctx
		}): Promise<ResponseLogin> => {
			const user = await loginAuth(prisma, body as RegisterPayload);
			const { userId } = user;
			const accessToken = await jwtAccess.sign({
				sub: JSON.stringify({ ...user }),
			});
			const refreshToken = await jwtRefresh.sign({
				sub: JSON.stringify({ ...user }),
			});

			const userAgent = headers["user-agent"] || "unknown";
			const ipAddress = (ctx as any).ip || "unknown";

			await sessionAuth(prisma, {
				userId,
				ipAddress,
				userAgent,
				token: accessToken,
				refreshToken,
			});

			set.status = 200;

			return {
				statusCode: 200,
				success: true,
				message: "Success login user",
				data: {
					accessToken,
					refreshToken,
					exp: env.JWT_EXPIRED,
					expRefresh: env.JWT_REFRESH_EXPIRED,
				},
			};
		},
	);
export default login;
