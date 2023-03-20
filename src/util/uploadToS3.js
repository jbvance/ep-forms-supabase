import { PutObjectCommand, CreateBucketCommand } from '@aws-sdk/client-s3';
import { s3Client as s3 } from './S3Client';

const fs = require('fs');

// The AWS config vars must be set up to use this module.
// They are saved in environment variables as follows:
// AWS_ACCESS_KEY_ID=<value>
// AWS_SECRET_ACCESS_KEY=<value>

const upload = async (params, data) => {
  try {
    await s3.send(new PutObjectCommand(params));
  } catch (err) {
    throw new Error('Error uploading file to Bucket', err);
  }
  // s3.putObject(params, (err, data) => {
  //   if (err) {
  //     console.error(err);
  //     throw err;
  //   } else {
  //     console.log('Succesfully uploaded data to bucket');
  //   }
  // });
};

module.exports = {
  // return a list of all the files in a bucket
  listFiles: () => {
    // Create the parameters for calling createBucket
    var bucketParams = {
      Bucket: process.env.S3_BUCKET,
    };

    // Call S3

    s3.listObjects(bucketParams, function (err, data) {
      if (err) {
        console.log('Error', err);
        throw err;
      } else {
        return data.Contents;
      }
    });
  },

  uploadFromFile: (fileName) => {
    // Read in the file, convert it to base64, store to S3
    fs.readFile(fileName, function (err, data) {
      if (err) {
        throw err;
      }
      const base64data = new Buffer(data, 'binary');

      const params = {
        Bucket: process.env.S3_BUCKET,
        Key: fileName,
        Body: base64data,
      };

      upload(params, data);
    });
  },

  uploadFromBuffer: async (data, fileName) => {
    var params = {
      Bucket: process.env.S3_BUCKET,
      Key: fileName,
      Body: data,
    };
    return await upload(params, data);
  },

  // NOT CURRENTLY USED, BUT LEFT IN FOR FUTURE REFERENCE
  getFileUrl: (fileName) => {
    let fileUrl = 'NO URL CREATED';
    const s3Bucket = new AWS.S3({ params: { Bucket: process.env.S3_BUCKET } });
    const urlParams = { Bucket: process.env.S3_BUCKET, Key: fileName };
    url = s3Bucket.getSignedUrl('getObject', urlParams);
    return url;
  },

  downloadFile: (filename) => {
    return new Promise((resolve, reject) => {
      const s3 = new AWS.S3();
      const params = {
        Bucket: process.env.S3_BUCKET,
        Key: filename,
      };
      s3.getObject(params, function (err, data) {
        if (err) {
          console.log(err, err.stack); // an error occurred
          reject(err);
        } else {
          // successful response
          resolve(data);
        }
      });
    });
  },
};
