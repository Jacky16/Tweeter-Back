import type { NextFunction, Response, Request } from "express";
import { bucket } from "../../../utils/supabase.js";

export const getTweetImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { originalUrl } = req;

  if (!originalUrl.startsWith("/assets")) {
    next();
    return;
  }

  const [, , , imageName] = originalUrl.split("/");

  const {
    data: { publicUrl },
  } = bucket.getPublicUrl(imageName);

  res.redirect(publicUrl);
  next();
};
