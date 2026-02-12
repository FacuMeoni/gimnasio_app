import { Gym, User } from "../models/index.js";
import sequelize from "../config/database.js";
import { BadRequestError } from "../utils/errorTemplates.js";
import { Op } from "sequelize";
import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "../utils/envProvider.js";


const createGymAndUser = async({ gymData, adminData }) => {
    const existingGym = await Gym.findOne({ where: { name: gymData.name }});
    const userExists = await User.findOne({ where: { [Op.or]: [ { email: adminData.email }, { dni: adminData.dni } ] }});
    if(userExists && existingGym) throw new BadRequestError("User and gym already exists");
     else if(existingGym) throw new BadRequestError("Gym already exists");
        else if(userExists) throw new BadRequestError("User already exists");

    return await sequelize.transaction(async(transaction) => {

        const newGym = await Gym.create({ ...gymData }, { transaction });
        const owner = await User.create({ ...adminData, password: await bcrypt.hash(adminData.password, SALT_ROUNDS), role: "admin", gymId: newGym.id }, { transaction });

        return { gym: newGym, owner: owner };
   })
}

const getOneGym = async(prop) => {
    if (!prop || typeof prop !== 'object' || Object.keys(prop).length === 0) {
        throw new BadRequestError("Search property is missing, must be an object with at least one property.");
    }

    const gym = await Gym.findOne({ where: prop });
    if (!gym) throw new BadRequestError("Gym not found");

    return gym;
}


export default {
    createGymAndUser,
    getOneGym,
}