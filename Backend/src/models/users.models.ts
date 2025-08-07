// models/user.model.ts

import { DataTypes, Model, Optional } from 'sequelize';
import  sequelize from '../config/database'; 
import { IUserAttributes } from '../types/user.types';

type UserCreationAttributes = Optional<IUserAttributes, 'id' | 'email' | 'phone_number' | 'status_description' | 'profile_picture' | 'is_verified'>;

export class User extends Model<IUserAttributes, UserCreationAttributes> implements IUserAttributes {
  public id!: number;
  public email?: string;
  public phone_number?: string;
  public display_name!: string;
  public username!: string;
  public password!: string;
  public status_description?: string;
  public profile_picture?: string;
  public is_verified?: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    display_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status_description: {
      type: DataTypes.STRING,
    },
    profile_picture: {
      type: DataTypes.STRING,
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
     tableName: '"Users"',
    modelName: 'User',
  }
);
