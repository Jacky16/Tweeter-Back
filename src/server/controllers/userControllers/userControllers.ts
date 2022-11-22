import type { RequestHandler } from "express";
import CustomError from "../../../CustomError/CustomError.js";
import User from "../../../database/models/User.js";
import errorsMessage from "../../../errorsMessage.js";
import type { UserRegisterCredentials } from "../../types";
import bcrypt from "bcrypt";

export const registerUser: RequestHandler = async (req, res, next) => {
  try {
    const { username, password, email } = req.body as UserRegisterCredentials;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      password: hashedPassword,
      email,
    });

    res.status(201).json({
      user: { id: newUser._id.toString(), username, email: newUser.email },
    });
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      errorsMessage.registerUser.publicMessage,
      errorsMessage.registerUser.statusCode
    );

    next(customError);
  }
};
