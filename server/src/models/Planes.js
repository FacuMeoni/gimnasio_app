import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Planes = sequelize.define("planes", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    }, 
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.TEXT,
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    dias_x_semana: {
        type: DataTypes.ENUM("1", "2", "3", "7"),
        allowNull: false,
    },
}, { timestamps : false });

export default Planes;