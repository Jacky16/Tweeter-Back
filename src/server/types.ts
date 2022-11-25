import type { Types } from "mongoose";
import type { JwtPayload } from "jsonwebtoken";
import type { Request } from "express";
export interface CustomRequest extends Request {
  userId: string;
}
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

export interface TweetStructure {
  id?: string;
  author: string;
  category: string;
  description: string;
  image: string;
  backupImage: string;
  dateOfCreation: string;
  visibilityOpen: boolean;
}
