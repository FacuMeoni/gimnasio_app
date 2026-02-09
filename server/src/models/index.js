import Gym from "./Gym.js";
import User from "./User.js";
import Membership from "./Membership.js";
import Plan from "./Plan.js";
import RefreshToken from "./refreshToken.js";
import Subscription from "./Subscriptions.js";
import PartnerProfile from "./partnerProfile.js";
import sequelize from "../config/database.js";


Gym.hasMany(User, { foreignKey: "gymId", as: "users" });
User.belongsTo(Gym, { foreignKey: "gymId" });

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

User.hasOne(PartnerProfile, { foreignKey: "userId", onDelete: "CASCADE" });
PartnerProfile.belongsTo(User, { foreignKey: "userId" });

Gym.hasOne(Subscription, { foreignKey: "gymId" });
Subscription.belongsTo(Gym, { foreignKey: "gymId" });

export { sequelize, Gym, User, Membership, Plan, RefreshToken, Subscription };
