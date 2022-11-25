import auth from "./auth";
import jwt from "jsonwebtoken";
import errorsMessage from "../../../errorsMessage";
import type { CustomRequest } from "../../types";

describe("Given the auth middleware", () => {
  const req: Partial<CustomRequest> = {};

  const next = jest.fn();
  describe("When receives a request with a header Authorization with the token 'Bearer abc'", () => {
    test("The next function should be called", () => {
      req.header = jest.fn().mockReturnValue("Bearer abc");
      const expectedId = { id: "abc" };
      jwt.verify = jest.fn().mockReturnValueOnce(expectedId);

      auth(req as CustomRequest, null, next);

      expect(next).toBeCalled();
    });
  });

  describe("When it receives a request with a Authorization header 'asd'  ", () => {
    test("Then the next function should be called with the error 'Bearer missing'", () => {
      const expectedError = errorsMessage.authErrors.missingBearer;
      const expectedId = "asdf";

      req.header = jest.fn().mockReturnValue(expectedId);

      auth(req as CustomRequest, null, next);

      expect(next).toBeCalledWith(expectedError);
    });
  });

  describe("When it receives a request without a header", () => {
    test("Then the next function should be called with the error 'No token provided'", () => {
      const expectedError = errorsMessage.authErrors.missingBearer;

      req.header = jest.fn().mockReturnValue(null);

      auth(req as CustomRequest, null, next);

      expect(next).toBeCalledWith(expectedError);
    });
  });
});
