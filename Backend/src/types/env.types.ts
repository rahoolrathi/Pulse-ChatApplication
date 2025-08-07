import { Dialect } from 'sequelize';

export interface DatabaseConfig {
  DB_NAME: string;
  DB_USER: string;
  DB_PASS: string;
  DB_HOST: string;
  DB_DIALECT: Dialect;
}

export interface JwtEnvConfig {
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
   BCRYPT_SALT: string;
}