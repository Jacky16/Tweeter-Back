import type { NextFunction, Response } from "express";
import type { ImageRequest } from "../../types";
import fs from "fs/promises";
import path from "path";
import errorsMessage from "../../../errorsMessage.js";

const removeExtension = (filename: string) =>
  filename.substring(0, filename.lastIndexOf(".")) || filename;

export const renameImage = async (
  req: ImageRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      next(errorsMessage.images.imageNotProvided);
      return;
    }

    const { originalname, destination, path: filePath } = req.file;
    const dateTime = Date.now();

    const filenameWithoutExtension = removeExtension(originalname);
    const extensionFile = path.extname(originalname);

    const newFileName = `${filenameWithoutExtension}${dateTime}${extensionFile}`;

    await fs.rename(filePath, path.join(destination, newFileName));

    req.imageFileName = newFileName;

    next();
  } catch (error: unknown) {
    next(error);
  }
};
