import multer from 'multer';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import createHttpError from 'http-errors';
import { env } from '../utils/env.js';

cloudinary.config({
  cloud_name: env('CLOUDINARY_NAME'),
  api_key: env('CLOUDINARY_KEY'),
  api_secret: env('CLOUDINARY_SECRET'),
});

const storage = multer.diskStorage({
  destination: path.join(process.cwd(), 'temp'),
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extname);
    const suffix = Date.now();
    cb(null, `${basename}-${suffix}${extname}`);
  },
});

const upload = multer({ storage });

const uploadToCloudinary = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    req.body.photo = result.secure_url;
    next();
  } catch (error) {
    next(createHttpError(500, 'Failed to upload file to Cloudinary'));
  }
};

export const uploadMiddleware = (fieldName) => [
  upload.single(fieldName),
  uploadToCloudinary,
];
