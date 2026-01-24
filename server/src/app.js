import Express from "express";
import sequelize from "./config/database.js";


const app = Express();
const PORT = process.env.PORT || 3000;

async function main() {
    try {
        await sequelize.authenticate();
        console.log("Database authenticated successfully");

        await sequelize.sync({ force: true }); // force: true para eliminar las tablas existentes y crearlas de nuevo
        console.log("Database synchronized successfully");

        app.listen(PORT)
        console.log(`Server is running on port ${PORT}`);
    } catch (error) {
        console.error("Error starting the server:", error);
        process.exit(1);
    }
}

main();