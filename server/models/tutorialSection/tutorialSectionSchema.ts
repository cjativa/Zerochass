import Joi from 'joi';

export interface ITutorialSection {
  id?: number,
  tutorialId: number,
  title: string,
  content: string,
  isDeleted: boolean,
}

export const TutorialSectionSchema = Joi.object().keys({

  id: Joi
    .number(),

  tutorialId: Joi
    .number()
    .required()
    .error(() => 'must have the id of the associated tutorial as a number'),

  title: Joi
    .string()
    .required()
    .error(() => 'must have a title as a string'),

  content: Joi
    .string()
    .required()
    .error(() => 'must have content as a string'),

  isDeleted: Joi
    .boolean()
    .required()
    .error(() => 'isDeleted must be a boolean'),
});