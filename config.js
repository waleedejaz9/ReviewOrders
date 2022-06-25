import dotenv from "dotenv";
import path from "path";
var __dirname = path.resolve();
dotenv.config({ path: path.join(__dirname, `./.env.production`) });
export default {
  NODE_ENV: process.env.NODE_ENV || "production",
  HOST: process.env.HOST || "localhost",
  PORT: process.env.PORT || 3000,
  DB: process.env.DB || "orders",
  DBUSERNAME: process.env.DBUSERNAME || "postgres",
  DBPWD: process.env.DBPWD || "abc123",
  DBPORT: 5432,
};
