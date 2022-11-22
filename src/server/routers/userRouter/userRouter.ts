import express from "express";
import { registerUser } from "../../controllers/userControllers/userControllers.js";

// eslint-disable-next-line new-cap
const userRouter = express.Router();

userRouter.post("/register", registerUser);
export default userRouter;
