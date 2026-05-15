import multer, { StorageEngine, FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";

const createStorage = (directory: string): StorageEngine => {
  const uploadDir = path.join(process.cwd(), "uploads", directory);


  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  return multer.diskStorage({
    destination: (req: Request, file: any, cb: any) => {
      cb(null, uploadDir);
    },
    filename: (req: Request, file: any, cb: any) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext);
      cb(null, `${name}-${uniqueSuffix}${ext}`);
    },
  });
};

const fileFilter =
  (allowedMimes: string[]) =>
  (req: Request, file: any, cb: FileFilterCallback) => {
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type: ${file.mimetype}`));
    }
  };

export const uploadResume = multer({
  storage: createStorage("resumes"),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: fileFilter([
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ]),
});

export const uploadAvatar = multer({
  storage: createStorage("avatars"),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter(["image/jpeg", "image/png", "image/webp"]),
});

export const uploadReport = multer({
  storage: createStorage("reports"),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: fileFilter([
    "application/pdf",
    "text/csv",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ]),
});
