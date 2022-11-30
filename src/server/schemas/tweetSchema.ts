import { Joi } from "express-validation";

const tweetSchema = {
  body: Joi.object({
    author: Joi.string().required(),
    category: Joi.string().valid("comedy", "sports").required(),
    visibilityOpen: Joi.boolean().required(),
    description: Joi.string().required(),
  }),
};

export default tweetSchema;
