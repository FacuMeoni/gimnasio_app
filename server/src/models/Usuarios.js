import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Usuarios = sequelize.define("usuarios", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    nombre_completo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    contraseña: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    rol: {
        type: DataTypes.ENUM("superadmin", "admin", "usuario"),
        allowNull: false,
        defaultValue: "usuario",
    }
}, {
    timestamps: false,
});

export default Usuarios;