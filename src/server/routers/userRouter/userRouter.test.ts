import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import app from "../../../app";
import connectDatabase from "../../../database";
import User from "../../../database/models/User";
import errorsMessage from "../../../errorsMessage";
import { getRandomUserRegisterCredentials } from "../../../factories/usersFactory";
import type {
  UserLoginCredentials,
  UserRegisterCredentials,
} from "../../types";
import bcrypt from "bcrypt";

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
        alias: "@mario",
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
        alias: newUser.alias,
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

      const randomUserInDb = getRandomUserRegisterCredentials()();

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

describe("Given the endpoint /user/login", () => {
  describe("When it receives a request with a email 'mario@gmail.com' and password '123", () => {
    test("Then should return a response with status 200 and the user token", async () => {
      const expectStatusCode = 200;

      const userLogin: UserLoginCredentials = {
        email: "mario@gmail.com",
        password: "123",
      };

      const hashedPassword = await bcrypt.hash(userLogin.password, 10);
      const userRegistered: Partial<UserRegisterCredentials> = {
        email: userLogin.email,
        password: hashedPassword,
        alias: "@mario",
        username: "mario",
      };

      await User.create(userRegistered as UserRegisterCredentials);

      const response = await request(app)
        .post("/user/login")
        .send(userLogin)
        .expect(expectStatusCode);

      expect(response.statusCode).toBe(expectStatusCode);
      expect(response.body).toHaveProperty("token");
    });
  });

  describe("When it receives a request with incorrect password", () => {
    test("Then should return a response with status 401", async () => {
      const expectedStatusCode = 401;
      const expectedErrorMessage =
        errorsMessage.loginErrors.invalidPassword.publicMessage;

      const userLogin: UserLoginCredentials = {
        email: "mario@gmail.com",
        password: "1234",
      };

      const hashedPassword = await bcrypt.hash("123", 10);
      const userRegistered: Partial<UserRegisterCredentials> = {
        email: userLogin.email,
        password: hashedPassword,
        alias: "@mario",
        username: "mario",
      };

      await User.create(userRegistered as UserRegisterCredentials);

      const response = await request(app)
        .post("/user/login")
        .send(userLogin)
        .expect(expectedStatusCode);

      expect(response.statusCode).toBe(expectedStatusCode);
      expect(response.body).toHaveProperty("error", expectedErrorMessage);
    });
  });

  describe("When it receives a request with incorrect email", () => {
    test("Then should return a response with status 401", async () => {
      const expectedStatusCode = 401;
      const expectedErrorMessage =
        errorsMessage.loginErrors.userNotFound.publicMessage;

      const userLogin: UserLoginCredentials = {
        email: "mario@gmail.com",
        password: "1234",
      };

      const hashedPassword = await bcrypt.hash("123", 10);
      const userRegistered: Partial<UserRegisterCredentials> = {
        email: "mar@io.com",
        password: hashedPassword,
        alias: "@mario",
        username: "mario",
      };

      await User.create(userRegistered as UserRegisterCredentials);

      const response = await request(app)
        .post("/user/login")
        .send(userLogin)
        .expect(expectedStatusCode);

      expect(response.statusCode).toBe(expectedStatusCode);
      expect(response.body).toHaveProperty("error", expectedErrorMessage);
    });
  });

  describe("When receives a request with invalid body", () => {
    test("Should return a response with status 500 with a message 'The details you provided don't meet the requirements'", async () => {
      const expectedStatus = 500;
      const expectedMessage = errorsMessage.validationError.publicMessage;

      const response = await request(app)
        .post("/user/login")
        .expect(expectedStatus);

      expect(response.status).toStrictEqual(expectedStatus);
      expect(response.body).toHaveProperty("error", expectedMessage);
    });
  });
});
