import express from "express";
import { validate } from "express-validation";
import { registerUser } from "../../controllers/userControllers/userControllers.js";
import { registerCredentialsSchema } from "../../schemas/userSchemas.js";

// eslint-disable-next-line new-cap
const userRouter = express.Router();

userRouter.post(
  "/register",
  validate(registerCredentialsSchema, {}, { abortEarly: false }),
  registerUser
);
export default userRouter;
