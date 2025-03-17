import { t } from 'elysia';
import { ResponseBaseModel } from '@helpers/models';
import { UserSchema } from '@/schemas/users.schema';

const ResponseMeModel = ResponseBaseModel.extend({
	data: UserSchema,
});

type ResponseRegister = typeof ResponseMeModel.static;

export { ResponseMeModel };
export type { ResponseRegister };
