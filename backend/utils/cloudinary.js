const cloudinary = require('cloudinary').v2;

function configureCloudinary() {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.warn('[cloudinary] Missing credentials; file upload to Cloudinary disabled');
    return false;
  }
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  return true;
}

async function uploadBuffer(buffer, filename, folder = 'resumes') {
  const configured = cloudinary.config().cloud_name;
  if (!configured) throw new Error('Cloudinary not configured');
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({
      folder,
      resource_type: 'raw',
      public_id: filename.replace(/[^a-zA-Z0-9_-]/g, '_'),
      overwrite: true
    }, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
    stream.end(buffer);
  });
}

module.exports = { configureCloudinary, uploadBuffer };