const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY
})


//define storage to where we save our cloud photos
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'major_photos',
      allowedFormat: ["png", "jpg", "jpeg"], // supports promises as well
    },
  });

  module.exports = {
    cloudinary,
    storage,
  }