export interface IUserAttributes {
  id?: number;
  email?: string;
  phone_number?: string;
  display_name: string;
  username: string;
  password: string;
  status_description?: string;
  profile_picture?: string;
  is_verified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ILoginInput {
  identifier: string;
  password: string;
}

export interface IEditUserAttributes {
  email?: string;
  phone_number?: string;
  status_description?: string;
  profile_picture?: string;
}
