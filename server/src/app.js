import Express from "express";
import {sequelize} from "./models/index.js";
import cors from "cors";
import morgan from "morgan";

const app = Express();

app.use(Express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(Express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Hello World");
});

const PORT = process.env.PORT || 3000;

async function main() {
    try {
        await sequelize.authenticate();
        console.log("✅ Base de datos autenticada");

        await sequelize.sync({ force: false });
        console.log("✅ Base de datos y relaciones sincronizadas");

        app.listen(PORT)
        console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    } catch (error) {
        console.error("❌ Error al iniciar el sistema:", error);
    }
}

main();