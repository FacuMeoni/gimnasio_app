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
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    daysPerWeek: {
        type: DataTypes.ENUM("1", "2", "3", "7"),
        allowNull: false,
    },
}, {
    tableName: "plans",
    timestamps: false,
});

export default Plan;
