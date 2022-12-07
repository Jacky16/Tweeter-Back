import type { NextFunction, Response } from "express";
import type { ImageRequest } from "../../types";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { bucket } from "../../../utils/supabase.js";

const removeExtension = (filename: string) =>
  filename.substring(0, filename.lastIndexOf(".")) || filename;

export const renameImage = async (
  req: ImageRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      next();
      return;
    }

    const { originalname, destination, path: filePath } = req.file;
    const dateTime = Date.now();

    const filenameWithoutExtension = removeExtension(originalname).replace(
      /[^a-zA-Z0-9-_]/g,
      "-"
    );

    const extensionFile = path.extname(originalname);

    const newFileName = `${filenameWithoutExtension}${dateTime}${extensionFile}`;

    await fs.rename(filePath, path.join(destination, newFileName));

    req.imageFileName = newFileName;

    next();
  } catch (error: unknown) {
    next(error);
  }
};

export const formatImage = async (
  req: ImageRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      next();
      return;
    }

    const { imageFileName } = req;
    const { destination } = req.file;
    const fileExtension = path.extname(imageFileName);
    const fileBaseName = path.basename(imageFileName, fileExtension);

    await sharp(path.join(destination, imageFileName))
      .webp({ quality: 30 })
      .toFormat("webp")
      .toFile(path.join(destination, `${fileBaseName}.webp`));

    await fs.unlink(path.join(destination, imageFileName));

    req.imageFileName = `${fileBaseName}.webp`;

    next();
  } catch (error: unknown) {
    next(error);
  }
};

export const backupImage = async (
  req: ImageRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) {
    next();
    return;
  }

  const { imageFileName } = req;
  const { destination } = req.file;
  try {
    const fileContent = await fs.readFile(
      path.join(destination, imageFileName)
    );

    await bucket.upload(imageFileName, fileContent, {
      cacheControl: "31536000",
    });

    const {
      data: { publicUrl },
    } = bucket.getPublicUrl(imageFileName);

    req.publicImageUrl = publicUrl;

    next();
  } catch (error: unknown) {
    next(error);
  }
};
