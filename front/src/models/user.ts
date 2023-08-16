import { Service } from './service'

export const defaultRole = {
  id: 0,
  name: "default",
};
export const defaultLanguage = {
  id: 0,
  name: "default",
};

type Role = {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
};
type Language = {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
};

export const defaultUser = {
  id: 0,
  lastname: '',
  firstname: '',
  email: '',
  function: '',
  username: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  service: undefined,
  roles: '',
  language: '',
  isResponsible: 0,
  permissions: [],
  groupes: [],
  isAlterateDate: false
}

type User = {
  id: number,
  lastname: string,
  firstname: string,
  email: string,
  function: string,
  url?: string,
  username: string,
  password?: string,
  createdAt: Date,
  updatedAt: Date,
  service?: Service,
  roles: string,
  language: string,
  isComityUser?: boolean,
  isResponsible: number,
  permissions: Array<{ id: number, id_user: number, id_permission: number, id_branch: number, id_category: number, id_dashboard: number }>,
  groupes: Array<{ id_groupe: number, id_user: number }>,
  isAlterateDate?: boolean
}


export interface UserData extends User{
    last_name?: string,
    first_name?: string
}

export interface UserWithToken extends User {
  accessToken: string;
}

export type { Language, Role, User };
