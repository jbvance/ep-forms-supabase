import { aggregatedS3 as s3 } from 'util/S3Client';
import { getSignedUrlForFile } from 'util/s3BucketsFiles';
import requireAuth from './_require-auth';
const handler = async (req, res) => {
  try {
    const data = await s3.listObjects({
      Bucket: process.env.S3_BUCKET,
      Delimiter: '/',
      Prefix: `user-docs/${req.user.id}/`,
    });
    if (!data || !data.Contents || data.Contents.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No files were found',
        location: 'get-user-files',
      });
    }
    //console.log('DATA', data);
    // get signed url for each file, filtering only for PDF files
    const files = data.Contents.filter((f) => f.Key.includes('.pdf'));
    const signedFilesPromises = files.map(async (f) => {
      return await getSignedUrlForFile(process.env.S3_BUCKET, f.Key);
    });

    const signedFileUrls = await Promise.all(signedFilesPromises);
    const signedFiles = signedFileUrls.map((url) => {
      return {
        url,
        fileName: url.split('?')[0].split('/').pop(),
      };
    });

    return res.status(200).json({ status: 'success', data: signedFiles });
  } catch (err) {
    console.log('ERROR', err);
    return res
      .status(500)
      .json({ status: 'error', location: 'list-files', message: err.message });
  }
};

export default requireAuth(handler);
