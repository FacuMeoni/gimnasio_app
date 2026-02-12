import { User, PartnerProfile } from "../models/index.js";
import { BadRequestError } from "../utils/errorTemplates.js";
import { Op } from "sequelize";
import sequelize from "../config/database.js";
import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "../utils/envProvider.js";


const createNewUser = async(userData, transaction = null ) => {
   const existingUser = await User.findOne({ 
        where:  {
            [Op.or]: [ { email: userData.email }, { dni: userData.dni }, { fullName: userData.fullName } ] 
        },
    });
   if(existingUser) throw new BadRequestError("User already exists");

   return await User.create({ ...userData, password: await bcrypt.hash(userData.password, SALT_ROUNDS) }, { transaction });
}

const createPartnerWithProfile = async({ userData, profileData }) => {
   return await sequelize.transaction(async(transaction) => {
      const newUser = await createNewUser(userData, transaction);

      await PartnerProfile.create({ ...profileData, userId: newUser.id }, { transaction});


      return newUser;
   })
}

const getOneUser = async(prop) => {
    if (!prop || typeof prop !== 'object' || Object.keys(prop).length === 0) {
        throw new BadRequestError("Search property is missing, must be an object with at least one property.");
    }

    const user = await User.findOne({ where: prop, attributes: { exclude: ["password"] } });
    if (!user) throw new BadRequestError("User not found");

    return user;
}

const getAllUsersByGym = async(gymId, role) => {
    const users = await User.findAll({ where: { gymId: gymId, role: role}, attributes: { exclude: ["password"] } });
    if (!users) throw new BadRequestError("Users not found");

    return users;    
}

export default {
    createNewUser,
    getOneUser,
    createPartnerWithProfile,
    getAllUsersByGym,
};