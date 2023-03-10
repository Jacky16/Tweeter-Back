/* eslint-disable new-cap */
import express from "express";
import { validate } from "express-validation";
import multer from "multer";
import path from "path";
import {
  backupImage,
  formatImage,
  renameImage,
} from "../../controllers/imageControllers/imageControllers.js";
import {
  createTweet,
  deleteTweet,
  getOneTweet,
  getTweets,
  getTweetsByCategory,
  updateTweet,
} from "../../controllers/tweetsControllers/tweetsControllers.js";
import tweetSchema from "../../schemas/tweetSchema.js";

const tweetsRouter = express.Router();

const upload = multer({
  dest: path.join("assets", "images"),
  limits: {
    fileSize: 8000000,
  },
});

tweetsRouter.get("/", getTweets);
tweetsRouter.get("/category/:category", getTweetsByCategory);
tweetsRouter.get("/:idTweet", getOneTweet);
tweetsRouter.post(
  "/create",
  upload.single("image"),
  validate(tweetSchema, {}, { abortEarly: false }),
  renameImage,
  formatImage,
  backupImage,
  createTweet
);
tweetsRouter.delete("/delete/:idTweet", deleteTweet);
tweetsRouter.patch(
  "/update/:idTweet",
  upload.single("image"),
  renameImage,
  formatImage,
  backupImage,
  updateTweet
);

export default tweetsRouter;
