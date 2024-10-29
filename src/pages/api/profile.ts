import protectWithAuthentication from '../../../server/api/middleware/protectWithAuthentcation';
import { UserDB } from '../../../server/dataAccess/user/entity';

const handler = async (request, response) => {

    const { userId } = request;

    if (request.method === 'GET') {
        const profile = await UserDB.findUser('id', userId);
        response.json(profile);
    }

    if (request.method === 'POST') {
        const { body } = request;
        const profile = await UserDB.updateUserInformation(body);
        response.json(profile);
    }


};

export default protectWithAuthentication(handler);