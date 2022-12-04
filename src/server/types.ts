import type { JwtPayload } from "jsonwebtoken";
import type { Request } from "express";
export interface CustomRequest extends Request {
  userId: string;
}

export interface ImageRequest extends CustomRequest {
  image: File;
  imageFileName: string;
  publicImageUrl: string;
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
  _id: string;
}

export interface UserTokenPayload extends JwtPayload {
  id: string;
  username: string;
  alias: string;
}

export interface TweetBody {
  author: string;
  description: string;
  dateOfCreation: string;
  visibilityOpen: boolean;
  category: string;
}
export interface TweetStructure extends TweetBody {
  id?: string;
  image: string;
  backupImage: string;
}
