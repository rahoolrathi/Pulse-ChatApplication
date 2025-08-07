import { User } from '../models/users.models';
import { signupSchema } from '../validations/user.validation';
import { getInputType, hashPassword } from '../utils/helper.util';
import { IUserAttributes } from '../types/user.types';

export const signupUser = async (input: Partial<IUserAttributes>) => {
  const { error, value } = signupSchema.validate(input);
  if (error) throw new Error(`Validation error: ${error.details[0].message}`);

  
  const inputKey = getInputType(value.email || value.phone_number!);
  const inputValue = value[inputKey];

  
  const existingUser = await User.findOne({ where: { [inputKey]: inputValue } });
  if (existingUser) {
    throw new Error(`${inputKey} already in use.`);
  }
  const existingUserByUsername = await User.findOne({ where: { username: value.username } });
  if (existingUserByUsername) {
    throw new Error(`Username "${value.username}" is already taken.`);
  }


  const hashedPassword = await hashPassword(value.password);


  const newUser = await User.create({
    ...value,
    password: hashedPassword,
  });

  return newUser;
};
