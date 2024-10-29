import type { NextApiRequest, NextApiResponse } from 'next'

import { PlannerDB } from '../../../../server/dataAccess/planner/entity';
import { TutorialSectionDB } from '../../../../server/dataAccess/tutorialSection/entity';
import { TutorialProgressDB } from '../../../../server/dataAccess/tutorialProgress/entity';
import protectWithAuthentication from '../../../../server/api/middleware/protectWithAuthentcation';

const handler = async (request: NextApiRequest, response: NextApiResponse) => {


    if (request.method.toLowerCase() === 'get') {
        return EnrollmentService.retrieveTutorialEnrollment(request, response);
    }

    if (request.method.toLowerCase() === 'post') {
        return EnrollmentService.handleTutorialEnrollment(request, response);
    }
};

class EnrollmentService {

    /** Retrieves the enrollment status for the tutorial for the signed in user */
    public static async retrieveTutorialEnrollment(request: any, response: NextApiResponse) {

        // Get the section id and whether the section should be complete for this user
        const {
            query: { tutorialId: id },
            userId
        } = request;
        const tutorialId = parseInt(id as string);

        // Retrieve the planner id for this user to find out 
        // if this tutorial is register in the planner
        const plannerId = await PlannerDB.getPlannerId(userId);
        const isTutorialRegistered = await PlannerDB.isTutorialRegistered(tutorialId, plannerId);

        let sectionProgress = [];

        if (isTutorialRegistered) {

            // Retrieve the list of section ids and find the progress
            const sectionIds = await TutorialSectionDB.listTutorialSectionIds(tutorialId);
            sectionProgress = await TutorialProgressDB.retrieveSectionProgress(sectionIds, userId);
        }

        response.json({ isTutorialRegistered, sectionProgress });
    };

    /** Hnadles enrolling a user into a tutorial by registering it with the planner */
    public static async handleTutorialEnrollment(request: any, response: NextApiResponse) {
        const { tutorialId, shouldBeEnrolled } = request.body;
        const { userId } = request;

        // Get the id of the planner for this user and check if they're already enrolled
        const plannerId = await PlannerDB.getPlannerId(userId);
        const userAlreadyEnrolled = await PlannerDB.isTutorialRegistered(tutorialId, plannerId);

        // If the user should be enrolled
        if (shouldBeEnrolled == true) {

            // If they're not already enrolled, enroll them
            if (userAlreadyEnrolled == false) {
                await PlannerDB.registerTutorial(tutorialId, plannerId, userId);
            }
        }

        // Otherwise, the user should be unenrolled
        else {

            // If they're already enrolled, unenroll them
            if (userAlreadyEnrolled == true) {
                await PlannerDB.unregisterTutorial(tutorialId, plannerId, userId);
            }
        }

        // Return the final status of the tutorial being registered
        const isTutorialRegistered = await PlannerDB.isTutorialRegistered(tutorialId, plannerId);
        response.json({ isTutorialRegistered });
    };

};

export default protectWithAuthentication(handler);