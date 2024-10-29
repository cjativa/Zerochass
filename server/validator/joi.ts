import Joi from 'joi';
import { TutorialSchema } from '../models/tutorial/tutorialSchema';

let JoiValidator = (payload, schema: Joi.ObjectSchema<any>) => {
    let { error } = schema.validate(payload, { abortEarly: false })
    if (error) {
        let message = error.details.map(el => el.message).join('\n')
        return {
            error: message
        }
    }
    return true
}

let validator = {
    tutorialValidator: (payload) => JoiValidator(payload, TutorialSchema)
}

module.exports = validator