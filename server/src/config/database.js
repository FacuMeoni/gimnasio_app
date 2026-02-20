import { Sequelize } from "sequelize";
import { DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME } from "../utils/envProvider.js";

const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`, { logging: false, define: { underscored: true } });

export default sequelize;