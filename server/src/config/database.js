import { Sequelize } from "sequelize";
const { DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME } = process.env;

const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`, { logging: false });


export default sequelize;