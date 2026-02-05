import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const User = sequelize.define("User", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    fullName: {
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
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM("superadmin", "admin", "employee", "user"),
        allowNull: false,
        defaultValue: "user",
    },
    weight_history: {
        type: DataTypes.ARRAY(DataTypes.JSONB),
        allowNull: true,
        defaultValue: [],
    },
    height: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: null,
    },
    birth_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: null,
    },
    observations: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
    }, 
    dni: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
        unique: true,
    }, 
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    }
    }, {
        tableName: "users",
        timestamps: true,
    }
);

export default User;
