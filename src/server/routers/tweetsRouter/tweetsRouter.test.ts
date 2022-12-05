import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import app from "../../../app";
import connectDatabase from "../../../database";
import Tweet from "../../../database/models/Tweet";
import User from "../../../database/models/User";
import { getRandomUserBd } from "../../../factories/usersFactory";
import jwt from "jsonwebtoken";
import environment from "../../../loadEnvironments";
import {
  getRandomTweet,
  getRandomTweets,
} from "../../../factories/tweetsFactory";

const user = getRandomUserBd();
let server: MongoMemoryServer;

const requestUserToken = jwt.sign(
  { username: user.username, id: user._id },
  environment.jwtSecret
);

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectDatabase(server.getUri());
  await User.create(user);
});

afterEach(async () => {
  await Tweet.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await server.stop();
});

describe("Given a GET /tweets endpoint", () => {
  const tweets = getRandomTweets(10);
  describe("When it receives a request with valid token and there are 10 tweets in the database", () => {
    test("Then it should respond with status 200 and an list of 10 tweets", async () => {
      const expectStatus = 200;

      await Tweet.create(tweets);
      const response = await request(app)
        .get("/tweets")
        .set("Authorization", `Bearer ${requestUserToken}`)
        .expect(expectStatus);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("totalPages");
      expect(response.body).toHaveProperty("currentPage");
      expect(response.body.tweets).toHaveLength(10);
    });

    describe("When it receives a request with an invalid token and there are 10 tweets in the database", () => {
      test("Then it should respond with status 401 and an error message", async () => {
        const expectStatus = 401;

        const response = await request(app)
          .get("/tweets")
          .set("Authorization", `Bearer ${requestUserToken}invalid`)
          .expect(expectStatus);

        expect(response.status).toBe(expectStatus);
        expect(response.body).toHaveProperty("error");
      });
    });
  });
  describe("When it receives a request with valid token and there are 0 tweets in the database", () => {
    test("Then it should respond with status 404 and an error message", async () => {
      const expectStatus = 404;

      const response = await request(app)
        .get("/tweets")
        .set("Authorization", `Bearer ${requestUserToken}`)
        .expect(expectStatus);

      expect(response.status).toBe(expectStatus);
      expect(response.body).toHaveProperty("error");
    });
  });
});

describe("Given a GET /tweets/:idTweet endpoint", () => {
  describe("When it receives a request with valid token and a valid idTweet and there're  10 tweets in database", () => {
    test("Then it should respond with status 200 and the tweet", async () => {
      const expectStatus = 200;
      const tweet = await Tweet.create(getRandomTweet());

      const response = await request(app)
        .get(`/tweets/${tweet._id.toString()}`)
        .set("Authorization", `Bearer ${requestUserToken}`)
        .expect(expectStatus);

      expect(response.status).toBe(expectStatus);
      expect(response.body).toHaveProperty("tweet");
    });
  });

  describe("When it receives a request with invalid token and a valid idTweet and there're  10 tweets in database", () => {
    test("Then it should respond with status 401 and an error message", async () => {
      const expectStatus = 401;
      const tweet = await Tweet.create(getRandomTweet());

      const response = await request(app)
        .get(`/tweets/${tweet._id.toString()}`)
        .set("Authorization", `Bearer ${requestUserToken}invalid`)
        .expect(expectStatus);

      expect(response.status).toBe(expectStatus);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("When it receives a valid token and receives an unknown idTweet", () => {
    test("Then it should respond with status 404 and an error message", async () => {
      const expectStatus = 404;
      await Tweet.create(getRandomTweets(10));

      const response = await request(app)
        .get(`/tweets/6380a8a63cf4ded22b9fa084`)
        .set("Authorization", `Bearer ${requestUserToken}`)
        .expect(expectStatus);

      expect(response.status).toBe(expectStatus);
      expect(response.body).toHaveProperty("error");
    });
  });
});

describe("When it receives a request with valid token from a non-allowed origin", () => {
  test("Then it should respond with an error and status 500", async () => {
    const expectedStatus = 500;

    const response = await request(app)
      .get("/tweets")
      .set("Origin", "http://allowed.com")
      .expect(expectedStatus);

    expect(response.body).toHaveProperty("error");
  });
});
