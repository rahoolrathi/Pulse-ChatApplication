import { User } from './users.models';
import { Group } from './group.model';
import { GroupMember } from './group-member.model';
import { Message } from './message.model';

// Define associations here:
Group.hasMany(GroupMember, { foreignKey: 'groupId', as: 'members' });
GroupMember.belongsTo(Group, { foreignKey: 'groupId', as: 'group' });

GroupMember.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(GroupMember, { foreignKey: 'userId', as: 'groupMemberships' });

User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
User.hasMany(Message, { foreignKey: 'recipientId', as: 'receivedMessages' });

Message.belongsTo(User, { foreignKey: 'senderId', as: 'senderUser' });
Message.belongsTo(User, { foreignKey: 'recipientId', as: 'recipientUser' });

export { User, Group, GroupMember, Message };
