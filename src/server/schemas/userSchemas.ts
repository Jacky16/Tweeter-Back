import { Joi } from "express-validation";

export const registerCredentialsSchema = {
  body: Joi.object({
    username: Joi.string().min(3).required(),
    password: Joi.string().min(3).required(),
    alias: Joi.string().min(2).required(),
    email: Joi.string().min(3).email().required(),
  }),
};

export const loginCredentialsSchema = {
  body: Joi.object({
    password: Joi.string().min(3).required(),
    email: Joi.string().min(3).email().required(),
  }),
};
