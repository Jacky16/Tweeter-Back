import type { NextFunction, Response } from "express";
import Tweet from "../../../database/models/Tweet.js";
import type { ImageRequest } from "../../types";
import path from "path";
import fs from "fs";
import { bucket } from "../../../utils/supabase.js";

export const getImage = async (
  req: ImageRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idTweet } = req.params;

    const { image: imageName } = await Tweet.findById(idTweet)
      .select("image")
      .exec();

    const existsImageInLocal = fs.existsSync(
      path.join("assets", "images", imageName)
    );

    if (!existsImageInLocal) {
      const {
        data: { publicUrl },
      } = bucket.getPublicUrl(imageName);
      req.publicImageUrl = publicUrl;

      next();
      return;
    }

    req.publicImageUrl = `${req.protocol}://${req.get(
      "host"
    )}/assets/images/${imageName}`;
    next();
  } catch (error: unknown) {
    next(error as Error);
  }
};
