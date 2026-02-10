import { User } from "../models/index.js";
import { BadRequestError } from "../utils/errorTemplates.js";
import { Op } from "sequelize";
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



export default {
    createNewUser,
    getOneUser,
};