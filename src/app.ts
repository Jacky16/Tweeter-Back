import cors from "cors";
import express from "express";
import morgan from "morgan";
import corsOptions from "./server/cors/corsOptions.js";
import auth from "./server/middleware/auth/auth.js";
import {
  endpointNotFound,
  generalError,
} from "./server/middleware/errors/error.js";
import tweetsRouter from "./server/routers/tweetsRouter/tweetsRouter.js";
import userRouter from "./server/routers/userRouter/userRouter.js";

const app = express();
app.disable("x-powered-by");
app.use("/assets", express.static("assets"));

app.use(cors(corsOptions));
app.use(express.json());

app.use(morgan("dev"));

app.use("/user", userRouter);
app.use("/tweets", auth, tweetsRouter);

app.use(endpointNotFound);
app.use(generalError);

export default app;
