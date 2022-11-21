import express from "express";
import {
  endpointNotFound,
  generalError,
} from "./server/middleware/errors/error.js";

const app = express();
app.use(express.json());

app.use(endpointNotFound);
app.use(generalError);

export default app;
