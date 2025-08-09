import { Op } from 'sequelize';
import { Group, GroupMember, User, Message } from '../models';
import { GroupMemberRole, RoomType } from '../utils/helper.util'; 
import { redisClient } from '../utils/redis.util';
import { messageSchema, createGroupValidator } from "../validations/chat.validations"
import {
  SaveMessageData,
  MessageResponse,
  CreateGroupData,
  GetMessagesResponse
} from '../types/chat.types';

export class ChatService {

  static async saveMessage(messageData: SaveMessageData) {
    const { error, value } = messageSchema.validate({
      otherId: messageData.otherId,
      content: messageData.content,
      messageType: messageData.messageType,
      attachmentUrl: messageData.attachmentUrl
    });

    if (error) {
      throw new Error(error.details[0].message);
    }
    const sender = await User.findByPk(messageData.senderId, {
      attributes: ['id', 'display_name', 'profile_picture'],
    });
    if (!sender) {
      throw new Error('sender not found');
    }

    if (messageData.roomtype == RoomType.PRIVATE) {
      const receiver = await User.findByPk(value.otherId);
      if (!receiver) {
        throw new Error('Receiver not found');
      }
      const message = await Message.create({
        senderId: messageData.senderId,
        recipientId: value.otherId,
        messageTxt: value.content,
        messageType: value.messageType,
        attachmentUrl: value?.attachmentUrl,

      });
      const messageResponse = {
        id: message.id,
        content: message.messageTxt || '',
        senderId: message.senderId,
        recipientId: message.recipientId,
        messageType: message.messageType,
        attachmentUrl: message.attachmentUrl,
        sentAt: message.sentAt!,
        sender: {
          id: sender?.id,
          display_name: sender?.display_name,
          profile_picture: sender?.profile_picture
        }

      };
      await this.cacheMessage(messageResponse);
      return messageResponse;

    }
    else if (messageData.roomtype === RoomType.GROUP) {


      const isMember = await GroupMember.findOne({
        where: { groupId: value.otherId, userId: messageData.senderId },
      });
      if (!isMember) throw new Error("Sender is not a member of the group");

      const message = await Message.create({
        senderId: messageData.senderId,
        groupId: value.otherId,
        messageTxt: value.content,
        messageType: value.messageType,
        attachmentUrl: value?.attachmentUrl,
      });

      const group = await Group.findByPk(value.otherId, {
        attributes: ['id', 'name', 'description'],
      });
      const messageResponse = {
        id: message.id,
        content: message.messageTxt || '',
        senderId: message.senderId,
        groupId: message.groupId,
        messageType: message.messageType,
        attachmentUrl: message.attachmentUrl,
        sentAt: message.sentAt!,
        sender: {
          id: sender.id,
          display_name: sender.display_name,
          profile_picture: sender.profile_picture,
        },
        group: group
          ? {
            id: group.id,
            name: group.name,
            description: group.description === null ? undefined : group.description,
          }
          : undefined,
      };

      await this.cacheMessage(messageResponse);
      return messageResponse;
    }
    throw new Error("invalid room type")

  }


  static async cacheMessage(message: MessageResponse): Promise<void> {
    try {
      const messageKey = `message:${message.id}`;
      await redisClient.setex(messageKey, 86400, JSON.stringify(message));

      let conversationKey: string | undefined;

      if (message.recipientId) {
        conversationKey = this.getPrivateConversationKey(message.senderId, message.recipientId);
      } else if (message.groupId) {
        conversationKey = `groupMessages:${message.groupId}`;
      }

      if (conversationKey) {
        await redisClient.lpush(conversationKey, JSON.stringify(message));
        await redisClient.expire(conversationKey, 86400);
        await redisClient.ltrim(conversationKey, 0, 99);
      }
    } catch (error) {
      console.error('Error caching message:', error);
    }
  }




static async getUserGroupChatBoxList(currentUserId: string) {
  try {
    
    const userGroups = await GroupMember.findAll({
      where: { userId: currentUserId }
    });

    if (userGroups.length === 0) {
      return {
        success: true,
        groups: [],
        totalCount: 0
      };
    }

    // Get group IDs
    const groupIds = userGroups.map(membership => membership.groupId);

    // Fetch group details separately
    const groups = await Group.findAll({
      where: { id: groupIds },
      attributes: ['id', 'name', 'description', 'createdBy']
    });

    // Format the response
    const groupChatBoxList = userGroups.map(membership => {
      const group = groups.find(g => g.id === membership.groupId);
      return {
        groupId: membership.groupId,
        group: {
          id: group?.id,
          name: group?.name,
          description: group?.description,
          createdBy: group?.createdBy
        },
        userRole: membership.role
      };
    });

    return {
      success: true,
      groups: groupChatBoxList,
      totalCount: groupChatBoxList.length
    };

  } catch (error) {
    console.error('Error getting user group chat boxes:', error);
    throw error;
  }
}
  static async getPrivateChatBoxList(currentUserId: string) {
    try {

      const messages = await Message.findAll({
        where: {
          [Op.or]: [
            { senderId: currentUserId },
            { recipientId: currentUserId }
          ],
          groupId: null
        } as any,
        attributes: ['senderId', 'recipientId'],
        raw: true
      });


      const partnerIds = new Set<string>();
      messages.forEach(message => {
  const partnerId = message.senderId === currentUserId
    ? message.recipientId
    : message.senderId;

  if (partnerId && partnerId !== currentUserId) {
    partnerIds.add(partnerId);
  }
});


      const partnerIdsArray = Array.from(partnerIds);

      if (partnerIdsArray.length === 0) {
        return {
          success: true,
          conversations: [],
          totalCount: 0
        };
      }

      const partners = await User.findAll({
        where: { id: partnerIdsArray },
        attributes: ['id', 'display_name', 'profile_picture']
      });


      const conversationList = partnerIdsArray.map(partnerId => {
        const partner = partners.find(p => p.id === partnerId);
        return {
          partnerId: partnerId,
          partner: {
            id: partner!.id,
            display_name: partner!.display_name,
            profile_picture: partner!.profile_picture,
          }
        };
      });

      return {
        success: true,
        conversations: conversationList,
        totalCount: conversationList.length
      };

    } catch (error) {
      console.error('Error getting user private conversations:', error);
      throw error;
    }
  }
  static getPrivateConversationKey(userId1: string, userId2: string): string {
    const sortedIds = [userId1, userId2].sort();
    return `private_messages:${sortedIds[0]}_${sortedIds[1]}`;
  }


  static async getPrivateMessages(
    currentUserId: string,
    otherUserId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<GetMessagesResponse> {
    try {


      const receiver = await User.findByPk(otherUserId);

      if (!receiver) {
        throw new Error('Receiver not found');
      }
      const conversationKey = this.getPrivateConversationKey(currentUserId, otherUserId);
      const cachedMessages = await redisClient.lrange(conversationKey, 0, limit - 1);

      if (cachedMessages.length > 0) {
        const messages = cachedMessages.map(msg => JSON.parse(msg)).reverse();
        return {
          messages,
          fromCache: true,
          hasMore: cachedMessages.length === limit
        };
      }


      const offset = (page - 1) * limit;
      const messages = await Message.findAll({
        where: {
          [Op.or]: [
            { senderId: currentUserId, recipientId: otherUserId },
            { senderId: otherUserId, recipientId: currentUserId }
          ]
        },
        include: [
          {
            model: User,
            as: 'senderUser',
            attributes: ['id', 'username', 'profile_picture']
          }
        ],
        order: [['sentAt', 'DESC']],
        limit,
        offset
      });


      if (messages.length > 0) {
        const messagesToCache = messages.map(msg => JSON.stringify({
          id: msg.id,
          content: msg.messageTxt,
          senderId: msg.senderId,
          recipientId: msg.recipientId,
          messageType: msg.messageType,
          attachmentUrl: msg.attachmentUrl,
          sentAt: msg.sentAt,
          sender: msg.senderUser
        }));

        await redisClient.rpush(conversationKey, ...messagesToCache);
        await redisClient.expire(conversationKey, 86400);
      }

      const formattedMessages = messages.map(msg => ({
        id: msg.id,
        content: msg.messageTxt || '',
        senderId: msg.senderId,
        recipientId: msg.recipientId,
        messageType: msg.messageType,
        attachmentUrl: msg.attachmentUrl,
        sentAt: msg.sentAt!,
        sender: msg.senderUser
      })).reverse();

      return {
        messages: formattedMessages,
        fromCache: false,
        hasMore: messages.length === limit
      };
    } catch (error) {
      console.error('Error getting private messages:', error);
      throw error;
    }
  }

  static async getUserById(userId: string) {
    try {
      return await User.findByPk(userId, {
        attributes: ['id']
      });
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  // Add this method to your ChatService class

static async getGroupMessages(
  groupId: string,
  page: number = 1,
  limit: number = 50
): Promise<GetMessagesResponse> {
  try {
    // Try to get from Redis cache first
    const conversationKey = `groupMessages:${groupId}`;
    const cachedMessages = await redisClient.lrange(conversationKey, 0, limit - 1);

    if (cachedMessages.length > 0) {
      const messages = cachedMessages.map(msg => JSON.parse(msg)).reverse();
      return {
        messages,
        fromCache: true,
        hasMore: cachedMessages.length === limit
      };
    }

    // Fallback to database
    const offset = (page - 1) * limit;
    const messages = await Message.findAll({
      where: {
        groupId: groupId
      } as any,
      include: [
        {
          model: User,
          as: 'senderUser',
          attributes: ['id', 'display_name', 'profile_picture']
        }
      ],
      order: [['sentAt', 'DESC']],
      limit,
      offset
    });

    // Cache messages if found
    if (messages.length > 0) {
      const messagesToCache = messages.map(msg => JSON.stringify({
        id: msg.id,
        content: msg.messageTxt,
        senderId: msg.senderId,
        groupId: msg.groupId,
        messageType: msg.messageType,
        attachmentUrl: msg.attachmentUrl,
        sentAt: msg.sentAt,
        sender: msg.senderUser
      }));

      await redisClient.rpush(conversationKey, ...messagesToCache);
      await redisClient.expire(conversationKey, 86400);
    }

    // Format messages
    const formattedMessages = messages.map(msg => ({
      id: msg.id,
      content: msg.messageTxt || '',
      senderId: msg.senderId,
      groupId: msg.groupId,
      messageType: msg.messageType,
      attachmentUrl: msg.attachmentUrl,
      sentAt: msg.sentAt!,
      sender: msg.senderUser
    })).reverse();

    return {
      messages: formattedMessages,
      fromCache: false,
      hasMore: messages.length === limit
    };

  } catch (error) {
    console.error('Error getting group messages:', error);
    throw error;
  }
}
  static async createGroup(groupData: CreateGroupData) {
    try {

      const { error, value } = createGroupValidator.validate(groupData);
      if (error) {
        throw new Error(error.details[0].message);
      }

      const group = await Group.create({
        name: value.name,
        description: value.description || '',
        createdBy: value.createdBy
      });


      await GroupMember.create({
        groupId: group.id,
        userId: String(groupData.createdBy),
        role: GroupMemberRole.ADMIN
      });


      if (groupData.memberIds && groupData.memberIds.length > 0) {
        const filteredMemberIds = groupData.memberIds.filter(id => id !== String(groupData.createdBy));

        const existingUsers = await User.findAll({
          where: { id: filteredMemberIds },
          attributes: ['id'],
        });

        const existingUserIds = existingUsers.map(user => user.id);


        const missingUserIds = filteredMemberIds.filter(id => !existingUserIds.includes(id));

        if (missingUserIds.length > 0) {
          throw new Error(`Users not found with IDs: ${missingUserIds.join(', ')}`);
        }

        const memberPromises = existingUserIds.map(userId =>
          GroupMember.create({
            groupId: group.id,
            userId: userId,
            role: GroupMemberRole.MEMBER,
          }).catch(err => {
            console.error(`Error adding member ${userId}:`, err);
            return null;
          })
        );

        await Promise.allSettled(memberPromises);
      }

      return await this.getGroupWithMembers(group.id);
    } catch (error) {
      console.error('Error creating group:', error);
      throw error;
    }
  }
 
 

  static async getGroupWithMembers(groupId: string) {
    try {
      return await Group.findByPk(groupId, {
        attributes: ['id', 'name', 'description', 'createdBy', 'createdAt'],
        include: [
          {
            model: GroupMember,
            as: 'members',
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['id', 'display_name', 'profile_picture']
              }
            ]
          }
        ]
      });
    } catch (error) {
      console.error('Error getting group with members:', error);
      throw error;
    }
  }





  static async getUserGroups(userId: string) {
    try {
      return await GroupMember.findAll({
        where: { userId: userId },
        attributes: ['groupId'],
        include: [
          {
            model: Group,
            as: 'group',
            attributes: ['id', 'name']
          }
        ]
      });
    } catch (error) {
      console.error('Error getting user groups:', error);
      throw error;
    }
  }


  // Clean up expired messages from Redis (can be called by a cron job)
  static async cleanupExpiredMessages(): Promise<void> {
    try {
      // This would be implemented based on your specific Redis setup
      // For now, Redis TTL handles the cleanup automatically
      console.log('Redis TTL handles message cleanup automatically');
    } catch (error) {
      console.error('Error cleaning up expired messages:', error);
    }
  }
}