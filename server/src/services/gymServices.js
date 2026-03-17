import { Gym } from "../models/index.js";
import { BadRequestError, NotFoundError, ForbiddenError } from "../utils/errorTemplates.js";
import { User, sequelize } from "../models/index.js";
import { userService } from "./userServices.js";


const getGymById = async({ id }) => {
    const gym = await Gym.findByPk(id);
    if(!gym)throw new NotFoundError("Gym not found");

    return gym;
}

const getOneGym = async ({ slug }) => {
    if (!slug) throw new BadRequestError("Gym slug is required");
    const gym = await Gym.findOne({ where: { slug } });
    if (!gym) throw new NotFoundError("Gym not found");
    return gym;
}

const checkGymUniquess = async({ name, slug}) => {
    const existsBySlug = await Gym.findOne({ where: { slug }})
    const existsByName = await Gym.findOne({ where: { name }})

    if(existsByName || existsBySlug){ 
        throw new BadRequestError(`Gym already exists with this${
            existsBySlug ? 'dni' : 'email'
        } .`)
   }
}

const createGymAndAdmin = async({ gymData, adminData }) => {
    if (!gymData?.slug || !gymData?.name) throw new BadRequestError("Gym name and slug are required");
    await checkGymUniquess({ slug: gymData.slug, name: gymData.name });

    if (adminData?.email) {
        const exists = await User.findOne({ where: { email: adminData.email } });
        if (exists) throw new BadRequestError("Admin email is already registered.");
    }
    if (adminData?.dni) {
        const exists = await User.findOne({ where: { dni: adminData.dni } });
        if (exists) throw new BadRequestError("Admin dni is already registered.");
    }

    return await sequelize.transaction(async(t) => {
        const gym = await Gym.create({ ...gymData }, { transaction: t });
        const admin = await userService.createUser({ ...adminData, gymId: gym.id, role: "admin" }, t);
        return { gym, admin };
    })  
}

// Consultar luego si deberia buscar primero al gimnasio o directamente hacer el update como lo hacemos ahora.
const editGym = async({ gymId, gymNewData, userId }) => {
    if(!gymId || !gymNewData || !userId)throw new BadRequestError("Some props are missing. gymId, gymNewData and userId are required");
    
    const user = await userService.getUserById({ id: userId });
    if(user.role !== "admin" && user.gymId !== gymId)throw new ForbiddenError("User is not authorized to edit this gym");

    const gym = await Gym.findByPk(gymId);
    if (!gym) throw new NotFoundError("Gym not found");

    await gym.update(gymNewData);
    return gym;
}

const deactiveGym = async({ gymId }) => {
    if(!gymId)throw new BadRequestError("Gym ID is required");
    const gym = await getOneGym({ id: gymId, subscriptionStatus: "active" });

    await gym.update({ subscriptionStatus: "inactive" });
    return true;
}

export default {
    getGymById,
    getOneGym,
    checkGymUniquess,
    createGymAndAdmin,
    editGym,
    deactiveGym,
}