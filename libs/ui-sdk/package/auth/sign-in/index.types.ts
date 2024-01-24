export interface ISignInForm {
  username: string;
  password: string;
}

export type User = {
  id: string;
  displayName: string;
  roles: string[];
  permissions: { [key: string]: boolean }
}
