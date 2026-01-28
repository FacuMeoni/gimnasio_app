import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Gym = sequelize.define("Gym", {
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
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: "gyms",
    timestamps: false,
});

export default Gym;
