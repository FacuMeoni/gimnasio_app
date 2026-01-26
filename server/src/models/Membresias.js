import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Membresias = sequelize.define("membresias", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    fecha_inicio: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    fecha_vencimiento: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    precio: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    estado: {
        type: DataTypes.ENUM("activa", "inactiva"),
        allowNull: false,
        defaultValue: "activa",
    },
}, { timestamps : false });


export default Membresias;