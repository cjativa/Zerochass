import Joi from 'joi';

export interface ITag {
    id?: number,
    tag: string
}

export const TagSchema = Joi.object().keys({

    id: Joi
        .number(),

    tag: Joi
        .string()
        .required()
        .error(() => 'must have a tag name as a string')
});