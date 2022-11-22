import type { Types } from "mongoose";

export interface BaseUser {
  username: string;
}
export interface UserRegisterCredentials extends BaseUser {
  password: string;
  email: string;
  alias: string;
}

export interface UserBd extends UserRegisterCredentials {
  _id: Types.ObjectId;
}
