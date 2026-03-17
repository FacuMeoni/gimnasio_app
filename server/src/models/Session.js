import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const session = sequelize.define("session", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    ipAddress: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    userAgent: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: "sessions",
    timestamps: true,
});

export default session;