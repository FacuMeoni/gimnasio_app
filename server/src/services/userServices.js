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

export const getOneUser = async(prop) => {
    if(!prop) throw new BadRequestError("Search property is missing");

    const user = await User.findOne({ where: prop });
    if(!user) throw new BadRequestError("User not found");

    return user;
};


export const createPartnerWithProfile = async({ userData, profileData }) => {
   return await sequelize.transaction(async(transaction) => {
      const newUser = await createNewUser(userData, transaction);

      await PartnerProfile.create({ ...profileData, userId: newUser.id }, { transaction});


      return newUser;
   })
}



export default {
    createNewUser,
    getOneUser,
    createPartnerWithProfile,
};