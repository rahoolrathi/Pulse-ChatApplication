// models/group-member.model.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import {GroupMemberAttributes} from "../types/chat.types"
import {GroupMemberRole } from "../utils/helper.util"
type GroupMemberCreationAttributes = Optional<GroupMemberAttributes, 'joinedAt'>;

export class GroupMember extends Model<GroupMemberAttributes, GroupMemberCreationAttributes>
  implements GroupMemberAttributes {
  public groupId!: string;
  public userId!: string;
  public role!: GroupMemberRole;
  public readonly joinedAt!: Date;
}

GroupMember.init(
  {
    groupId: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
userId: { type: DataTypes.STRING, allowNull: false, primaryKey: true },

    role: { type: DataTypes.ENUM(...Object.values(GroupMemberRole)), defaultValue: GroupMemberRole.MEMBER },
    joinedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  },
  { sequelize, tableName: 'group_members', timestamps: false }
);



export default GroupMember;
