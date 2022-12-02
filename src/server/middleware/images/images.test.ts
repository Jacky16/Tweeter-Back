import type { Response, Request } from "express";
import { bucket } from "../../../utils/supabase";
import type { ImageRequest } from "../../types";
import { getTweetImage } from "./images";

describe("Given a getTweetImage middleware", () => {
  const res: Partial<Response> = {
    redirect: jest.fn(),
  };
  describe("When receives a request with originalUrl /assets/1234", () => {
    test("Then it should call res.redirect with the publicUrl", async () => {
      const req: Partial<ImageRequest> = {
        originalUrl: "/assets/1234",
      };
      const next = jest.fn();
      const expectedPublicUrl = "http://localhost:3000/assets/1234";

      bucket.getPublicUrl = jest.fn().mockReturnValue({
        data: { publicUrl: expectedPublicUrl },
      });

      await getTweetImage(req as Request, res as Response, next);

      expect(res.redirect).toBeCalledWith(expectedPublicUrl);
      expect(next).toBeCalled();
    });

    describe("When it receives a request with a path that doesn't start with /assets", () => {
      const req: Partial<Request> = {
        baseUrl: "",
      };
      test("Then it should call next", async () => {
        req.originalUrl = "";
        const next = jest.fn();

        await getTweetImage(req as ImageRequest, res as Response, next);

        expect(next).toHaveBeenCalled();
      });
    });
  });
});
