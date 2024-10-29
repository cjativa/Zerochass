import { Knex } from '../../database/knex';
import { PlannerDB } from '../../dataAccess/planner/entity';

export class TutorialProgressDAO {

  /** Registers the section this tutorial belongs to the user's Planner 
    * and marks this particular section as complete */
  public static async setSectionComplete(userId: number, sectionId: number) {

    // Get the id of the tutorial this section belongs to
    const tutorialIdRes = await Knex('tutorial_sections')
      .select('tutorialId')
      .where({ id: sectionId });

    const {tutorialId} = tutorialIdRes.shift();

    // Check if the tutorial is already in the user's planner
    const plannerId = await PlannerDB.getPlannerId(userId);
    const isTutorialRegistered = await PlannerDB.isTutorialRegistered(tutorialId, plannerId);

    // If the tutorial is not registered, register it
    if (isTutorialRegistered === false) {
      await PlannerDB.registerTutorial(tutorialId, plannerId, userId);
    }

    // Mark the section as complete
    const sectionProgress = await Knex.raw(`
      INSERT INTO tutorial_sections_progress
          ("sectionId", "userId", "isComplete")
          VALUES (${sectionId}, ${userId}, true)

          ON CONFLICT ("sectionId", "userId") 
          DO UPDATE
              SET 
              "isComplete" = true
              WHERE EXCLUDED."sectionId" = ${sectionId} AND EXCLUDED."userId" = ${userId}

          RETURNING "isComplete", "sectionId"
    `);

    return sectionProgress.rows.shift();
  };

  /** Marks this particular section as incomplete */
  public static async setSectionIncomplete(sectionId: number, userId: number) {

    const sectionProgress = await Knex.raw(`
      INSERT INTO tutorial_sections_progress
      ("sectionId", "userId", "isComplete")
      VALUES (${sectionId}, ${userId}, false)

      ON CONFLICT ("sectionId", "userId") 
      DO UPDATE
          SET 
          "isComplete" = false
          WHERE EXCLUDED."sectionId" = ${sectionId} AND EXCLUDED."userId" = ${userId}

      RETURNING "isComplete", "sectionId"
      `);

    return sectionProgress;
  };

  /** Unregisters section from progress tracking */
  public static async unregisterSection(sectionId: number, userId: number): Promise<void> {

    await Knex('tutorial_sections_progress')
      .where({ sectionId, userId })
      .delete();
  };

  /** Retrieves the progress of these section ids */
  public static async retrieveSectionProgress(sectionIds: number[], userId: number): Promise<{ sectionId: number, userId: number, isComplete: boolean }[]> {

    const sectionsProgressRes = await Knex('tutorial_sections_progress')
      .select('sectionId', 'userId', 'isComplete')
      .whereIn('sectionId', sectionIds)
      .andWhere({ userId });

    return sectionsProgressRes;
  };
};