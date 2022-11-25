import cors from "cors";
import express from "express";
import morgan from "morgan";
import auth from "./server/middleware/auth/auth.js";
import {
  endpointNotFound,
  generalError,
} from "./server/middleware/errors/error.js";
import tweetsRouter from "./server/routers/tweetsRouter/tweetsRouter.js";
import userRouter from "./server/routers/userRouter/userRouter.js";

const app = express();
app.use(express.json());

app.use(morgan("dev"));

app.use("/user", cors(), userRouter);
app.use("/tweets", cors(), auth, tweetsRouter);

app.use(endpointNotFound);
app.use(generalError);

export default app;
