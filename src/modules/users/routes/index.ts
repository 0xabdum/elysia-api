import { globalError, serverError, validationError } from '@/helpers/errors';
import {
	HeaderAuthorizationModel,
	ResponseBaseModel,
	ResponseErrorModel,
	type ResponseError,
	type ValidationType,
} from '@/helpers/models';
import Elysia from 'elysia';
import me from './me';

const usersRoutes = new Elysia({ prefix: '/users' })
	.guard({
		response: {
			401: ResponseErrorModel,
			200: ResponseBaseModel,
		},
		headers: HeaderAuthorizationModel,
	})
	.use(me);

usersRoutes.onError(({ error, code, ...ctx }): ResponseError => {
	if ('error' in error && 'code' in error) {
		const responseValidationError = validationError(
			error as ValidationType,
			ctx,
		);
		if (responseValidationError) return responseValidationError;
	}

	if (error instanceof Error) {
		const responseServerError = serverError(error, ctx);
		if (responseServerError) return responseServerError;
	}

	if (error instanceof Error) {
		const responseGlobalError = globalError(error, ctx);
		if (responseGlobalError) return responseGlobalError;
	}

	return {
		statusCode: 'statusCode' in error ? Number(error.statusCode) : 500,
		success: false,
		message: 'message' in error ? error.message : 'Internal Server Error',
		error: {},
	};
});

export default usersRoutes;
