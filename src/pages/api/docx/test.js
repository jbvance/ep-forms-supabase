import {
  createBucket,
  checkBucketExists,
  checkUserS3FolderExists,
} from 'util/s3BucketsFiles';
import requireAuth from '../_require-auth';

const handler = async (req, res) => {
  return res.status(200).json({ message: 'DONE' });
};

const handler_CHECK_S3_FOLDER_FOR_USER = async (req, res) => {
  try {
    const sfExists = await checkUserS3FolderExists('test');
    console.log(sfExists);
    return res.status(200).json({ message: 'DONE' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
    console.log(err);
  }
};

const handler_CHECK_BUCKET_EXISTS = async (req, res) => {
  try {
    const bucketExists = await checkBucketExists('ep-forms-supabase');
    console.log('RETURN DATA', bucketExists);
    return res.status(200).json({ message: 'DONE' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
    console.log(err);
  }
};

// CREAT BUCKET
const handler_OLD = async (req, res) => {
  try {
    const bucketData = await createBucket('jv-test-2342lk34j2l3k4j23lkj');
    console.log('BUCKET DATA', bucketData);
    return res.status(200).json({ message: 'DONE' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
    console.log(err);
  }
};

export default requireAuth(handler);
