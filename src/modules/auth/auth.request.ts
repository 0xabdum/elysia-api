import type Elysia from "elysia";
import {
	type RegisterPayload,
	LoginPayloadSchema,
	RegisterPayloadSchema,
} from "@/schemas/users.schema";
import prismaElysia from "@/decorators/prisma";
import { uniqueUsernameEmail } from "./auth.handler";

const authValidationHandler = (app: Elysia) =>
	app.use(prismaElysia).derive(async ({ route, body, prisma }) => {
		const path = route.split("/");
		switch (true) {
			case path.includes("register"): {
				await uniqueUsernameEmail(prisma, body as RegisterPayload);
				const register = RegisterPayloadSchema.safeParse(body);
				if (!register.success) {
					throw {
						code: "CUSTOM_VALIDATION_ERROR",
						error: register.error.errors,
					};
				}
				break;
			}
			case path.includes("login"): {
				const login = LoginPayloadSchema.safeParse(body);

				if (!login.success) {
					throw {
						code: "CUSTOM_VALIDATION_ERROR",
						error: login.error.errors,
					};
				}
				break;
			}
			default:
				return;
		}
	});

export { authValidationHandler };
