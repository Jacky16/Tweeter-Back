import { Joi } from "express-validation";

const tweetSchema = {
  body: Joi.object({
    author: Joi.string().required(),
    category: Joi.string()
      .valid("comedy", "sports", "science", "entertainment", "political")
      .required(),
    visibilityOpen: Joi.boolean().required(),
    description: Joi.string().required().max(280),
  }),
};

export default tweetSchema;
