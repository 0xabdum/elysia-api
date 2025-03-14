import { globalError, validationError } from '@/helpers/errors';
import type { ResponseError, ValidationType } from '@/helpers/models';
import Elysia from 'elysia';

const authRoutes = new Elysia({ prefix: '/auth' });

authRoutes.onError(({ error, code, ...ctx }): ResponseError => {
	if ('error' in error && 'code' in error) {
		const responseValidationError = validationError(
			error as ValidationType,
			ctx,
		);
		if (responseValidationError) return responseValidationError;
	}

	if (error instanceof Error) {
		const responseGlobalError = globalError(error, ctx);
		if (responseGlobalError) return responseGlobalError;
	}

	return {
		statusCode: 500,
		success: false,
		message: 'message' in error ? error.message : 'Internal Server Error',
		error: {},
	};
});

export default authRoutes;
