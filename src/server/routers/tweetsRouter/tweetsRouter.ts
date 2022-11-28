/* eslint-disable new-cap */
import express from "express";
import {
  getOneTweet,
  getTweets,
} from "../../controllers/tweetsControllers/tweetsControllers.js";

const tweetsRouter = express.Router();

tweetsRouter.get("/", getTweets);
tweetsRouter.get("/:idTweet", getOneTweet);

export default tweetsRouter;
