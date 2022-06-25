import dotenv from "dotenv";
import path from "path";
var __dirname = path.resolve();
dotenv.config({
  path: path.resolve(__dirname, `${process.env.NODE_ENV}.env`),
});
export default {
  NODE_ENV: process.env.NODE_ENV || "production",
  HOST: process.env.HOST || "localhost",
  PORT: process.env.PORT || 3000,
  DBHOST: "localhost",
  DB: process.env.DB || "orders",
  DBUSERNAME: process.env.DBUSERNAME || "postgres",
  DBPWD: process.env.DBPWD || "abc123",
  DBPORT: 5432,
};
