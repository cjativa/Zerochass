import { ITag } from './tagSchema';

export const buildMakeTag = function (tagValidator) {
    return (tag: ITag) => {

        const { error } = tagValidator(tag)
        if (error) throw new Error(error)

        return tag; 
    }
};