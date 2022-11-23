import express from "express";
import { validate } from "express-validation";
import {
  loginUser,
  registerUser,
} from "../../controllers/userControllers/userControllers.js";
import {
  loginCredentialsSchema,
  registerCredentialsSchema,
} from "../../schemas/userSchemas.js";

// eslint-disable-next-line new-cap
const userRouter = express.Router();

userRouter.post(
  "/register",
  validate(registerCredentialsSchema, {}, { abortEarly: false }),
  registerUser
);

userRouter.post(
  "/login",
  validate(loginCredentialsSchema, {}, { abortEarly: false }),
  loginUser
);
export default userRouter;
