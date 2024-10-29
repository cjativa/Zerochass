import { Knex } from '../../database/knex';
import { IUser, SignUpInformation, UserProfileInformation } from '../../models/user/userSchema';
import { TutorialSectionDAO } from '../tutorialSection';
import { TutorialProgressDAO } from '../tutorialProgress'

export class PlannerDAO {

  /** Creates the planner entry for the user */
  public static async createPlanner(userId: number): Promise<IUser> {
    const planner = await Knex('planner')
      .insert({
        userId: userId
      })
      .returning('*');

    return planner.shift();
  };

  /** Retrieve all tutorials belonging to this user */
  public static async retrieveTutorials(userId: number) {
    const tutorialsInPlanner = await Knex.raw(
      `
        SELECT 
        -- top level fields
        t."title", 
        t."description2", 
        t."featuredImage", 
        t."slug", 
        COUNT(ts."tutorialId") as "totalSectionCount",

        (
            SELECT COUNT(tsp."sectionId") 
            FROM tutorial_sections_progress tsp 
            WHERE tsp."sectionId" in 
            (
                SELECT "id"
                FROM tutorial_sections ts
                WHERE 
                    ts."tutorialId" = t."id"
                    AND 
                    tsp."isComplete" = true
                    AND
                    "userId" = ${userId}
            )
        ) AS "completedSectionCount"

        -- get the tutorial ids belonging to the user's planner
        FROM tutorials t
        INNER JOIN tutorial_sections ts
        ON t."id" = ts."tutorialId"
        WHERE t."id" IN 
        (
            SELECT "tutorialId" 
            FROM planner_detail
            WHERE planner_detail."plannerId" = 
            (
                SELECT "id"
                FROM planner p
                WHERE p."userId" = ${userId}
            )
        )

        GROUP BY
            t."title", 
            t."description2", 
            t."featuredImage", 
            t."slug", 
            "completedSectionCount"     
    `,
    )

    return tutorialsInPlanner.rows;
  };

  /** Get the id of the planner belonging to the user */
  public static async getPlannerId(userId: number): Promise<number> {
    const plannerIdRes = await Knex('planner')
      .select('id')
      .from('planner')
      .where('userId', userId);

    const { id } = plannerIdRes.shift();
    return id;
  };

  /** Register this tutorial into the user's planner */
  public static async registerTutorial(tutorialId: number, plannerId: number, userId: number): Promise<void> {
    const registeredTutorial = await Knex('planner_detail')
      .insert({
        plannerId: plannerId,
        tutorialId: tutorialId,
      })
      .returning('*');

    return registeredTutorial.shift();
  };

  /** Unregisters this tutorial from a user's planner */
  public static async unregisterTutorial(tutorialId: number, plannerId: number, userId: number) {

    // Remove this tutorial from the planner
    await Knex('planner_detail')
      .where({
        tutorialId,
        plannerId
      })
      .delete();

    // Unregister all of its sections from  the tutorial section progress table
    const sectionIds = await TutorialSectionDAO.listTutorialSectionIds(tutorialId);
    const unregistrations = sectionIds.map((sectionId) =>
      TutorialProgressDAO.unregisterSection(sectionId, userId));

    await Promise.all(unregistrations);
  };


  /** Check if the tutorial (by id) is already registered in the planner */
  public static async isTutorialRegistered(tutorialId: number, plannerId: number): Promise<boolean> {
    const isTutorialAlreadyRegisteredRes = await Knex('planner_detail')
      .select('*')
      .where('tutorialId', tutorialId)
      .andWhere('plannerId', plannerId);

    const isTutorialAlreadyRegistered = (isTutorialAlreadyRegisteredRes.length > 0)
      ? true
      : false
      ;

    return isTutorialAlreadyRegistered;
  };

  /** Returns the number of planners that have registered this tutorial */
  public static async getRegisteredCount(tutorialId: number): Promise<number> {
    const totalRegisteredCountRes = await Knex('planner_detail')
      .count('plannerId')
      .where('tutorialId', tutorialId)

    const count = parseInt(totalRegisteredCountRes.shift().count.toString());

    return count;
  };
};