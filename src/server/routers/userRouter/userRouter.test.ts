import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import app from "../../../app";
import connectDatabase from "../../../database";
import User from "../../../database/models/User";
import errorsMessage from "../../../errorsMessage";
import { getRandomUserRegisterCredentials } from "../../../factories/usersFactory";
import type { UserRegisterCredentials } from "../../types";

let server: MongoMemoryServer;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectDatabase(server.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await server.stop();
});

beforeEach(async () => {
  jest.resetAllMocks();
  await User.deleteMany();
});

describe("Given the endpoint /user/register", () => {
  describe("When it receives a POST request with username:'mario' email:'mario@gmail.com' and password:123 ", () => {
    test("Then it should return a response with status 201 with username Mario and email 'mario@gmail.com'", async () => {
      const expectedStatus = 201;
      const registerUser: UserRegisterCredentials = {
        username: "Mario",
        password: "123",
        email: "mario@gmail.com",
      };

      const response = await request(app)
        .post("/user/register")
        .send(registerUser)
        .expect(expectedStatus);

      const newUser = await User.findOne({ username: registerUser.username });

      const expectedBody = {
        username: registerUser.username,
        email: registerUser.email,
        id: newUser._id.toString(),
      };

      expect(newUser).toHaveProperty("id", newUser.id);
      expect(response.body).toStrictEqual({ user: expectedBody });
    });
  });

  describe("When it receives a POST request with a empty body", () => {
    test("Should return a response with status 500 with a message 'The details you provided don't meet the requirements'", async () => {
      const expectedStatus = 500;
      const expectedMessage = errorsMessage.validationError.publicMessage;

      const response = await request(app)
        .post("/user/register")
        .expect(expectedStatus);

      expect(response.status).toStrictEqual(expectedStatus);
      expect(response.body).toHaveProperty("error", expectedMessage);
    });
  });

  describe("When it receives a user that already register", () => {
    test("The it should return a response with status 409 and an error message with 'User is already registered'", async () => {
      const expectedStatus = 409;
      const expectedErrorMessage = errorsMessage.registerUser.publicMessage;

      const randomUserInDb = getRandomUserRegisterCredentials({
        username: "Mario",
        email: "mario@gmail.com",
        password: "123",
      })();

      await User.create(randomUserInDb);

      const response = await request(app)
        .post("/user/register")
        .send(randomUserInDb)
        .expect(expectedStatus);

      expect(response.status).toStrictEqual(expectedStatus);
      expect(response.body).toHaveProperty("error", expectedErrorMessage);
    });
  });
});
