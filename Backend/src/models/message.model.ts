import { DataTypes, Model, Optional,Association  } from 'sequelize';
import sequelize from '../config/database';
import { MessageType } from '../utils/helper.util';
import {MessageAttributes} from "../types/chat.types"
import { User } from './users.models';
type MessageCreationAttributes = Optional<MessageAttributes, 'id'>;

export class Message
  extends Model<MessageAttributes, MessageCreationAttributes>
  implements MessageAttributes 
{
  public id!: string;
  public senderId!: string;
  public recipientId!: string;
  public groupId!:string;
  public messageTxt?: string;
  public messageType!: MessageType;
  public attachmentUrl?: string;
  public sentAt?: Date;
  public updatedAt?: Date;
  
  public senderUser?: User;
  public recipientUser?: User;

   public static associations: {
    senderUser: Association<Message, User>;
    recipientUser: Association<Message, User>;
  };
}

Message.init(
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    senderId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    recipientId: {
     type: DataTypes.STRING,
      allowNull: true,
    },
    groupId:{
       type: DataTypes.STRING,
      allowNull: true,
    },
    messageTxt: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    messageType: {
      type: DataTypes.ENUM(...Object.values(MessageType)),
      allowNull: false,
    },
    attachmentUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sentAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'messages',
    timestamps: true,
    updatedAt: 'updatedAt',
    createdAt: 'sentAt',
  }
);

export default Message;
