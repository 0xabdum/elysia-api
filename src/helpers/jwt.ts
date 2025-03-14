import { jwt } from '@elysiajs/jwt';
import env from '@helpers/env';
import Elysia from 'elysia';

const jwtAccessSetup = new Elysia({
	name: 'jwtAccess',
}).use(
	jwt({
		name: 'jwtAccess',
		secret: env.JWT_SECRETS,
		exp: env.JWT_EXPIRED,
	}),
);

const jwtRefreshSetup = new Elysia({
	name: 'jwtRefresh',
}).use(
	jwt({
		name: 'jwtRefresh',
		secret: env.JWT_SECRETS,
		exp: env.JWT_REFRESH_EXPIRED,
	}),
);

export { jwtAccessSetup, jwtRefreshSetup };
