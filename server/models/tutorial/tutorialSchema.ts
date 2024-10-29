import Joi from 'joi';
import { ITutorialSection } from '../tutorialSection/tutorialSectionSchema';
export interface ITutorial {
    id?: number,

    title: string,
    description1: string,
    description2: string,
    enabled: boolean,
    color: 'pink' | 'white' | 'teal' | 'black',
    featuredImage: string,
    userId: number,
    slug: string,
    codeUrl: string,
    liveUrl: string,

    tags: string[],
    sections: ITutorialSection[],
}

export const TutorialSchema = Joi.object().keys({

    id: Joi
        .number(),

    title: Joi
        .string()
        .required()
        .error(() => 'must have a name as a string'),

    description1: Joi
        .string()
        .required()
        .error(() => 'must have a short description line 1'),

    description2: Joi
        .string()
        .required()
        .error(() => 'must have a short description line 2'),

    enabled: Joi
        .boolean()
        .required()
        .error(() => 'enabled must be a boolean'),

    color: Joi
        .string()
        .valid('pink', 'white', 'teal', 'black')
        .required()
        .error(() => 'must be one of the valid values'),

    featuredImage: Joi
        .string(),

    userId: Joi
        .number()
        .error(() => 'must be a numberical id'),

    slug: Joi
        .string()
        .required()
        .error(() => 'must be a string'),

    codeUrl: Joi
        .string(),

    liveUrl: Joi
        .string()
});