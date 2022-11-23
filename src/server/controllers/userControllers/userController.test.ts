/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable @typescript-eslint/await-thenable */

import type { Request, Response } from "express";
import User from "../../../database/models/User.js";
import {
  getRandomUserBd,
  getRandomUserLoginCredentials,
  getRandomUserRegisterCredentials,
} from "../../../factories/usersFactory.js";
import bcrypt from "bcrypt";
import { loginUser, registerUser } from "./userControllers.js";
import type { UserBd as UserDb } from "../../types.js";
import errorsMessage from "../../../errorsMessage.js";
import jwt from "jsonwebtoken";

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

describe("Given the loginUser controller", () => {
  const hashedPassword = "123";

  const userLogged = getRandomUserLoginCredentials({
    email: "mario@gmail.com",
    password: hashedPassword,
  })();
  const req: Partial<Request> = {
    body: userLogged,
  };

  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  describe("When receives a request with a email 'mario@gmail.com' and password 123", () => {
    test("Then should return a response with status 200 with a body with the token 'abc'", async () => {
      const expectedToken = "abc";
      const expectedStatus = 200;

      let userInDatabase: Partial<UserDb> = {
        email: userLogged.email,
        password: userLogged.password,
      };
      userInDatabase = getRandomUserBd(userInDatabase as UserDb)();

      User.findOne = jest.fn().mockReturnValueOnce({
        exec: jest.fn().mockReturnValue(userInDatabase),
      });
      bcrypt.compare = jest.fn().mockReturnValue(true);
      jwt.sign = jest.fn().mockReturnValueOnce(expectedToken);

      await loginUser(req as Request, res as Response, null);

      expect(res.status).toBeCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith({ token: expectedToken });
    });

    describe("When receives a request with username that not exist", () => {
      test("Then the next function should be called with the user not found", async () => {
        const expectedError = errorsMessage.loginErrors.userNotFound;
        const next = jest.fn();
        User.findOne = jest.fn().mockReturnValue({
          exec: jest.fn().mockReturnValue(null),
        });

        await loginUser(req as Request, null, next);

        expect(next).toBeCalledWith(expectedError);
      });
    });

    describe("When receives a request with a username with invalid password", () => {
      test("Then next should be called with error 'Invalid password", async () => {
        const expectedError = errorsMessage.loginErrors.invalidPassword;
        const next = jest.fn();

        let userInDatabase: Partial<UserDb> = {
          email: userLogged.email,
          password: userLogged.password,
        };
        userInDatabase = getRandomUserBd(userInDatabase as UserDb)();

        User.findOne = jest.fn().mockReturnValueOnce({
          exec: jest.fn().mockReturnValue(userInDatabase),
        });
        bcrypt.compare = jest.fn().mockReturnValue(false);

        await loginUser(req as Request, null, next);

        expect(next).toBeCalledWith(expectedError);
      });
    });
  });
});
