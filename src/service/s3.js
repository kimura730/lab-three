import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.REACT_APP_S3_ACCESS_KEY || '',
        secretAccessKey: process.env.REACT_APP_S3_ACCESS_SECRET || '',
    },
    endpoint: process.env.REACT_APP_S3_ENDPOINT,
    forcePathStyle: true,
    region: process.env.REACT_APP_S3_BUCKET_REGION,
});

// general the link with signature, file path and bucket for uploading file to s3, signature will be changed every upload.
export const presignedPut = async (key) => {
    const command = new PutObjectCommand({ Bucket: process.env.REACT_APP_S3_BUCKET, Key: key });
    const url = await getSignedUrl(s3, command, { expiresIn: 60 * 60 });
    console.log(url);
    return url;
};
