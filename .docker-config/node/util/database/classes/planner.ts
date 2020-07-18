import { Client } from '../client';
import { TutorialSection } from './tutorialSection';
import { TutorialProgressManager } from './tutorialProgressManager';

export default class Planner {

    /** Creates the planner entry for the user */
    public static async createPlanner(userId: number) {

        const query = `
            INSERT into planner ("userId")
            VALUES ($1)
        `;
        const values = [userId];

        await Client.executeQuery(query, values);
    }

    /** Retrieve all tutorials belonging to this user */
    public static async retrieveTutorials(userId: number) {

        const query = `
        SELECT t."title", t."description2", t."featuredImage", t."slug"
        FROM tutorials t
        WHERE t."id" IN 
            (SELECT "tutorialId" 
             FROM planner_detail
             WHERE planner_detail."plannerId" = (
                 SELECT "id"
                 FROM planner
                 WHERE planner."userId" = ($1)
             )
            )
        `;
        const values = [userId];

        const rows = (await Client.executeQuery(query, values)).rows;
        return rows;
    }

    /** Get the id of the planner belonging to the user */
    public static async getPlannerId(userId: number): Promise<number> {

        const query = `
            SELECT "id"
            FROM planner 
            WHERE "userId" = $1
        `;
        const values = [userId];

        const { id } = (await Client.executeQuery(query, values)).rows.shift();
        return id;
    }

    /** Register this tutorial into the user's planner and initializes the sections for progress tracking */
    public static async registerTutorial(tutorialId: number, plannerId: number, userId: number): Promise<void> {

        // Add this tutorial to the planner
        await this.insertTutorial(tutorialId, plannerId);
    }

    /** Unregisters this tutorial from a user's planner */
    public static async unregisterTutorial(tutorialId: number, plannerId: number, userId: number): Promise<void> {

        // Remove this tutorial from the planner
        await this.deleteTutorial(tutorialId, plannerId);

        // Unregister all of its sections from  the tutorial section progress table
        const sectionIds = await TutorialSection.retrieveSectionIds(tutorialId);
        const unregistrations = sectionIds.map((sectionId) => TutorialProgressManager.unregisterSection(sectionId, userId));

        await Promise.all(unregistrations);
    }


    /** Checks if the provided tutorial is registered in the user's planner */
    public static async isTutorialRegistered(tutorialId: number, plannerId: number): Promise<boolean> {

        const query = `
            SELECT EXISTS (
            SELECT 1
            FROM planner_detail 
            WHERE "tutorialId" = $1 AND "plannerId" = $2
        )
        `;
        const values = [tutorialId, plannerId];

        const { exists } = (await Client.executeQuery(query, values)).rows.shift();
        return exists;
    }



    /** Inserts a tutorial id into the planner detail */
    private static async insertTutorial(tutorialId: number, plannerId: number) {

        const query = `
            INSERT INTO planner_detail 
            ("plannerId", "tutorialId")
            VALUES ($1, $2)
        `;
        const values = [plannerId, tutorialId];

        await Client.executeQuery(query, values);
    }

    /** Removes a tutorial id from the planner detail */
    private static async deleteTutorial(tutorialId: number, plannerId: number) {

        const query = `
            DELETE FROM planner_detail 
            WHERE "plannerId" = ($1) AND "tutorialId" = ($2)
        `;
        const values = [plannerId, tutorialId];

        await Client.executeQuery(query, values);
    }
}