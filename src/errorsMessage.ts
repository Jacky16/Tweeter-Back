import CustomError from "./CustomError/CustomError.js";

const errorsMessage = {
  defaultGeneralError: {
    status: 500,
    publicMessage: "Fatal error",
  },
  endpointNotFound: new CustomError(
    "Endpoint not found",
    "Endpoint not found",
    404
  ),
  registerUser: new CustomError(
    "Error on register",
    "User is already registered ",
    409
  ),
  validationError: new CustomError(
    "The details you provided don't meet the requirements",
    "The details you provided don't meet the requirements",
    500
  ),
  authErrors: {
    noTokenProvided: new CustomError(
      "No token provided",
      "No token provided",
      401
    ),
    missingBearer: new CustomError("Missing Bearer in token", "Bad token", 401),

    invalidToken: (error: Error) =>
      new CustomError(error.message, "Invalid token", 401),
  },
  loginErrors: {
    invalidPassword: new CustomError(
      "Invalid password",
      "Invalid Credentials",
      401
    ),
    userNotFound: new CustomError("User not found", "Invalid Credentials", 401),
  },

  usersError: {
    notFoundUsers: new CustomError("Not users found", "Not users found", 404),
  },
  tweet: {
    tweetNotfound: new CustomError("Tweet not found", "Tweet not found", 404),
  },
  tweets: {
    tweetsNotfound: new CustomError(
      "Tweets not found",
      "Tweets not found",
      404
    ),
    paginationRangeError: new CustomError(
      "Page is out of range",
      "Page is out of range",
      404
    ),
    categoryNotfound: new CustomError(
      "Category not found",
      "Category not found",
      404
    ),
    errorOnEdit: new CustomError(
      "Can not edit tweet if you are not the author",
      "Don't have permission to edit this item",
      403
    ),
  },
  images: {
    imageCompressionError: {
      publicMessage: "Error on compress image",
    },
    imageNotProvided: new CustomError(
      "Image not provided",
      "Image not provided",
      400
    ),
  },
};

export default errorsMessage;
