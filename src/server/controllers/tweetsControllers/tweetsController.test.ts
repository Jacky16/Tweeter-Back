/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable @typescript-eslint/await-thenable */
import type { Request, Response } from "express";
import Tweet from "../../../database/models/Tweet";
import errorsMessage from "../../../errorsMessage";
import {
  getRandomTweet,
  getRandomTweets,
} from "../../../factories/tweetsFactory";
import type { CustomRequest, ImageRequest } from "../../types";
import { createTweet, getOneTweet, getTweets } from "./tweetsControllers";

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};
afterEach(() => {
  jest.clearAllMocks();
});

describe("Given a getTweets controller", () => {
  const req: Partial<CustomRequest> = {
    userId: "1234",
    params: {},
    query: { page: "1", limit: "5" },
  };

  const next = jest.fn();
  const tweets = getRandomTweets(10);
  describe("When receive a CustomRequest with query params with page 1 and limit 5", () => {
    test("Then it should return a response 200 with the currentPage 1 , totalPages 2 and the list of tweets", async () => {
      const expectedStatus = 200;
      const expectedJson = {
        totalPages: 2,
        currentPage: 1,
        tweets,
      };

      Tweet.count = jest.fn().mockReturnValue({
        exec: jest.fn().mockReturnValue(tweets.length),
      });

      Tweet.find = jest.fn().mockReturnValue({
        limit: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            populate: jest.fn().mockReturnValue({
              exec: jest.fn().mockReturnValue(tweets),
            }),
          }),
        }),
      });

      await getTweets(req as CustomRequest, res as Response, null);

      expect(res.status).toBeCalledWith(expectedStatus);
      expect(res.json).toBeCalledWith(expectedJson);
    });

    describe("And there aren't tweets in database", () => {
      test("Then the next function should called with error 'Tweets not found'", async () => {
        Tweet.find = jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            skip: jest.fn().mockReturnValue({
              populate: jest.fn().mockReturnValue({
                exec: jest.fn().mockReturnValue(null),
              }),
            }),
          }),
        });

        await getTweets(req as CustomRequest, res as Response, next);

        expect(next).toBeCalledWith(errorsMessage.tweets.tweetsNotfound);
      });
    });

    describe("And when try to get the tweets from database and it fails", () => {
      test("Then the next function should called with error 'Tweets not found'", async () => {
        const expectedError = new Error("Error");

        Tweet.find = jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            skip: jest.fn().mockReturnValue({
              populate: jest.fn().mockReturnValue({
                exec: jest.fn().mockRejectedValue(expectedError),
              }),
            }),
          }),
        });

        await getTweets(req as CustomRequest, res as Response, next);

        expect(next).toBeCalledWith(expectedError);
      });
    });
  });

  describe("When receive a CustomRequest with query params with page -1 and limit 5", () => {
    test("Then the next function should be called with the error 'Page out of range'", async () => {
      const request = { ...req, query: { page: "-1" } };

      await getTweets(request as CustomRequest, null, next);

      expect(next).toBeCalledWith(errorsMessage.tweets.paginationRangeError);
    });
  });

  describe("When receive a CustomRequest with query params with page 1 and limit -5", () => {
    test("Then the next function should be called with the error 'Limit out of range'", async () => {
      const request = { ...req, query: { limit: "-5" } };

      await getTweets(request as CustomRequest, null, next);

      expect(next).toBeCalledWith(errorsMessage.tweets.paginationRangeError);
    });
  });
});

describe("Given a getOne controller", () => {
  const req: Partial<Request> = {
    params: { idTweet: "1234" },
  };

  describe("When receive a Request with params with idTweet '1234'", () => {
    test("Then it should return a response 200 with the tweet", async () => {
      const expectedStatus = 200;
      const expectedTweet = getRandomTweet();
      const expectedJson = { tweet: expectedTweet };

      Tweet.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockReturnValue(expectedTweet),
        }),
      });

      await getOneTweet(req as Request, res as Response, null);

      expect(res.status).toBeCalledWith(expectedStatus);
      expect(res.json).toBeCalledWith(expectedJson);
    });

    describe("And the tweets with id '1234' doesn't exist", () => {
      test("Then the next function should be called with the error 'Tweet not found'", async () => {
        const expectedError = errorsMessage.tweet.tweetNotfound;
        const next = jest.fn();

        Tweet.findById = jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            exec: jest.fn().mockReturnValue(null),
          }),
        });

        await getOneTweet(req as Request, null, next);

        expect(next).toBeCalledWith(expectedError);
      });
    });

    describe("And when try to get the tweet from database and it fails", () => {
      test("The next should be called with 'Error on database'", async () => {
        const expectedError = new Error("Error on database");
        const next = jest.fn();

        Tweet.findById = jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            exec: jest.fn().mockRejectedValue(expectedError),
          }),
        });

        await getOneTweet(req as Request, null, next);

        expect(next).toBeCalledWith(expectedError);
      });
    });
  });
});

describe("Given the createTweet controller", () => {
  describe("When receive a ImageRequest with a tweet as body", () => {
    test("Then it should return the response with status 201 and the tweet created", async () => {
      const expectedStatus = 201;
      const expectedTweet = getRandomTweet();
      const expectedJson = { tweet: expectedTweet };
      const req: Partial<ImageRequest> = {
        body: expectedTweet,
        imageFileName: "image.jpg",
      };

      Tweet.create = jest.fn().mockReturnValue(expectedTweet);

      await createTweet(req as ImageRequest, res as Response, null);

      expect(res.status).toBeCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedJson);
    });
  });

  describe("When receive a ImageRequest with a tweet as body and create the tweet fails", () => {
    test("Then the next function should be called with the error 'Error on database'", async () => {
      const expectedError = new Error("Error on database");

      const req: Partial<ImageRequest> = {
        body: getRandomTweet(),
        imageFileName: "image.jpg",
      };

      Tweet.create = jest.fn().mockRejectedValue(expectedError);

      const next = jest.fn();
      await createTweet(req as ImageRequest, null, next);

      expect(next).toBeCalledWith(expectedError);
    });
  });
});
