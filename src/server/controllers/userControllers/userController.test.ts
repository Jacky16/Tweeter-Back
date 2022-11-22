/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable @typescript-eslint/await-thenable */

import type { Request, Response } from "express";
import User from "../../../database/models/User.js";
import {
  getRandomUserBd,
  getRandomUserRegisterCredentials,
} from "../../../factories/usersFactory.js";
import bcrypt from "bcrypt";
import { registerUser } from "./userControllers.js";
import type { UserBd as UserDb } from "../../types.js";
import errorsMessage from "../../../errorsMessage.js";

describe("Given the registerUser controller", () => {
  const userCredentials = getRandomUserRegisterCredentials({
    username: "Mario",
    email: "mario@gmail.com",
    password: "123",
    alias: "@mario",
  })();
  const req: Partial<Request> = {
    body: userCredentials,
  };

  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  describe("When receives a request with a body username mario and password 123", () => {
    const userDatabase: Partial<UserDb> = {
      username: "Mario",
      email: "mario@gmail.com",
      password: "hashedPassword",
      alias: "@mario",
    };
    const userDb = getRandomUserBd(userDatabase as UserDb)();
    const hashedPassword = "abc";

    test("Then it should return a response with status 201 with the mario username and his email", async () => {
      const expectedStatus = 201;
      const expectedUser = {
        user: {
          id: userDb._id.toString(),
          username: userDb.username,
          email: userDb.email,
          alias: userDb.alias,
        },
      };

      User.create = jest.fn().mockReturnValueOnce(userDb);
      bcrypt.hash = jest.fn().mockReturnValue(hashedPassword);

      await registerUser(req as Request, res as Response, null);

      expect(res.status).toBeCalledWith(expectedStatus);
      expect(res.json).toBeCalledWith(expectedUser);
    });
  });
  describe("When try to create a existing user", () => {
    test("Then next should be called with error 'User exist'", async () => {
      const next = jest.fn();

      const errorExpected = errorsMessage.registerUser;

      User.create = jest.fn().mockRejectedValue(errorExpected);

      await registerUser(req as Request, res as Response, next);

      expect(next).toBeCalledWith(errorExpected);
    });
  });
});
