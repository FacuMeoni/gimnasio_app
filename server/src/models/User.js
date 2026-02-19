import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const User = sequelize.define("User", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM("superadmin", "admin", "employee", "partner"),
        allowNull: false,
        defaultValue: "partner",
    },
    gymId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: "gyms",
            key: "id",
        },
        validate: {
            isRequiredIfNoSuperAdmin(value){
                if(this.role !== "superadmin" && !value) throw new Error("Gym ID is required");
            }
        }
    },
    dni: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
        unique: true,
    }, 
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    }
    }, {
        tableName: "users",
        timestamps: true,
    }
);

export default User;
