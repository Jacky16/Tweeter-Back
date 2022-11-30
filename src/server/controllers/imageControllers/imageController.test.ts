import errorsMessage from "../../../errorsMessage";
import { getRandomTweet } from "../../../factories/tweetsFactory";
import type { ImageRequest } from "../../types";
import { renameImage } from "./imageControllers";
import fs from "fs/promises";
import path from "path";

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

describe("Given the renameImage controller", () => {
  beforeEach(async () => {
    await fs.writeFile(path.join(uploadPath, nameFile.name), Buffer.from(""));
  });

  afterAll(async () => {
    await fs.unlink(`${uploadPath}/${nameFile.name}${timestamp}`);
    await fs.unlink(`${uploadPath}/${nameFile.name}`);
  });

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

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When receives a Image Request without an image file", () => {
    test("Then the next function should be called with and error 'Image not provided'", async () => {
      const expectedError = errorsMessage.images.imageNotProvided;

      req.file = null;
      await renameImage(req as ImageRequest, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When receives a Image Request with an image file and rename file throw a error", () => {
    test("Then the next function should be called with the error", async () => {
      const expectedError = new Error("Error");
      req.file = file as Express.Multer.File;

      fs.rename = jest.fn().mockRejectedValueOnce(expectedError);

      await renameImage(req as ImageRequest, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
