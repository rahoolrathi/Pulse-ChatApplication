import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import {GroupAttributes } from "../types/chat.types"
import GroupMember from './group-member.model';
type GroupCreationAttributes = Optional<GroupAttributes, 'id'>;

export class Group extends Model<GroupAttributes, GroupCreationAttributes>
  implements GroupAttributes {
  public id!: string;
  public name!: string;
  public description?: string | null;
  public createdBy!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public members?: GroupMember;
}

Group.init(
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4, 
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    createdBy: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'groups',
    timestamps: true
  }
);



export default Group;