import type { PrismaClient } from '@prisma/client';
import { NotFoundError } from 'elysia';
import { GlobalResponseError } from '@helpers/errors';
import { hashAuth, isMatchAuth } from './auth.service';
import type {
	LoginPayload,
	RegisterPayload,
	SessionPayload,
} from '@/schemas/users.schema';
import { convertTimeToDate } from '@/helpers/utils';
import env from '@/helpers/env';

const uniqueUsernameEmail = async (
	prisma: PrismaClient,
	payload: RegisterPayload,
) => {
	const existingUser = await prisma.user.findFirst({
		where: {
			OR: [{ username: payload.username }, { email: payload.email }],
		},
	});
	if (existingUser) {
		throw {
			code: 'CUSTOM_VALIDATION_ERROR',
			error: [
				existingUser.username === payload.username
					? { path: ['username'], message: 'sudah digunakan' }
					: null,
				existingUser.email === payload.email
					? { path: ['email'], message: 'sudah digunakan' }
					: null,
			].filter(Boolean),
			message: 'username atau email sudah digunakan',
		};
	}
};

const registerAuth = async (prisma: PrismaClient, payload: RegisterPayload) => {
	const passwordHash = await hashAuth(payload.password);

	const createUserAuth = await prisma.user.create({
		data: {
			password: passwordHash,
			username: payload.username,
			email: payload.email,
			firstName: payload.firstName,
			roleId: payload.roleId,
		},
		select: {
			id: true,
			username: true,
			email: true,
			firstName: true,
			roleId: true,
			createdAt: true,
		},
	});

	return createUserAuth;
};

const loginAuth = async (prisma: PrismaClient, payload: LoginPayload) => {
	const auth = await prisma.user.findFirstOrThrow({
		where: {
			email: payload.email,
		},
		select: {
			id: true,
			email: true,
			username: true,
			role: true,
			password: true,
		},
	});

	if (!auth) {
		throw new NotFoundError('email & password tidak sesuai');
	}

	const isPasswordMatch = await isMatchAuth(payload.password, auth.password);

	if (!isPasswordMatch) {
		throw new GlobalResponseError(401, 'email & password tidak sesuai', {
			client: 'Invalid credentials',
		});
	}

	return {
		userId: auth.id,
		email: auth.email,
		username: auth.username,
		role: auth.role.id,
	};
};

const sessionAuth = async (prisma: PrismaClient, payload: SessionPayload) => {
	await prisma.userSession.deleteMany({
		where: {
			expiresAt: { lt: new Date() },
		},
	});

	const session = await prisma.userSession.upsert({
		where: { token: payload.token },
		update: {
			token: payload.token,
			userAgent: payload.userAgent,
			ipAddress: payload.ipAddress,
			expiresAt: convertTimeToDate(env.JWT_EXPIRED as string),
		},
		create: {
			userId: payload.userId,
			token: payload.token,
			userAgent: payload.userAgent,
			ipAddress: payload.ipAddress,
			expiresAt: convertTimeToDate(env.JWT_EXPIRED as string),
		},
	});
	if (!session) {
		throw new GlobalResponseError(401, 'login gagal coba beberapa saat lagi', {
			client: 'Invalid credentials',
		});
	}
	const refreshSession = await prisma.refreshToken.upsert({
		where: { refreshToken: payload.refreshToken },
		update: {
			refreshToken: payload.refreshToken,
			expiresAt: convertTimeToDate(env.JWT_EXPIRED as string),
		},
		create: {
			userId: payload.userId,
			sessionId: session.id,
			refreshToken: payload.refreshToken as string,
			expiresAt: convertTimeToDate(env.JWT_REFRESH_EXPIRED as string),
		},
	});
	if (!refreshSession) {
		throw new GlobalResponseError(401, 'login gagal coba beberapa saat lagi', {
			client: 'Invalid credentials',
		});
	}
};

export { registerAuth, loginAuth, uniqueUsernameEmail, sessionAuth };
