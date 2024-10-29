import type { NextApiRequest, NextApiResponse } from 'next';
import { nanoid } from 'nanoid'

import Config from '../../../server/utils/config';
import S3 from '../../../server/services/awsService';


import protectWithAuthentication from '../../../server/api/middleware/protectWithAuthentcation';

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
    const method = request.method.toLowerCase();

    if (method === 'post') {
        return AssetUploadService.uploadAsset(request, response);
    }
};

class AssetUploadService {

    public static async uploadAsset(request: NextApiRequest, response: NextApiResponse) {
        const { dataUrl } = request.body;
        const uploadableBase64 = Buffer.from(dataUrl.replace(/^data:image\/\w+;base64,/, ""), 'base64');

        // Get the url for the uploaded image and store it in the tutorial
        const uploadResponse = await S3.upload({
            Bucket: `${Config.awsBucket}/images`,
            Key: `${nanoid()}.png`,
            Body: uploadableBase64,
            ACL: 'public-read',
            ContentEncoding: 'base64',
            ContentType: 'image/png'
        });

        return response
            .status(200)
            .json(uploadResponse.Location);
    };
};

export default protectWithAuthentication(handler);