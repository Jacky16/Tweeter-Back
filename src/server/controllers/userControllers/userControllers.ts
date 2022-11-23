import type { RequestHandler } from "express";
import CustomError from "../../../CustomError/CustomError.js";
import User from "../../../database/models/User.js";
import errorsMessage from "../../../errorsMessage.js";
import type {
  UserLoginCredentials,
  UserRegisterCredentials,
  UserTokenPayload,
} from "../../types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import environment from "../../../loadEnvironments.js";

export const registerUser: RequestHandler = async (req, res, next) => {
  try {
    const { username, password, email, alias } =
      req.body as UserRegisterCredentials;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      alias,
      password: hashedPassword,
      email,
    });

    res.status(201).json({
      user: { id: newUser._id.toString(), username, email, alias },
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

export const loginUser: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body as UserLoginCredentials;

  try {
    const user = await User.findOne({ email }).exec();

    if (!user) {
      next(errorsMessage.loginErrors.userNotFound);
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      next(errorsMessage.loginErrors.invalidPassword);
      return;
    }

    const tokenPayload: UserTokenPayload = {
      id: user._id.toString(),
      username: user.username,
      email,
      alias: user.alias,
    };

    const accessToken = jwt.sign(tokenPayload, environment.jwtSecret);

    res.status(200).json({ token: accessToken });
  } catch (error: unknown) {
    next(error);
  }
};
