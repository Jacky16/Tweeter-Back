import { Factory } from "fishery";
import { faker } from "@faker-js/faker";
import type {
  UserBd,
  UserLoginCredentials,
  UserRegisterCredentials,
} from "../server/types";
import mongoose from "mongoose";

const usersRegisterCredentialsFactory = (user?: UserRegisterCredentials) =>
  Factory.define<UserRegisterCredentials>(() => ({
    username: user?.username ?? faker.internet.userName(),
    password: user?.password ?? faker.internet.password(),
    email: user?.email ?? faker.internet.email(),
    alias: user?.alias ?? `@${faker.name.lastName()}`,
  }));

const usersDbFactory = (user?: UserBd) =>
  Factory.define<UserBd>(() => ({
    _id: user?._id ?? new mongoose.Types.ObjectId(),
    username: user?.username ?? faker.internet.userName(),
    password: user?.password ?? faker.internet.password(),
    email: user?.email ?? faker.internet.email(),
    alias: user?.alias ?? `@${faker.name.lastName()}`,
  }));

const usersLoginCredentialsFactory = (user?: UserLoginCredentials) =>
  Factory.define<UserLoginCredentials>(() => ({
    password: user?.password ?? faker.internet.password(),
    email: user?.email ?? faker.internet.email(),
  }));

export const getRandomUserBd = (user?: UserBd) => () =>
  usersDbFactory(user).build();

export const getRandomUserList = (listUser: number) => () =>
  usersDbFactory().buildList(listUser);

export const getRandomUserRegisterCredentials =
  (user?: UserRegisterCredentials) => () =>
    usersRegisterCredentialsFactory(user).build();

export const getRandomUserLoginCredentials =
  (user?: UserLoginCredentials) => () =>
    usersLoginCredentialsFactory(user).build();
