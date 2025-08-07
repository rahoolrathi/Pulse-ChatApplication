export interface IUserAttributes {
  id?: number;
  email?: string;
  phone_number?: string;
  display_name: string;
  username: string;
  password: string;
  status_desc?: string;
  profile_picture?: string;
  is_verified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}