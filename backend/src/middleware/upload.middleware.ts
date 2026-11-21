import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { config } from '../config/env';

// Ensure upload directory exists
if (!fs.existsSync(config.uploadDir)) {
  fs.mkdirSync(config.uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, config.uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}`;
    cb(null, `resume-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (
  _req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedExtensions = ['.pdf', '.docx'];
  const allowedMimeTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'application/octet-stream', // Some browsers send octet-stream for docx
  ];

  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowedExtensions.includes(ext)) {
    const error: any = new Error('Invalid file type. Only PDF (.pdf) and Word documents (.docx) are allowed.');
    error.statusCode = 400;
    return cb(error);
  }

  // Double check mime or extension
  if (!allowedMimeTypes.includes(file.mimetype) && !allowedExtensions.includes(ext)) {
    const error: any = new Error('Invalid document format. Only PDF and DOCX files are permitted.');
    error.statusCode = 400;
    return cb(error);
  }

  cb(null, true);
};

export const uploadResume = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.maxFileSize, // 5MB
    files: 1,
  },
});
