const AWS = require('aws-sdk');
const crypto = require('crypto');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const buildKey = (clientId, travelId, section, fileName) => {
  const safeName = fileName.replace(/[^a-zA-Z0-9_.-]/g, '_');
  if (section === 'documentos_personales') {
    return path.posix.join('clientes', String(clientId), 'dni_pasaporte', `${Date.now()}_${safeName}`);
  }
  return path.posix.join('clientes', String(clientId), 'viajes', String(travelId), section, `${Date.now()}_${safeName}`);
};

const uploadFile = async ({ clientId, travelId, section, fileBuffer, mimeType, originalName }) => {
  const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
  const key = buildKey(clientId, travelId, section, originalName);

  await s3
    .putObject({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Body: fileBuffer,
      ContentType: mimeType
    })
    .promise();

  return { key, hash };
};

const getSignedUrl = (key) =>
  s3.getSignedUrl('getObject', {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    Expires: 60 * 60
  });

module.exports = {
  uploadFile,
  getSignedUrl
};
