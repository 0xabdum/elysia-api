import { z } from "zod";

const UserSchema = z.object({
	username: z
		.string({ message: "harus diisi" })
		.min(3, "minimal 3 karakter")
		.max(50, "maksimal 50 karakter"),
	email: z.string({ message: "harus diisi" }).email("email tidak valid"),
	password: z.string().min(8, "minimal 8 karakter"),
	firstName: z.string().min(1, "harus diisi"),
	lastName: z.string().optional(),
	roleId: z.number().int().positive(),
});

const RegisterPayloadSchema = UserSchema.pick({
	username: true,
	email: true,
	password: true,
	firstName: true,
	lastName: true,
	roleId: true,
});

const LoginPayloadSchema = UserSchema.pick({
	email: true,
	password: true,
});

const SessionSchema = z.object({
	userId: z.number().int().positive(),
	token: z.string().min(10, "Token tidak valid"),
	userAgent: z.string().optional(),
	ipAddress: z.string().ip().optional(),
	expiresAt: z.date().nullable().optional(),
	refreshToken: z.string().min(10, "Token tidak valid").optional(),
	sessionId: z.string().min(10, "Token tidak valid").optional(),
});

type UserType = z.infer<typeof UserSchema>;
type RegisterPayload = z.infer<typeof RegisterPayloadSchema>;
type LoginPayload = z.infer<typeof LoginPayloadSchema>;
type SessionPayload = z.infer<typeof SessionSchema>;

export { UserSchema, RegisterPayloadSchema, LoginPayloadSchema, SessionSchema };
export type { UserType, RegisterPayload, LoginPayload, SessionPayload };
