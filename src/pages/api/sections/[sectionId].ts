import type { NextApiRequest, NextApiResponse } from 'next'

import { TutorialProgressDB } from '../../../../server/dataAccess/tutorialProgress/entity';
import protectWithAuthentication from '../../../../server/api/middleware/protectWithAuthentcation';

const handler = async (request: NextApiRequest, response: NextApiResponse) => {

    if (request.method.toLowerCase() === 'post') {
        return await SectionService.handleUpdateSectionProgress(request, response);
    }

};

class SectionService {

    /** Handles marking a section as complete */
    public static async handleUpdateSectionProgress(request: any, response: NextApiResponse) {

        // Get the section id and whether the section should be complete for this user
        let sectionId = parseInt(request.query.sectionId);
        let complete = request.body.complete as boolean;
        const { userId } = request;

        // The section should be marked as complete
        const sectionProgress = (complete)
            ? await TutorialProgressDB.setSectionComplete(userId, sectionId)
            : await TutorialProgressDB.setSectionIncomplete(sectionId, userId)
            ;

        response.json(sectionProgress);
    };
};

export default protectWithAuthentication(handler);