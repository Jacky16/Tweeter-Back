/* eslint-disable no-implicit-coercion */
import type { NextFunction, Response } from "express";
import type { Error } from "mongoose";
import Tweet from "../../../database/models/Tweet.js";
import errorsMessage from "../../../errorsMessage.js";
import type { CustomRequest } from "../../types.js";

export const getTweets = async (
  req: CustomRequest,
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
