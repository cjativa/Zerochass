import Joi from 'joi';

export const validator = (schema: Joi.ObjectSchema<any>) =>
    (payload) => {
        let { error } = schema.validate(payload, { abortEarly: false })
        if (error) {
            let message = error.details.map(el => el.message).join('\n')
            return {
                error: message
            }
        }
        return true
    };