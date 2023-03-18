import {
  CreateBucketCommand,
  HeadObjectCommand,
  HeadBucketCommand,
  ListObjectsCommand,
} from '@aws-sdk/client-s3';
import { s3Client as s3 } from './S3Client';

export const createBucket = async (BUCKET_NAME) => {
  const bucketParams = { Bucket: BUCKET_NAME };
  try {
    const data = await s3.send(new CreateBucketCommand(bucketParams));
    console.log('Success', data.Location);
    return data;
  } catch (err) {
    console.log('Error', err);
  }
};

export const checkBucketExists = async (BUCKET_NAME) => {
  let statusCode = 500; //default to server error
  const input = {
    Bucket: BUCKET_NAME,
  };
  let response = {};
  const command = new HeadBucketCommand(input);
  try {
    response = await s3.send(command);
    console.log('CHECK BUCKET RESPONSE', response);
    statusCode = response['$metadata']['httpStatusCode'];
  } catch (err) {
    console.log(err);
    statusCode = err['$metadata']['httpStatusCode'];
    //return response;
  } finally {
    return statusCode;
  }
};

export const checkUserS3FolderExists = async (FOLDER_NAME) => {
  var params = {
    Bucket: process.env.S3_BUCKET,
    Delimiter: '/',
    Prefix: `${FOLDER_NAME}/`,
  };
  const command = new ListObjectsCommand(params);
  try {
    const data = await s3.send(command);
    //console.log(data.Contents);
    // If no folder is found, Contents will be undefined
    return data.Contents;
  } catch (err) {
    console.log('ERROR IN checkSubFolderExists', err);
    return null;
  }
};
