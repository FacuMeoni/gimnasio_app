process.loadEnvFile();
const { DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME, PORT } = process.env;

export { DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME, PORT };
