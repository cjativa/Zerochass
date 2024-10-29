import { TagDB } from '../../../server/dataAccess/tag/entity';

const handler = async (request, response) => {

    const { tag } = request.query;
    const matchingTags = await TagDB.findTag('tag', tag);

    response.json(matchingTags);
};

export default handler