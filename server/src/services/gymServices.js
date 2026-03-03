import { Gym, User } from "../models/index.js";
import sequelize from "../config/database.js";
import { BadRequestError, NotFoundError, ForbiddenError } from "../utils/errorTemplates.js";
import userServices from "./userServices.js";
import { Op } from "sequelize";


const getOneGym = async(where, options = {}) => {
    const gym = await Gym.findOne({ where: { ...where }, ...options });
    if(!gym)throw new NotFoundError("Gym not found");

    return gym;
}

const createGymAndAdmin = async({ gymData, adminData }) => {
    const gym = await Gym.findOne({ where: { slug: gymData.slug } });
    const admin = await User.findOne({ where: { [Op.or]: [{ email: adminData.email }, { dni: adminData.dni }] }}, { attributes: { exclude: ["password"] } });

    if(gym && admin)throw new BadRequestError("Gym and admin already exists");
    else if(gym)throw new BadRequestError("Gym already exists");
    else if(admin)throw new BadRequestError("Admin already exists");

    return await sequelize.transaction(async(t) => {
        const gym = await Gym.create({ ...gymData }, { transaction: t });
        const admin = await userServices.createUser({ ...adminData, gymId: gym.id, role: "admin" }, t);
        return { gym, admin };
    })  
}

const editGym = async({ gymId, gymNewData, userId }) => {
    if(!gymId || !gymNewData || !userId)throw new BadRequestError("Some props are missing. gymId, gymNewData and userId are required");
    
    const user = await userServices.getOneUser({ id: userId });
    if(user.role !== "admin" && user.gymId !== gymId)throw new ForbiddenError("User is not authorized to edit this gym");

    const updatedGym = await Gym.update(gymNewData, { where: { id: gymId } });
    return updatedGym;
}

const deactiveGym = async({ gymId }) => {
    if(!gymId)throw new BadRequestError("Gym ID is required");
    const gym = await getOneGym({ id: gymId, subscriptionStatus: "active" });

    await gym.update({ subscriptionStatus: "inactive" });
    return true;
}

export default {
    getOneGym,
    createGymAndAdmin,
    editGym,
    deactiveGym,
}