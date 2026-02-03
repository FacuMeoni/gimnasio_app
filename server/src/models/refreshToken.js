import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const RefreshToken = sequelize.define("RefreshToken", {
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
    tableName: "refresh_tokens",
    timestamps: true,
});

export default RefreshToken;