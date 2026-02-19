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
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    paymentCredentials: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {
            cash: { enabled: true, instructions: "" },
            transfer: { enabled: true, alias: "", cbu: "", holderName: "", holderDni: "" },
        },
    }, 
    subscriptionStatus: {
        type: DataTypes.ENUM("active", "inactive", "trial", "past_due", "cancelled"),
        allowNull: false,
        defaultValue: "trial",
    },
}, {
    tableName: "gyms",
    timestamps: false,
});

export default Gym;
