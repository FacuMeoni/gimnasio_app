import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Subscription = sequelize.define("Subscription", {
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
    benefits: {
        type: DataTypes.JSONB,
        defaultValue: {
            maxPartners: 100,
            maxEmployees: 3,
            maxPlans: 3,
        },
    },
    billingCycle: {
        type: DataTypes.ENUM("monthly", "yearly"),
        allowNull: false,
        defaultValue: "monthly",
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM("active", "past_due", "cancelled", "trial"),
        allowNull: false,
        defaultValue: "trial",
    },
}, {
    tableName: "subscriptions",
    timestamps: false,
});

export default Subscription;