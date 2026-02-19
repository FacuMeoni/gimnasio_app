import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const PartnerProfile = sequelize.define("PartnerProfile", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    weightHistory: {
        type: DataTypes.ARRAY(DataTypes.JSONB),
        allowNull: true,
        defaultValue: [],
        field: "weight_history",
    },
    height: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: null,
    },
    birthDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: null,
        field: "birth_date",
    },
    observations: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
    },
}, {
    tableName: "partner_profiles",
    timestamps: false,
    underscored: true,
});

export default PartnerProfile;