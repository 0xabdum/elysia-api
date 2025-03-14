import { t } from 'elysia';

const ResponseBaseModel = t.Object({
	statusCode: t.Number(),
	success: t.Boolean(),
	message: t.String(),
});

const ResponseSuccessModel = t.Intersect([
	ResponseBaseModel,
	t.Object({
		success: t.Literal(true),
		data: t.Optional(t.Any()),
	}),
]);

const ResponseErrorModel = t.Intersect([
	ResponseBaseModel,
	t.Object({
		success: t.Literal(false),
		error: t.Optional(t.Any()),
	}),
]);

const ZodIssueSchemaModel = t.Object({
	path: t.Array(t.String()),
	message: t.String(),
	code: t.String(),
});

const ValidationModel = t.Object({
	code: t.String(),
	error: t.Array(ZodIssueSchemaModel),
	message: t.Optional(t.String()),
});

type ResponseBase = typeof ResponseBaseModel.static;
type ResponseSuccess = typeof ResponseSuccessModel.static;
type ResponseError = typeof ResponseErrorModel.static;
type ValidationType = typeof ValidationModel.static;
type ZodIssueSchema = typeof ZodIssueSchemaModel.static;

export {
	ResponseBaseModel,
	ResponseSuccessModel,
	ResponseErrorModel,
	ValidationModel,
};
export type {
	ResponseBase,
	ResponseSuccess,
	ResponseError,
	ValidationType,
	ZodIssueSchema,
};
