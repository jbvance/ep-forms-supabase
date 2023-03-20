import { S3Client } from '@aws-sdk/client-s3';
import { S3, ListObjectsCommand } from '@aws-sdk/client-s3';
// Set the AWS Region.
const REGION = 'us-east-2'; //e.g. "us-east-1"
// Create an Amazon S3 service client object.
const s3Client = new S3Client({ region: REGION });
const aggregatedS3 = new S3({ region: REGION });
export { s3Client, aggregatedS3 };
