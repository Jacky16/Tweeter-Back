import type { Response } from "express";
import errorsMessage from "../../../errorsMessage";
import { endpointNotFound } from "./error.js";

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
