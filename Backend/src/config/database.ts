import { Sequelize} from 'sequelize';
import { DB_CONFIG } from '../utils/helper.util'; 



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
