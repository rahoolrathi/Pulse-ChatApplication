import Joi from 'joi';
import {MessageType} from "../utils/helper.util"
export const messageSchema = Joi.object({
otherId: Joi.string().required(),
  content: Joi.string().trim().min(1).max(5000).required(),
  messageType: Joi.string().valid(...Object.values(MessageType)).default(MessageType.TEXT),
  attachmentUrl: Joi.string().optional()
});


export const createGroupValidator = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  createdBy: Joi.string().required(),
  memberIds: Joi.array().items(Joi.string()).optional(),
});
