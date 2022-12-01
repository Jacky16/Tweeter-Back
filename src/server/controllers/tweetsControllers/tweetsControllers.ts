/* eslint-disable no-implicit-coercion */
import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { Error } from "mongoose";
import Tweet from "../../../database/models/Tweet.js";
import errorsMessage from "../../../errorsMessage.js";
import type { ImageRequest, TweetBody } from "../../types.js";

export const getTweets = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const currentPage = +page;

    const totalPages = Math.ceil((await Tweet.count().exec()) / +limit);

    if (currentPage < 1 || currentPage > totalPages) {
      next(errorsMessage.tweets.paginationRangeError);
      return;
    }

    const tweets = await Tweet.find()
      .limit(+limit)
      .skip((+page - 1) * +limit)
      .populate({ select: "username alias", path: "author" })
      .exec();

    if (!tweets || tweets.length === 0) {
      next(errorsMessage.tweets.tweetsNotfound);
      return;
    }

    res.status(200).json({
      totalPages,
      currentPage: +page,
      tweets,
    });
  } catch (error: unknown) {
    next(error as Error);
  }
};

export const getOneTweet: RequestHandler = async (req, res, next) => {
  try {
    const { idTweet } = req.params;

    const tweet = await Tweet.findById(idTweet).exec();

    if (!tweet) {
      next(errorsMessage.tweet.tweetNotfound);
      return;
    }

    res.status(200).json({ tweet });
  } catch (error: unknown) {
    next(error as Error);
  }
};

export const createTweet = async (
  req: ImageRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { description, category, visibilityOpen, author, dateOfCreation } =
      req.body as TweetBody;

    const tweetToAdd = {
      description,
      category,
      visibilityOpen,
      author,
      dateOfCreation,
      image: req.imageFileName,
    };
    const tweet = await Tweet.create(tweetToAdd);

    res.status(201).json({ tweet });
  } catch (error: unknown) {
    next(error as Error);
  }
};
