import environment from "../../../loadEnvironments.js";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import createDebug from "debug";
import chalk from "chalk";
import type CustomError from "../../../CustomError/CustomError.js";
import errorsMessage from "../../../errorsMessage.js";
import { ValidationError } from "express-validation";

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
  if (error instanceof ValidationError) {
    debug(
      chalk.red.bold(
        (error as ValidationError).details.body
          .map((error) => error.message)
          .join("\n")
      )
    );
    error.publicMessage = errorsMessage.validationError.publicMessage;
    error.statusCode = errorsMessage.validationError.statusCode;
  }

  const { publicMessage: message, status } = errorsMessage.defaultGeneralError;

  const statusCode = error.statusCode ?? status;
  const publicMessage = error.publicMessage || message;

  debug(chalk.red.bold(error.message));

  res.status(statusCode).json({ error: publicMessage });
};
