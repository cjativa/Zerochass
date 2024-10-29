
import { NextApiResponse, NextApiRequest } from 'next'
/* import { Tutorial } from '../../../components/tutorial/tutorial'
import TutorialDatabaseHandler from '../../../../server/api/database/classes/tutorial/tutorial'; */
import { response } from 'express';

const handlers = {

    /** Handles retrieving information for a tutorial */
    async get(req: NextApiRequest, res: NextApiResponse) {

        /* const slug = req.query.slug as string;
        const tutorial = await TutorialDatabaseHandler.retrieveTutorial(slug);
        response.json(tutorial); */
    }
}

export default (req: NextApiRequest, res: NextApiResponse) => {
    const handlerExecute = handlers[req.method.toLowerCase()]
    return handlerExecute(req, res)
}