/* eslint-disable no-implicit-coercion */
import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { Error } from "mongoose";
import categories from "../../../categories.js";
import Tweet from "../../../database/models/Tweet.js";
import errorsMessage from "../../../errorsMessage.js";
import type { CustomRequest, ImageRequest, TweetBody } from "../../types.js";

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
      .sort({ dateOfCreation: -1 })
      .limit(+limit)
      .skip((+page - 1) * +limit)
      .populate({ select: "username alias", path: "author" })
      .exec();

    if (!tweets || tweets.length === 0) {
      next(errorsMessage.tweets.tweetsNotfound);
      return;
    }

    const tweetsToAdd = tweets.map((tweet) => ({
      ...tweet.toJSON(),
      image: `${req.protocol}://${req.get("host")}/assets/images/${
        tweet.image
      }`,
    }));

    res.status(200).json({
      totalPages,
      currentPage: +page,
      tweets: tweetsToAdd,
    });
  } catch (error: unknown) {
    next(error as Error);
  }
};

export const getOneTweet: RequestHandler = async (
  req: ImageRequest,
  res,
  next
) => {
  try {
    const { idTweet } = req.params;
    const tweet = await Tweet.findById(idTweet)
      .populate({
        select: "username alias",
        path: "author",
      })
      .exec();

    if (!tweet) {
      next(errorsMessage.tweet.tweetNotfound);
      return;
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/assets/images/${
      tweet.image
    }`;
    const tweetResponse = { ...tweet.toJSON(), image: imageUrl };

    res.status(200).json({ tweet: tweetResponse });
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

export const getTweetsByCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    query: { page = 1, limit = 5 },
    params: { category: categoryParam },
  } = req;

  try {
    const existCategory = categories.find(
      (category) => category === categoryParam
    );

    if (!existCategory) {
      next(errorsMessage.tweets.categoryNotfound);
      return;
    }

    const currentPage = +page;

    const totalTweetsWithCategory = await Tweet.count({
      category: categoryParam,
    }).exec();

    if (totalTweetsWithCategory === 0) {
      next(errorsMessage.tweets.tweetsNotfound);
      return;
    }

    const totalPages = Math.ceil(totalTweetsWithCategory / +limit);
    if (currentPage < 1 || currentPage > totalPages) {
      next(errorsMessage.tweets.paginationRangeError);
      return;
    }

    const tweets = await Tweet.find({ category: categoryParam })
      .sort({ dateOfCreation: -1 })
      .limit(+limit)
      .skip((+page - 1) * +limit)
      .populate({ select: "username alias", path: "author" })
      .exec();

    const tweetsToAdd = tweets.map((tweet) => ({
      ...tweet.toJSON(),
      image: `${req.protocol}://${req.get("host")}/assets/images/${
        tweet.image
      }`,
    }));

    res.status(200).json({
      totalPages,
      currentPage: +page,
      tweets: tweetsToAdd,
    });
  } catch (error: unknown) {
    next(error as Error);
  }
};

export const deleteTweet = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idTweet } = req.params;
    const { userId } = req;

    const tweet = await Tweet.findByIdAndDelete(idTweet)
      .where({ author: userId })
      .exec();

    if (!tweet) {
      next(errorsMessage.tweet.tweetNotfound);
      return;
    }

    res.status(200).json({ tweet });
  } catch (error: unknown) {
    next(error as Error);
  }
};

export const updateTweet = async (
  req: ImageRequest,
  res: Response,
  next: NextFunction
) => {
  const { description, category, visibilityOpen, author } =
    req.body as TweetBody;
  const { idTweet } = req.params;
  const { userId } = req;

  try {
    const tweet = await Tweet.findByIdAndUpdate(
      idTweet,

      {
        description,
        category,
        image: req.imageFileName,
        visibilityOpen,
        author,
      },
      { new: true }
    )
      .where({ author: userId })
      .exec();

    if (!tweet) {
      next(errorsMessage.tweets.errorOnEdit);
      return;
    }

    res.status(200).json({ tweet });
  } catch (error: unknown) {
    next(error as Error);
  }
};
