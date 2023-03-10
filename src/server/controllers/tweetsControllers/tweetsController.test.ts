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
import {
  createTweet,
  deleteTweet,
  getOneTweet,
  getTweets,
  getTweetsByCategory,
  updateTweet,
} from "./tweetsControllers";

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
    protocol: "http",
    host: "localhost:3000",
  };

  const next = jest.fn();
  const mockTweets = getRandomTweets(10);
  const tweets = {
    map: jest.fn().mockReturnValue(mockTweets),
  };
  describe("When receive a CustomRequest with query params with page 1 and limit 5", () => {
    test("Then it should return a response 200 with the currentPage 1 , totalPages 2 and the list of tweets", async () => {
      const expectedStatus = 200;
      const expectedJson = {
        totalPages: 2,
        currentPage: 1,
        tweets: mockTweets,
      };

      Math.ceil = jest.fn().mockReturnValue(expectedJson.totalPages);
      Tweet.count = jest.fn().mockReturnValue({
        exec: jest.fn().mockReturnValue(tweets),
      });

      Tweet.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            skip: jest.fn().mockReturnValue({
              populate: jest.fn().mockReturnValue({
                exec: jest.fn().mockReturnValue(tweets),
              }),
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
          sort: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              skip: jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnValue({
                  exec: jest.fn().mockReturnValue(null),
                }),
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

        Tweet.count = jest.fn().mockReturnValue({
          exec: jest.fn().mockRejectedValue(expectedError),
        });

        await getTweets(req as CustomRequest, res as Response, next);

        expect(next).toBeCalledWith(expectedError);
      });
    });
  });

  describe("When receive a CustomRequest with query params with page -1 and limit 5", () => {
    test("Then the next function should be called with the error 'Page out of range'", async () => {
      const request = {
        ...req,
        query: {
          page: "-1",
          limit: "5",
        },
      };

      Tweet.count = jest.fn().mockReturnValue({
        exec: jest.fn().mockReturnValue(10),
      });

      await getTweets(request as CustomRequest, null, next);

      expect(next).toBeCalledWith(errorsMessage.tweets.paginationRangeError);
    });
  });
});

describe("Given a getTweetsByCategory controller", () => {
  const req: Partial<CustomRequest> = {
    userId: "1234",
    params: { category: "sports" },
    query: { page: "1", limit: "5" },
    protocol: "http",
    host: "localhost:3000",
  };

  const next = jest.fn();
  const mockTweets = getRandomTweets(10);
  const tweets = {
    map: jest.fn().mockReturnValue(mockTweets),
  };
  describe("When receive a CustomRequest with query params with page 1 and limit 5", () => {
    test("Then it should return a response 200 with the currentPage 1 , totalPages 2 and the list of tweets", async () => {
      const request = {
        ...req,
        query: {},
      };

      const expectedStatus = 200;
      const expectedJson = {
        totalPages: 2,
        currentPage: 1,
        tweets: mockTweets,
      };

      Math.ceil = jest.fn().mockReturnValue(expectedJson.totalPages);

      Tweet.count = jest.fn().mockReturnValue({
        exec: jest.fn().mockReturnValue(tweets),
      });

      Tweet.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            skip: jest.fn().mockReturnValue({
              populate: jest.fn().mockReturnValue({
                exec: jest.fn().mockReturnValue(tweets),
              }),
            }),
          }),
        }),
      });

      await getTweetsByCategory(
        request as CustomRequest,
        res as Response,
        null
      );

      expect(res.status).toBeCalledWith(expectedStatus);
      expect(res.json).toBeCalledWith(expectedJson);
    });

    describe("And there aren't tweets in database", () => {
      test("Then the next function should called with error 'Tweets not found'", async () => {
        Math.ceil = jest.fn().mockReturnValue(0);

        Tweet.count = jest.fn().mockReturnValue({
          exec: jest.fn().mockReturnValue(0),
        });

        Tweet.find = jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            skip: jest.fn().mockReturnValue({
              populate: jest.fn().mockReturnValue({
                exec: jest.fn().mockReturnValue(null),
              }),
            }),
          }),
        });

        await getTweetsByCategory(req as CustomRequest, res as Response, next);

        expect(next).toBeCalledWith(errorsMessage.tweets.tweetsNotfound);
      });
    });

    describe("And when try to get the tweets from database and it fails", () => {
      test("Then the next function should called with error 'Tweets not found'", async () => {
        const expectedError = new Error("Error");

        Tweet.count = jest.fn().mockReturnValue({
          exec: jest.fn().mockRejectedValue(expectedError),
        });

        await getTweetsByCategory(req as CustomRequest, res as Response, next);

        expect(next).toBeCalledWith(expectedError);
      });
    });
  });

  describe("When receive a CustomRequest with query params with page -1 and limit 5", () => {
    test("Then the next function should be called with the error 'Page out of range'", async () => {
      const request = {
        ...req,
        query: {
          page: "-1",
          limit: "5",
        },
        params: {
          category: "sports",
        },
      };

      Tweet.count = jest.fn().mockReturnValue({
        exec: jest.fn().mockReturnValue(10),
      });

      await getTweetsByCategory(request as CustomRequest, null, next);

      expect(next).toBeCalledWith(errorsMessage.tweets.paginationRangeError);
    });
  });

  describe("When receive a CustomRequest with query params with category sports", () => {
    test("Then the next function should be called with the error 'Page out of range'", async () => {
      const request = {
        ...req,
        query: {},
        params: {
          category: "sports",
        },
      };

      await getTweets(request as CustomRequest, null, next);

      expect(next).toBeCalled();
    });
  });

  describe("When receive a CustomRequest with query params with unknown category", () => {
    const request = {
      ...req,
      query: {
        page: "1",
        limit: "5",
      },
      params: {
        category: "unknown",
      },
    };
    test("Then the next function should be called with the error 'Category not found'", async () => {
      const expectedError = errorsMessage.tweets.categoryNotfound;

      await getTweetsByCategory(request as CustomRequest, null, next);

      expect(next).toBeCalledWith(expectedError);
    });
  });
});

describe("Given a getOne controller", () => {
  const host = "localhost:3000";
  const protocol = "http";
  const req: Partial<Request> = {
    params: { idTweet: "1234" },
    protocol,
    get: jest.fn().mockReturnValue(host),
  };

  describe("When receive a Request with params with idTweet '1234'", () => {
    test("Then it should return a response 200 with the tweet", async () => {
      const expectedStatus = 200;
      const expectedTweet = getRandomTweet();

      const nameImage = expectedTweet.image;
      const urlImage = `${protocol}://${host}/assets/images/${nameImage}`;

      expectedTweet.image = urlImage;

      const expectedJson = { tweet: expectedTweet };

      Tweet.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockReturnValue({
            // eslint-disable-next-line @typescript-eslint/naming-convention
            toJSON: jest.fn().mockReturnValue(expectedTweet),
            image: nameImage,
          }),
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

describe("Given the deleteTweet controller", () => {
  const req: Partial<CustomRequest> = {
    params: { idTweet: "1234" },
    userId: "1234",
  };
  describe("When receive a Request with params with idTweet '1234'", () => {
    test("Then it should return a response 200 with the tweet", async () => {
      const expectedStatus = 200;
      const expectedTweet = getRandomTweet();
      const expectedJson = { tweet: expectedTweet };

      Tweet.findByIdAndDelete = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          exec: jest.fn().mockReturnValue(expectedTweet),
        }),
      });

      await deleteTweet(req as CustomRequest, res as Response, null);

      expect(res.status).toBeCalledWith(expectedStatus);
      expect(res.json).toBeCalledWith(expectedJson);
    });

    describe("And the tweets with id '1234' doesn't exist", () => {
      test("Then the next function should be called with the error 'Tweet not found'", async () => {
        const expectedError = errorsMessage.tweet.tweetNotfound;
        const next = jest.fn();

        Tweet.findByIdAndDelete = jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            exec: jest.fn().mockReturnValue(null),
          }),
        });

        await deleteTweet(req as CustomRequest, null, next);

        expect(next).toBeCalledWith(expectedError);
      });
    });

    describe("And when try to delete the tweet from database and it fails", () => {
      test("The next should be called with 'Error on database'", async () => {
        const expectedError = new Error("Error on database");
        const next = jest.fn();

        Tweet.findByIdAndDelete = jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            exec: jest.fn().mockRejectedValue(expectedError),
          }),
        });

        await deleteTweet(req as CustomRequest, null, next);

        expect(next).toBeCalledWith(expectedError);
      });
    });
  });
});

describe("Given the updateTweet controller", () => {
  const req: Partial<ImageRequest> = {
    params: { idTweet: "1234" },
    userId: "1234",
    body: getRandomTweet(),
    imageFileName: "image.jpg",
  };

  describe("When receive a ImageRequest with a tweet as body", () => {
    test("Then it should return the response with status 200 and the tweet updated", async () => {
      const expectedStatus = 200;
      const expectedTweet = getRandomTweet();
      const expectedJson = { tweet: expectedTweet };

      Tweet.findByIdAndUpdate = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          exec: jest.fn().mockReturnValue(expectedTweet),
        }),
      });

      await updateTweet(req as ImageRequest, res as Response, null);

      expect(res.status).toBeCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedJson);
    });
  });

  describe("When receive a ImageRequest with a tweet as body and update the tweet fails", () => {
    test("Then the next function should be called with the error 'Error on database'", async () => {
      const expectedError = new Error("Error on database");

      Tweet.findByIdAndUpdate = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          exec: jest.fn().mockRejectedValue(expectedError),
        }),
      });

      const next = jest.fn();
      await updateTweet(req as ImageRequest, null, next);

      expect(next).toBeCalledWith(expectedError);
    });
  });

  describe("When receive a ImageRequest with a tweet as body and the author tweet is not the same that userId", () => {
    test("Then the next function should be called with the error 'You can't edit this tweet'", async () => {
      const expectedError = errorsMessage.tweets.errorOnEdit;

      Tweet.findByIdAndUpdate = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          exec: jest.fn().mockReturnValue(null),
        }),
      });

      const next = jest.fn();
      await updateTweet(req as ImageRequest, null, next);

      expect(next).toBeCalledWith(expectedError);
    });
  });
});
