// src/controllers/documentController.js
import User from '../models/user.js';
import {s3} from '../config/s3.js';

export const getDocuments = async (req, res) => {
  try {
    const email = req.headers['user-email'];
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const s3Params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Prefix: `${user._id}/`,
    };
    const s3Objects = await s3.listObjectsV2(s3Params).promise();

    const documentsWithLinks = await Promise.all(
      s3Objects.Contents
        .filter(obj => obj.Key.endsWith('.pdf'))
        .map(async (obj) => {
          const presignedParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: obj.Key,
            Expires: 3600,
            ResponseContentDisposition: 'inline',
            ResponseContentType: 'application/pdf',
          };
          const presignedUrl = await s3.getSignedUrlPromise('getObject', presignedParams);
          return {
            filename: obj.Key.split('/').pop(),
            createdAt: obj.LastModified,
            downloadUrl: presignedUrl,
            size: obj.Size,
          };
        })
    );

    res.status(200).json({ documents: documentsWithLinks });
  } catch (err) {
    console.error('Error fetching documents:', err);
    res.status(500).json({ message: 'Error fetching documents' });
  }
};
