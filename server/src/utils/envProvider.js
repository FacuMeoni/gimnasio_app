process.loadEnvFile();
export const { 
    DB_USER, 
    DB_PASS, 
    DB_HOST, 
    DB_PORT, 
    DB_NAME, 
    PORT,
    SALT_ROUNDS = 10,
    JWT_SECRET,
    JWT_EXPIRES_IN
} = process.env;
