import type { RequestHandler } from "express";
import errorsMessage from "../../../errorsMessage";

export const endpointNotFound: RequestHandler = (req, res) => {
  res
    .status(errorsMessage.endpointNotFound.statusCode)
    .json({ error: errorsMessage.endpointNotFound.publicMessage });
};
