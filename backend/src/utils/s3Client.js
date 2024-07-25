require('dotenv').config(); // Load environment variables
const { S3Client, ListBucketsCommand } = require('@aws-sdk/client-s3');

console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID);
console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY);
console.log('AWS_REGION:', process.env.AWS_REGION);

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const listBuckets = async () => {
  try {
    const data = await s3Client.send(new ListBucketsCommand({}));
    console.log('Success', data.Buckets);
  } catch (err) {
    console.error('Error', err);
  }
};

listBuckets();



