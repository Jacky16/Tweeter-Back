/* eslint-disable new-cap */
import express from "express";
import { getTweets } from "../../controllers/tweetsControllers/tweetsControllers.js";

const tweetsRouter = express.Router();

tweetsRouter.get("/", getTweets);
tweetsRouter.get("/:idTweet");

export default tweetsRouter;
