import environment from "../../../loadEnvironments.js";
import type { NextFunction, RequestHandler, Response } from "express";
import errorsMessage from "../../../errorsMessage";
import createDebug from "debug";
import chalk from "chalk";
import type CustomError from "../../../CustomError/CustomError.js";

const debug = createDebug(`${environment.debug}server`);

export const endpointNotFound: RequestHandler = (req, res) => {
  res
    .status(errorsMessage.endpointNotFound.statusCode)
    .json({ error: errorsMessage.endpointNotFound.publicMessage });
};

export const generalError = (
  error: CustomError,
  req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars
  next: NextFunction
) => {
  const { publicMessage: message, status } = errorsMessage.defaultGeneralError;

  const statusCode = error.statusCode ?? status;
  const publicMessage = error.publicMessage || message;

  debug(chalk.red.bold(error.message));
  res.status(statusCode).json({ error: publicMessage });
};
