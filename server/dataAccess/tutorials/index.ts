import { Knex } from '../../database/knex';
import { ITutorial } from '../../models/tutorial/tutorialSchema';

import { TagDB } from '../tag/entity';
import { TutorialSectionDB } from '../tutorialSection/entity';

export class TutorialDAO {

    public static async listTutorials(): Promise<ITutorial[]> {
        return await Knex
            .select('*')
            .from('tutorials')
            .where('enabled', true);
    };

    public static async findTutorial(prop: string, val: number | string): Promise<ITutorial> {
        const tutorials = await Knex
            .select('*')
            .from('tutorials')
            .where(prop, val);

        return tutorials.shift();
    };

    public static async addTutorial(props: ITutorial, userId: string): Promise<any> {
        const addedTutorials = await Knex('tutorials')
            .insert({
                title: props.title,
                color: props.color,
                description1: props.description1,
                description2: props.description2,
                enabled: props.enabled,
                featuredImage: props.featuredImage,
                codeUrl: props.codeUrl,
                liveUrl: props.liveUrl,
                slug: props.slug,
                userId: userId,
            })
            .returning('*');
        const addedTutorial = addedTutorials.shift();

        // If there's tags to associate
        if (props.tags.length > 0) {
            await TagDB.relateWithTutorial(props.tags, addedTutorial.id);
        }

        // If there's sections to write
        if (props.sections.length > 0) {
            await TutorialSectionDB.addOrUpdateTutorialSection(props.sections, addedTutorial.id);
        }

        return addedTutorial;
    };

    public static async updateTutorial(props: ITutorial, userId: string) {

        // Update the main tutorial information
        const updatedTutorial = await Knex('tutorials')
            .where({ 'id': props.id, 'userId': userId })
            .update({
                title: props.title,
                color: props.color,
                description1: props.description1,
                description2: props.description2,
                enabled: props.enabled,
                featuredImage: props.featuredImage,
                codeUrl: props.codeUrl,
                liveUrl: props.liveUrl,
                slug: props.slug,
                userId: userId,
            })
            .returning('*');

        // If there's tags to associate
        await TagDB.relateWithTutorial(props.tags, props.id);

        // If there's sections to add, update, or delete
        await TutorialSectionDB.addOrUpdateTutorialSection(props.sections, props.id);

        return updatedTutorial.shift();
    };

    /** Deletes tutorial with the given tutorial id belonging to the specified user id */
    public static async deleteTutorial(tutorialId: string | number, userId: string | number): Promise < any > {

    // Delete this tutorial from any user planner
    await Knex('planner_detail')
        .delete()
        .where({ tutorialId });

    // Delete section progress for any section belonging to this tutorial
    await Knex.raw(`
        DELETE
        FROM
            tutorial_sections_progress
        WHERE
            "sectionId" in (
                SELECT id
                FROM
                    tutorial_sections
                WHERE
                    "tutorialId" = '${tutorialId}'
            )
        `);

    // Delete sections belonging to this tutorial
    await Knex('tutorial_sections')
        .delete()
        .where({ tutorialId });

    // Delete tags associated to this tutorial
    await Knex('tutorial_tag_relations')
        .delete()
        .where({ tutorialId });

    // Delete this tutorial
    const response = await Knex('tutorials')
        .where('id', tutorialId)
        .del();

    if(response == 1) {
        return {
            id: tutorialId,
        };
    }

        // Otherwise, unable to delete tutorial so raise error
        throw Error(`Unable to delete tutorial with ID ${tutorialId}`);
};

/** Returns the tags associated with a specific tutorial */
public static async getTags(tutorialId: string | number) {
    const tags = await Knex.raw(`
            SELECT id, tag
            FROM tags
            INNER JOIN tutorial_tag_relations
            ON tags.id = tutorial_tag_relations."tagId"
            WHERE tutorial_tag_relations."tutorialId" = ${tutorialId}
            `
    );

    return tags.rows;
};

public static async getTutorialForEditing(userId: number, tutorialId ?: number) {

    // This means only retrieve the requested tutorial
    // as the user is trying to edit it
    if (tutorialId) {
        const editableTutorial = await Knex('tutorials')
            .select(
                'title',
                'description1',
                'description2',
                'enabled',
                'color',
                'featuredImage',
                'liveUrl',
                'codeUrl',
                'id',
                'slug')
            .where({
                id: tutorialId,
                userId: userId
            });

        return editableTutorial;
    }

    // Otherwise, all editable tutorials need to be shown, for the list page
    const editableTutorials = await Knex('tutorials')
        .select('title', 'description1', 'description2', 'enabled', 'color', 'featuredImage', 'id', 'slug')
        .where({
            userId: userId
        });

    // Set up promises for fetching the tags
    const tagPromises = editableTutorials.map((tutorial) => TutorialDAO.getTags(tutorial.id));
    const tagResults = await Promise.all(tagPromises);

    // Set the tags into each
    editableTutorials.forEach((editableTutorial, index) => {
        editableTutorial['tags'] = tagResults[index];
    });

    return editableTutorials;
};

    public static async getSiteTutorials() {
    const siteTutorials = await Knex.raw(
        `
            SELECT 
        t."title", 
        t."description1",   
        t."description2", 
        t."color", 
        t."featuredImage", 
        t."id", 
        t."slug",
        u."profileImage", 
        u."name",
        uai."username"
        FROM tutorials t
        INNER JOIN user_information u 
        ON u."id" = t."userId"
        INNER JOIN user_account_information uai
        on uai."userId" = t."userId"
        WHERE t."enabled" = true
        `
    );

    return siteTutorials.rows;
};
};