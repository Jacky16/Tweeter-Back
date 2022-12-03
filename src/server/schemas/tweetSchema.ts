import { Joi } from "express-validation";
import categories from "../../categories.js";

const tweetSchema = {
  body: Joi.object({
    author: Joi.string().required(),
    category: Joi.string()
      .valid(...categories)
      .required(),
    visibilityOpen: Joi.boolean().required(),
    description: Joi.string().required().max(280),
  }),
};

export default tweetSchema;
