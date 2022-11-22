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
    userNotFound: new CustomError("User not found", "Invalid Credentials", 404),
  },

  usersError: {
    notFoundUsers: new CustomError("Not users found", "Not users found", 404),
  },
};

export default errorsMessage;
