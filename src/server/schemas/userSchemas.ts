import { Joi } from "express-validation";

export const registerCredentialsSchema = {
  body: Joi.object({
    username: Joi.string().min(3).required(),
    password: Joi.string().min(3).required(),
    alias: Joi.string().min(2).required(),
    email: Joi.string()
      .min(3)
      .required()
      .regex(/[a-z0-9]+@[a-z]+.[a-z]{2,3}/),
  }),
};

export const loginCredentialsSchema = {
  body: Joi.object({
    password: Joi.string().min(3).required(),
    email: Joi.string()
      .min(3)
      .required()
      .regex(/[a-z0-9]+@[a-z]+.[a-z]{2,3}/),
  }),
};
