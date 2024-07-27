const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'anime_uploads',
    format: async (req, file) => 'jpg', // supports promises as well
    public_id: (req, file) => `${req.body.title ? req.body.title.replace(/\s+/g, '_') : 'file'}_${Date.now()}`,
    // transformation: [{ width: 600, height: 800, crop: 'limit', quality: 'auto' }], // Optimize image size and quality
  },
});

const upload = multer({ storage });

const deleteImage = async (fileUrl) => {
  try {
    const publicId = fileUrl.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`anime_uploads/${publicId}`);
    console.log('File deleted from Cloudinary:', fileUrl);
  } catch (err) {
    console.error('Error deleting file from Cloudinary:', err);
  }
};

module.exports = { upload, deleteImage };