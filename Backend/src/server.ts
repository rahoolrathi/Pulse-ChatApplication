import dotenv from 'dotenv';
dotenv.config();
import app from './app';
import sequelize from './config/database'
const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected!");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Database connection error:", error);
    process.exit(1); 
  }
})();
