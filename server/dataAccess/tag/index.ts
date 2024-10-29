import { Knex } from '../../database/knex';
import { makeTag } from '../../models/tag/index';
import { ITag } from '../../models/tag/tagSchema';

export class TagDAO {

    public static async listTags(): Promise<ITag[]> {
        return await Knex
            .select('*')
            .from('tags')
    };

    public static async findTag(prop, value): Promise<ITag[]> {
        return await Knex
            .select('*')
            .from('tags')
            .where(prop, value);
    };

    public static async relateWithTutorial(tags: string[], tutorialId: string | number) {

        // Add any tags that don't exist in the schema
        const insertableTags = tags.map((tag) => {
            return { tag };
        });
        await Knex('tags')
            .insert(insertableTags)
            .onConflict('tag')
            .ignore();

        // Remove any tags that should no longer be associated with the tutorial
        await TagDAO.validateWithTutorial(tags, tutorialId);

        // Get the ids for these tags
        const tagIds = await Knex('tags')
            .select('id')
            .whereIn('tag', tags);

        // Turn them into the tag/tutorial id pairs
        const tutorialTagPairs = tagIds.map((tagId) => {
            return {
                tagId: tagId.id,
                tutorialId,
            }
        });

        await Knex('tutorial_tag_relations')
            .insert(tutorialTagPairs)
            .onConflict(['tagId', 'tutorialId'])
            .ignore();
    };

    private static async validateWithTutorial(tags: string[], tutorialId: string | number) {

        // Find out which tags are associated with this tutorial right now
        const tagsInDatabase = (await Knex.raw(`
        SELECT tags.tag, tags.id
        FROM tags
        INNER JOIN tutorial_tag_relations ttr
        ON 
            ttr."tagId" = tags.id
        WHERE 
            ttr."tutorialId" = ${tutorialId};
        `)).rows;

        // Any not provided, or any provided that aren't what the database has on record
        // means we need to remove from the database
        const tagIdsToRemove = tagsInDatabase.reduce((acc, tagItem) => {
            const tagShouldBeRemoved = !tags.find((tag) => tag.toLowerCase() === tagItem.tag.toLowerCase());
            if (tagShouldBeRemoved && tagItem.hasOwnProperty('id')) {
                acc.push(tagItem.id);
            }

            return acc;
        }, [] as number[]);

        if (tagIdsToRemove.length > 0) {
            await Knex('tutorial_tag_relations')
                .delete()
                .whereIn('tagId', tagIdsToRemove)
                .andWhere({ tutorialId })
        }
    };
};