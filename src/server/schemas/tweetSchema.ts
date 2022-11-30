import { Joi } from "express-validation";

const tweetSchema = {
  body: Joi.object({
    author: Joi.string().required(),
    category: Joi.string().valid("comedy", "sports").required(),
    visibilityOpen: Joi.boolean().required(),
    description: Joi.string().required(),
    dateOfCreation: Joi.date().required(),
  }),
};

export default tweetSchema;
