//get profile
//get all profiles
//edit profile
//logout
import { User } from '../models/users.models'
import { EditProfileSchema } from '../validations/user.validation';
import { IEditUserAttributes } from '../types/user.types';
import { Op } from 'sequelize';

export const getProfile = async (userId: string) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error('User not found');
  return user;
};



export const editUserProfile = async (userId: string, input: IEditUserAttributes) => {
 
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const { error, value } = EditProfileSchema.validate(input);
  if (error) {
    throw new Error(error.details[0].message);
  }
   console.log(value)

  if (value.email) {
    const existingEmail = await User.findOne({
      where: {
        email: value.email,
        id: { [Op.ne]: userId },
      },
    });
    if (existingEmail) {
      throw new Error('Email already exists');
    }
  }


  if (value.phone_number) {
    const existingPhone = await User.findOne({
      where: {
        phone_number: value.phone_number,
        id: { [Op.ne]: userId },
      },
    });
    if (existingPhone) {
      throw new Error('Phone number already exists');
    }
  }

 
  await user.update(value);


  return user;
};

