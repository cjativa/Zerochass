import AWS from 'aws-sdk';
import Config from '../utils/config';

// Set the region 
AWS.config.update({ region: Config.awsRegion });

export default class S3 {

    private static s3 = new AWS.S3({ apiVersion: '2006-03-01' });

    /** Uploads a file to the specified bucket */
    public static async upload(uploadParams: AWS.S3.PutObjectRequest) {
        const response = await this.s3.upload(uploadParams).promise();
        return response;
    };
}