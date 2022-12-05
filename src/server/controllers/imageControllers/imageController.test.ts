import { getRandomTweet } from "../../../factories/tweetsFactory";
import type { ImageRequest } from "../../types";
import { backupImage, formatImage, renameImage } from "./imageControllers";
import fs from "fs/promises";
import path from "path";
import { bucket } from "../../../utils/supabase";

const uploadPath = "assets/images";
const nameFile = {
  name: "test",
  extension: ".jpg",
};

const tweet = getRandomTweet();
const req: Partial<ImageRequest> = {
  body: tweet,
};

const next = jest.fn();

const timestamp = Date.now();
jest.useFakeTimers();
jest.setSystemTime(timestamp);

beforeEach(() => {
  jest.clearAllMocks();
});

let mockFile = jest.fn();
jest.mock("sharp", () => () => ({
  webp: jest.fn().mockReturnValue({
    toFormat: jest.fn().mockReturnValue({
      toFile: mockFile,
    }),
  }),
}));

describe("Given the renameImage controller", () => {
  const file: Partial<Express.Multer.File> = {
    originalname: `${nameFile.name}`,
    filename: "hash",
    destination: uploadPath,
    path: path.join(uploadPath, nameFile.name),
  };

  req.file = file as Express.Multer.File;

  describe("When receives a Image Request with an image file", () => {
    test("Then the next function should be called", async () => {
      await renameImage(req as ImageRequest, null, next);

      path.extname = jest.fn().mockReturnValue(nameFile.extension);

      fs.rename = jest.fn().mockResolvedValue(null);
      expect(next).toHaveBeenCalled();
    });
  });

  describe("When receives a Image Request without an image file", () => {
    test("Then the next function should be called'", async () => {
      req.file = null;
      await renameImage(req as ImageRequest, null, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When receives a Image Request with an image file and rename file throw a error", () => {
    test("Then the next function should be called with the error", async () => {
      const expectedError = new Error("Error");
      req.file = file as Express.Multer.File;

      fs.rename = jest.fn().mockRejectedValue(expectedError);

      await renameImage(req as ImageRequest, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given the formatImage controller", () => {
  const file: Partial<Express.Multer.File> = {
    originalname: `${nameFile.name}${nameFile.extension}`,
    filename: "hash",
    destination: uploadPath,
    path: path.join(uploadPath, nameFile.name),
  };

  req.file = file as Express.Multer.File;
  req.imageFileName = `${nameFile.name}${timestamp}${nameFile.extension}`;

  describe("When receives a Image Request with an image file null", () => {
    test("Then the next function should be called", async () => {
      const request: Partial<ImageRequest> = {
        ...req,
        file: null,
      };
      await formatImage(request as ImageRequest, null, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When receives a Image Request with an image file", () => {
    test("Then the next function should be called", async () => {
      const request: Partial<ImageRequest> = {
        ...req,
      };

      fs.unlink = jest.fn().mockResolvedValueOnce(true);
      await formatImage(request as ImageRequest, null, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When receives a Image Request with an image file and fs link reject a error", () => {
    test("Then the next function should be called", async () => {
      const request: Partial<ImageRequest> = {
        ...req,
      };
      mockFile = jest.fn().mockRejectedValue(new Error("Error"));

      await formatImage(request as ImageRequest, null, next);

      expect(next).toHaveBeenCalled();
    });
  });
});

describe("Given the backupImage controller", () => {
  describe("When receives a Image Request with an image file", () => {
    test("Then the next function should be called", async () => {
      fs.readFile = jest.fn().mockResolvedValue(true);

      bucket.upload = jest.fn().mockResolvedValueOnce({
        data: {
          publicUrl: "url",
        },
      });
      await backupImage(req as ImageRequest, null, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When receives a Image Request with an image file and fs read reject a error", () => {
    test("Then the next function should be called", async () => {
      fs.readFile = jest.fn().mockRejectedValue(new Error("Error"));

      await backupImage(req as ImageRequest, null, next);

      expect(next).toHaveBeenCalled();
    });
  });
  describe("When receives a ImageRequest without image", () => {
    test("Then the next function should be called", async () => {
      const request: Partial<ImageRequest> = {
        ...req,
        file: null,
      };

      await backupImage(request as ImageRequest, null, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
