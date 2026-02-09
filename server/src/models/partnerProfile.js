import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const PartnerProfile = sequelize.define("PartnerProfile", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
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
}, {
    tableName: "partner_profiles",
    timestamps: false,
});

export default PartnerProfile;