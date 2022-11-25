import { Factory } from "fishery";
import { faker } from "@faker-js/faker";
import type {
  UserBd,
  UserLoginCredentials,
  UserRegisterCredentials,
} from "../server/types";

const usersRegisterCredentialsFactory = Factory.define<UserRegisterCredentials>(
  () => ({
    username: faker.internet.userName(),
    password: faker.internet.password(),
    email: faker.internet.email(),
    alias: faker.name.lastName(),
  })
);

const usersDbFactory = Factory.define<UserBd>(() => ({
  _id: faker.database.mongodbObjectId(),
  username: faker.internet.userName(),
  password: faker.internet.password(),
  email: faker.internet.email(),
  alias: faker.name.lastName(),
}));

const usersLoginCredentialsFactory = Factory.define<UserLoginCredentials>(
  () => ({
    password: faker.internet.password(),
    email: faker.internet.email(),
  })
);

export const getRandomUserBd = (user?: UserBd) => usersDbFactory.build(user);

export const getRandomUserRegisterCredentials = (
  user?: UserRegisterCredentials
) => usersRegisterCredentialsFactory.build(user);

export const getRandomUserLoginCredentials = (user?: UserLoginCredentials) =>
  usersLoginCredentialsFactory.build(user);
