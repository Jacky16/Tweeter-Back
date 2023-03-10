import type { NextFunction, Response } from "express";
import type { Error } from "mongoose";
import errorsMessage from "../../../errorsMessage.js";
import environment from "../../../loadEnvironments.js";
import jwt from "jsonwebtoken";
import type { CustomRequest, UserTokenPayload } from "../../types";

const auth = (req: CustomRequest, res: Response, next: NextFunction) => {
  const { jwtSecret } = environment;
  try {
    const authorization = req.header("Authorization");
    if (!authorization) {
      next(errorsMessage.authErrors.noTokenProvided);
      return;
    }

    if (!authorization.startsWith("Bearer")) {
      next(errorsMessage.authErrors.missingBearer);
      return;
    }

    const token: string = authorization.replace(/^Bearer\s*/, "");

    const { id } = jwt.verify(token, jwtSecret) as UserTokenPayload;

    req.userId = id;
    next();
  } catch (error: unknown) {
    next(errorsMessage.authErrors.invalidToken(error as Error));
  }
};

export default auth;
