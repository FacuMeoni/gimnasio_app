import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Membership = sequelize.define("Membership", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    expirationDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM("active", "inactive"),
        allowNull: false,
        defaultValue: "active",
    },
}, {
    tableName: "memberships",
    timestamps: false,
});

export default Membership;
