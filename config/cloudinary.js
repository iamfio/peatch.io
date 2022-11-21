const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CD_CLOUD_NAME,
  api_key: process.env.CD_API_KEY,
  api_secret: process.env.CD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "peatchio-userpic-upload",
    allowed_formats: "jpg, jpeg, png, avif",
  },
});

const uploader = multer({ storage });

module.exports = {
  uploader,
  cloudinary,
};
