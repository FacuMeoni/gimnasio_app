import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Plan = sequelize.define("Plan", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    daysPerWeek: {
        type: DataTypes.ENUM("1", "2", "3", "4", "5", "6", "7"),
        allowNull: false,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    gymId: {
        type: DataTypes.UUID,
        defaultValue: null, 
        references: { model: "gyms", key: "id" },
    }
}, {
    tableName: "plans",
    timestamps: false,
});

export default Plan;
