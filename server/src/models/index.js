import Gym from "./Gym.js";
import User from "./User.js";
import Membership from "./Membership.js";
import Plan from "./Plan.js";
import RefreshToken from "./refreshToken.js";
import sequelize from "../config/database.js";

User.hasMany(Gym, { foreignKey: "ownerId", as: "gyms" });
Gym.belongsTo(User, { foreignKey: "ownerId", as: "owner" });

Gym.hasMany(Plan, { foreignKey: "gymId" });
Plan.belongsTo(Gym, { foreignKey: "gymId" });

User.hasMany(Membership, { foreignKey: "userId" });
Membership.belongsTo(User, { foreignKey: "userId" });

Gym.hasMany(Membership, { foreignKey: "gymId" });
Membership.belongsTo(Gym, { foreignKey: "gymId" });

Plan.hasMany(Membership, { foreignKey: "planId" });
Membership.belongsTo(Plan, { foreignKey: "planId" });

User.hasMany(RefreshToken, { foreignKey: "userId", onDelete: "CASCADE" });
RefreshToken.belongsTo(User, { foreignKey: "userId" });

export { sequelize, Gym, User, Membership, Plan, RefreshToken };
