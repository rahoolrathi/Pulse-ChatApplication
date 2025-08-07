import { Sequelize, Dialect } from 'sequelize';
import { DatabaseConfig } from '../types/env.types';
import { getEnvVar } from '../utils/helper.util'; 

const DB_CONFIG: DatabaseConfig = {
  DB_NAME: getEnvVar('DB_NAME'),
  DB_USER: getEnvVar('DB_USER'),
  DB_PASS: getEnvVar('DB_PASS'),
  DB_HOST: getEnvVar('DB_HOST'),
  DB_DIALECT: getEnvVar('DB_DIALECT') as Dialect,
};

const sequelize = new Sequelize(
  DB_CONFIG.DB_NAME,
  DB_CONFIG.DB_USER,
  DB_CONFIG.DB_PASS,
  {
    host: DB_CONFIG.DB_HOST,
    dialect: DB_CONFIG.DB_DIALECT,
  }
);

export default sequelize;
