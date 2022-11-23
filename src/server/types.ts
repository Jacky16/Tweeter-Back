import type { Types } from "mongoose";
import type { JwtPayload } from "jsonwebtoken";

export interface BaseUser {
  email: string;
}

export interface UserLoginCredentials extends BaseUser {
  password: string;
}
export interface UserRegisterCredentials extends BaseUser {
  username: string;

  password: string;
  alias: string;
}

export interface UserBd extends UserRegisterCredentials {
  _id: Types.ObjectId;
}

export interface UserTokenPayload extends JwtPayload {
  id: string;
  username: string;
  alias: string;
}
