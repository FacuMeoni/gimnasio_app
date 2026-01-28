import Express from "express";
import {sequelize} from "./models/index.js";
import cors from "cors";
import morgan from "morgan";
import Routes from "./routes/index.js";
import { PORT } from "./utils/envProvider.js";

const app = Express();

app.use(Express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(Express.urlencoded({ extended: true }));

app.use("/api", Routes);

async function main() {
    try {
        await sequelize.authenticate();
        console.log("✅ Database authenticated");

        await sequelize.sync({ force: true });
        console.log("✅ Database and relations synced");

        app.listen(PORT);
        console.log(`🚀 Server running at http://localhost:${PORT}`);
    } catch (error) {
        console.error("❌ Error starting system:", error);
    }
}

main();