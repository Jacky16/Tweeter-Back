import { getRandomTweet } from "../../../factories/tweetsFactory";
import type { ImageRequest } from "../../types";
import { backupImage, formatImage, renameImage } from "./imageControllers";
import fs from "fs/promises";
import path from "path";
import { bucket } from "../../../utils/supabase";

const uploadPath = "assets/images";
const fileName = {
  name: "test",
  extension: ".jpg",
};

const tweet = getRandomTweet();

const timestamp = Date.now();
jest.useFakeTimers();
jest.setSystemTime(timestamp);

const mockFile = jest.fn();
jest.mock("sharp", () => () => ({
  webp: jest.fn().mockReturnValue({
    toFormat: jest.fn().mockReturnValue({
      toFile: mockFile,
    }),
  }),
}));

const file: Partial<Express.Multer.File> = {
  originalname: `${fileName.name}${fileName.extension}`,
  destination: path.join(uploadPath),
  path: path.join(uploadPath, `${fileName.name}${fileName.extension}`),
};
const req: Partial<ImageRequest> = {
  body: tweet,
};

beforeEach(() => {
  jest.clearAllMocks();
});

const next = jest.fn();

describe("Given the renameImage middleware", () => {
  beforeAll(async () => {
    const filePath = path.join(
      uploadPath,
      `${fileName.name}${fileName.extension}`
    );
    await fs.writeFile(filePath, `${fileName.name}${fileName.extension}`);
  });
  afterAll(async () => {
    await fs.unlink(
      path.join(uploadPath, `${fileName.name}${timestamp}${fileName.extension}`)
    );
  });

  describe("When receives a image request with file", () => {
    const request = { ...req };
    request.file = file as Express.Multer.File;
    test(`Then the file should be renamed with test${timestamp}${fileName.extension}`, async () => {
      const expectedFileName = `${fileName.name}${timestamp}${fileName.extension}`;

      await renameImage(request as ImageRequest, null, next);

      expect(request.imageFileName).toBe(expectedFileName);
    });
  });

  describe("When receives a image request without file", () => {
    test("Then the next function should be called", async () => {
      await renameImage(req as ImageRequest, null, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe("When receives a image request with file and the rename reject a error", () => {
    const request = { ...req };
    request.file = file as Express.Multer.File;

    test("Then the next function should be called with the error", async () => {
      const expectedError = new Error("Error");
      fs.rename = jest.fn().mockRejectedValue(expectedError);

      await renameImage(request as ImageRequest, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given the formatImage middleware", () => {
  beforeAll(async () => {
    const filePath = path.join(
      uploadPath,
      `${fileName.name}${timestamp}${fileName.extension}`
    );

    await fs.writeFile(
      filePath,
      `${fileName.name}${timestamp}${fileName.extension}`
    );
  });

  describe("When receives a image request with file", () => {
    const request = { ...req };
    request.file = file as Express.Multer.File;
    request.imageFileName = `${fileName.name}${timestamp}${fileName.extension}`;

    test(`Then the image should be formatted to .webp with the name ${fileName.name}${timestamp}.webp `, async () => {
      await formatImage(request as ImageRequest, null, next);

      expect(mockFile).toHaveBeenCalledWith(
        path.join(uploadPath, `${fileName.name}${timestamp}.webp`)
      );
    });
  });

  describe("When receives a image request without file", () => {
    test("Then the next function should be called", async () => {
      await formatImage(req as ImageRequest, null, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe("When receives a image request with file and the formatImage reject a error", () => {
    const request = { ...req };
    request.file = file as Express.Multer.File;
    request.imageFileName = `${fileName.name}${timestamp}${fileName.extension}`;

    test("Then the next function should be called with the error", async () => {
      const expectedError = new Error("Error");
      mockFile.mockRejectedValue(expectedError);

      await formatImage(request as ImageRequest, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given the backupImage middleware", () => {
  beforeAll(async () => {
    const filePath = path.join(
      uploadPath,
      `${fileName.name}${timestamp}${fileName.extension}`
    );

    await fs.writeFile(
      filePath,
      `${fileName.name}${timestamp}${fileName.extension}`
    );
  });

  afterAll(async () => {
    await fs.unlink(
      path.join(uploadPath, `${fileName.name}${timestamp}${fileName.extension}`)
    );
  });

  describe("When receives a image request with file", () => {
    const request = { ...req };
    request.file = file as Express.Multer.File;
    request.imageFileName = `${fileName.name}${timestamp}${fileName.extension}`;

    test("Then publicImageUrl of imageRequest should be https://test.com", async () => {
      const expectedPublicUrl = "https://test.com";

      bucket.upload = jest.fn().mockResolvedValue(true);
      bucket.getPublicUrl = jest.fn().mockReturnValue({
        data: {
          publicUrl: expectedPublicUrl,
        },
      });

      await backupImage(request as ImageRequest, null, next);

      expect(request.publicImageUrl).toBe(expectedPublicUrl);
    });
  });

  describe("When receives a image request without file", () => {
    test("Then the next function should be called", async () => {
      await backupImage(req as ImageRequest, null, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When receives a image request with file and the backupImage reject a error", () => {
    const request = { ...req };
    request.file = file as Express.Multer.File;
    request.imageFileName = `${fileName.name}${timestamp}${fileName.extension}`;

    test("Then the next function should be called with the error", async () => {
      const expectedError = new Error("Error");
      bucket.upload = jest.fn().mockRejectedValue(expectedError);

      await backupImage(request as ImageRequest, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
