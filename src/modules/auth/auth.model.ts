import { t } from 'elysia';
import { ResponseBaseModel } from '@helpers/models';
import { UserSchema } from '@/schemas/users.schema';

const ResponseRegisterModel = ResponseBaseModel.extend({
	data: UserSchema,
});
const ResponseLoginModel = ResponseBaseModel.extend({
	data: t.Object({
		token: t.String(),
		exp: t.Union([t.String(), t.Number()]),
	}),
});

type ResponseLogin = typeof ResponseLoginModel.static;
type ResponseRegister = typeof ResponseRegisterModel.static;

export { ResponseLoginModel, ResponseRegisterModel };
export type { ResponseLogin, ResponseRegister };
