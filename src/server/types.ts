export interface BaseUser {
  username: string;
}
export interface UserRegisterCredentials extends BaseUser {
  password: string;
  email: string;
}
