import { User } from '../models/users.models';
import { signupSchema,loginSchema } from '../validations/user.validation';
import { getInputType, hashPassword ,comparePassword} from '../utils/helper.util';
import { IUserAttributes } from '../types/user.types';
import { generateToken } from '../utils/helper.util';
import { ILoginInput } from '../types/user.types';


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
export const loginUser = async (input: ILoginInput) => {
  const { error, value } = loginSchema.validate(input);
  if (error) throw new Error(`Validation error: ${error.details[0].message}`);

  const { identifier, password } = value;

  let user;
  const inputType = getInputType(identifier);


  user = await User.findOne({ where: { [inputType]: identifier } });


  if (!user) {
    user = await User.findOne({ where: { username: identifier } });
  }

  if (!user) {
    throw new Error('User not found.');
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid password.');
  }

  const token = generateToken({ id: user.id });

  return { user, token };
};
