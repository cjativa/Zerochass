import type { NextApiRequest, NextApiResponse } from 'next';
import { nanoid } from 'nanoid'

import Slugify from '../../constants/slugify';
import protectWithAuthentication from '../../../server/api/middleware/protectWithAuthentcation';
import { TutorialDB } from '../../../server/dataAccess/tutorials/entity';
import { TutorialRequest } from '../../../server/api/interfaces/tutorial';
import Config from '../../../server/utils/config';
import S3 from '../../../server/services/awsService';

const handler = async (request: NextApiRequest, response: NextApiResponse) => {

    const method = request.method.toLowerCase();

    if (method === 'get') {
        return WriteService.retrieveTutorial(request, response);
    }

    if (method === 'post') {
        return WriteService.createTutorial(request, response);
    }

    if (method === 'put') {
        return WriteService.updateTutorial(request, response);
    }

    if (method === 'delete') {
        return WriteService.deleteTutorial(request, response);
    }
};

class WriteService {

    /** Handles retrieving a tutorial for editing */
    public static async retrieveTutorial(request: any, response: NextApiResponse) {
        const { id } = request.query
        const { userId } = request;

        // If there's an id, then we fetch a single tutorial
        if (id) {
            const tutorial = await TutorialDB.getTutorialForEditing(userId, id);
            response
                .status(200)
                .json({
                    ...tutorial,
                });
        }

        // Otherwise, it's a request to fetch all editable tutorials
        else {
            const tutorials = await TutorialDB.getTutorialForEditing(userId);
            response
                .status(200)
                .json([
                    ...tutorials
                ]);
        }
    };


    /** Handles creating a new tutorial in the databse */
    public static async createTutorial(request: any, response: NextApiResponse) {

        // Get the tutorial to write and the user id for it
        const tutorialRequest = request.body as TutorialRequest;
        const { userId } = request;

        const preparedTutorial = await WriteService.prepareTutorial(tutorialRequest);
        preparedTutorial['slug'] = `${Slugify(preparedTutorial.title)}--${nanoid(5)}`
        const tutorial = await TutorialDB.addTutorial(preparedTutorial, userId);

        response.json(tutorial.id);
    };

    /** Handles updating an existing tutorial in the database */
    public static async updateTutorial(request: any, response: NextApiResponse) {

        // Get the tutorial to write
        const tutorialRequest = request.body as TutorialRequest;
        const { userId } = request;

        const preparedTutorial = await WriteService.prepareTutorial(tutorialRequest);
        const updatedTutorial = await TutorialDB.updateTutorial(preparedTutorial, userId);

        response.json({ ...updatedTutorial });
    };

    public static async deleteTutorial(request: any, response: NextApiResponse) {

        // Get id of tutorial to delete
        const { id } = request.body;
        const { userId } = request;

        try {
            await TutorialDB.deleteTutorial(id, userId);
            response
                .status(200)
                .json(`Tutorial with ID ${id} deleted`);
        }

        // Handle errors with deleting
        catch (error) {
            console.log(`An error occurred deleting tutorial with ID ${id}`, error);
            response
                .status(400)
                .json(`Unable to delete tutorial`);
        }
    };

    /** Uploads a featured image for the tutorial */
    private static uploadFeaturedImage = async (featuredImageDataUrl: string): Promise<string> => {

        const dataUrl = featuredImageDataUrl;
        const base64 = Buffer.from(dataUrl.replace(/^data:image\/\w+;base64,/, ""), 'base64');

        const params = {
            Bucket: `${Config.awsBucket}/featured-images`,
            Key: `${nanoid()}.png`,
            Body: base64,
            ACL: 'public-read',
            ContentEncoding: 'base64',
            ContentType: 'image/png'
        };

        // Get the url for the uploaded image and store it in the tutorial
        const { Location } = await S3.upload(params);
        return Location;
    };

    /** Prepares a tutorial by creating the payload that can be inserted into the database */
    private static async prepareTutorial(tutorialRequest: TutorialRequest): Promise<any> {

        // These fields require some transformation prior to being ready to be part of a tutorial
        const tutorial = {
            ...tutorialRequest,
            featuredImage: '',
            tags: tutorialRequest.tags.map((tag) => tag.toLowerCase())
        };

        // If we have a featured image, we need to upload it to S3 and get the upload
        // URL prior to inserting the URL to our database
        if (typeof tutorialRequest.featuredImage === 'object') {
            tutorial.featuredImage = await WriteService.uploadFeaturedImage(tutorialRequest.featuredImage.dataUrl);
        }

        // Otherwise, if a string, let it remain
        else { tutorial.featuredImage = tutorialRequest.featuredImage; }

        return tutorial;
    };
}

export default protectWithAuthentication(handler);