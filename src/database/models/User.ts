import { model, Schema } from "mongoose";

const schemaUser = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  alias: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

const User = model("User", schemaUser, "users");

export default User;
