import { Knex } from '../../database/knex';
import { makeTutorialSection } from '../../models/tutorialSection/index';
import { ITutorialSection } from '../../models/tutorialSection/tutorialSectionSchema';

export class TutorialSectionDAO {

    private static async getSeparateSections(tutorialSections: ITutorialSection[], tutorialId: number | string) {

        const sectionsToAdd: ITutorialSection[] = [];
        const sectionsToUpdate: ITutorialSection[] = [];
        const sectionsToDelete: number[] = [];

        // Compare the incoming tutorial sections with what's on file for this tutorial
        const existingSectionIds = await TutorialSectionDAO.listTutorialSectionIds(tutorialId);
        const providedSectionIds = tutorialSections
            .filter((section) => section.hasOwnProperty('id'))
            .map((section) => section.id);

        // The section id's to delete are the ones that exist in the database
        // but are no longer being provided in the request - i.e. these need to be removed
        const sectionIdsToDelete = existingSectionIds
            .filter((existingSectionId) => !providedSectionIds.includes(parseInt(existingSectionId.toString())));

        sectionsToDelete.push(...sectionIdsToDelete);

        tutorialSections.forEach((tutorialSection) => {

            // If there's an id then the section needs to be updated
            if (tutorialSection.hasOwnProperty('id')) {
                sectionsToUpdate.push(tutorialSection)
            }

            // Otherwise, no id means it needs to be added
            else {
                sectionsToAdd.push(tutorialSection);
            }
        });

        return {
            sectionsToAdd,
            sectionsToUpdate,
            sectionsToDelete,
        };
    };

    /** something */
    public static async listTutorialSections(tutorialId: number): Promise<ITutorialSection[]> {
        return await Knex
            .select('*')
            .from('tutorial_sections')
            .where('tutorialId', tutorialId)
            .orderBy('id', 'asc');
    };

    public static async addOrUpdateTutorialSection(tutorialSections: ITutorialSection[], tutorialId: string | number): Promise<ITutorialSection[]> {
        const { sectionsToAdd, sectionsToUpdate, sectionsToDelete } = await TutorialSectionDAO.getSeparateSections(tutorialSections, tutorialId);
        let addedSections: ITutorialSection[] = [];
        let updatedSections: ITutorialSection[] = [];

        const sectionsWithId = sectionsToAdd.map((section) => {
            return {
                ...section,
                tutorialId,
            };
        });

        if (sectionsToAdd.length > 0) {
            const addedSections = await Knex('tutorial_sections')
                .insert(sectionsWithId)
                .returning('*');
            addedSections.push(...addedSections);
        }

        if (sectionsToUpdate.length > 0) {
            for (let i = 0; i < sectionsToUpdate.length; i++) {
                const section = sectionsToUpdate[i];
                const updatedSection = await Knex('tutorial_sections')
                    .update(section)
                    .where({ 'id': section.id, 'tutorialId': tutorialId })
                    .returning('*');
                updatedSections.push(...updatedSection);
            }
        }

        if (sectionsToDelete.length > 0) {
            await TutorialSectionDAO.deleteSections(tutorialId, sectionsToDelete);
        }

        return [...addedSections, ...updatedSections];
    };

    public static async deleteTutorialSection(id: string | number): Promise<any> {
        const response = await Knex('tutorial_sections')
            .where('id', id)
            .del();

        if (response == 1) {
            return true;
        }

        return false;
    };

    public static async listTutorialSectionIds(tutorialId: number | string): Promise<number[]> {
        const sectionIdsRes = await Knex
            .select('id')
            .from('tutorial_sections')
            .where('tutorialId', tutorialId);

        const sectionIds = sectionIdsRes.map((el) => el.id);
        return sectionIds;
    };

    public static async deleteSections(tutorialId: number | string, sectionIds: string[] | number[]) {

        // Delete these sections from the tutorial progress table
        await Knex('tutorial_sections_progress')
            .delete()
            .whereIn('sectionId', sectionIds);

        // Delete the tutorial sections
        await Knex('tutorial_sections')
            .delete()
            .whereIn('id', sectionIds)
            .andWhere({ tutorialId });
    };
};

/**
 *
 *
 *
  /** Adds or updates the sections for a tutorial */
/*
public static async addSections(tutorialId: number, tutorialSections: TutorialInterface['sections']) {

  const sectionRequests = tutorialSections.map((section) => {
      let query, values;
      const { title, content, id } = section;

      // If the section has an id, then it needs to be updated
      if (id) {
          query = `
          UPDATE tutorial_sections
          SET
              "title" = ($1),
              "content" = ($2)
          WHERE "id" = ($3) AND "tutorialId" = ($4)
          `;
          values = [title, content, id, tutorialId];
      }

      // Otherwise, no existing id means it's an insert
      else {
          query = `
          INSERT INTO tutorial_sections ("title", "content", "tutorialId")
          VALUES ($1, $2, $3)
          `;
          values = [title, content, tutorialId];
      }

      return Client.executeQuery(query, values);
  });

  await Promise.all(sectionRequests);
};

/** Deletes any sections that from the tutorial that exist in the database but were not sent along with an update */
/*
 */