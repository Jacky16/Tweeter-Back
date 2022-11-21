import type { Response } from "express";
import CustomError from "../../../CustomError/CustomError.js";
import errorsMessage from "../../../errorsMessage";
import { endpointNotFound, generalError } from "./error.js";

describe("Given the middleware endpointNotFound", () => {
  describe("When it receives a unknown endpoint", () => {
    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    test("Then should return a response with status 404 with a message 'Endpoint not found'", async () => {
      const expectedMessage = {
        error: errorsMessage.endpointNotFound.publicMessage,
      };
      const expectedStatus = 404;

      endpointNotFound(null, res as Response, null);

      expect(res.json).toBeCalledWith(expectedMessage);
      expect(res.status).toBeCalledWith(expectedStatus);
    });
  });
});
describe("Given the middleware generalError", () => {
  describe("When it receives a error with a message 'Error', public message 'Error try again' with status 502'", () => {
    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    test("Then it should return a response with status 500 with a public message Error try again", () => {
      const { publicMessage, status } = errorsMessage.defaultGeneralError;

      const expectedPublicMessage = publicMessage;
      const expectedStatus = 500;

      const error = new CustomError("Error", expectedPublicMessage, status);

      generalError(error, null, res as Response, null);

      expect(res.json).toBeCalledWith({ error: expectedPublicMessage });
      expect(res.status).toBeCalledWith(expectedStatus);
    });
  });
  describe("When it receives a error without a message, public message 'Error try again' with status 0", () => {
    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    test("Then it should return a response with status 500 with a public message 'Fatal error'", () => {
      const { publicMessage: message, status } =
        errorsMessage.defaultGeneralError;

      const expectedPublicMessage = message;
      const expectedStatus = status;

      const error = new CustomError("Error", undefined, null);

      generalError(error, null, res as Response, null);

      expect(res.json).toBeCalledWith({ error: expectedPublicMessage });
      expect(res.status).toBeCalledWith(expectedStatus);
    });
  });
});
