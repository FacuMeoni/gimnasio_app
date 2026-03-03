import { User, PartnerProfile, Membership } from "../models/index.js";
import { BadRequestError, NotFoundError } from "../utils/errorTemplates.js";
import sequelize from "../config/database.js";
import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "../utils/envProvider.js";

const createUser = async(userData, transaction = null ) => await User.create({ ...userData, password: await bcrypt.hash(userData.password, SALT_ROUNDS) }, { transaction });

/**
 * @params {Object} whereObject - The object with the property to search and value.
 * @params {object} options - The options for the findUser query.
 * @returns {Object} The user object.
 */

const getOneUser = async(where, options = {}) => {
    const user = await User.findOne({ where: { ...where }, ...options });
    if(!user)throw new NotFoundError("User not found");

    return user;   
}

const getAllUsersByGym = async({ gymId }) => { 
    if(!gymId)throw new BadRequestError("Gym ID is required");

    const users = await User.findAll({ where: { gymId }, attributes: { exclude: ["password"] } });
    if(!users)throw new NotFoundError("No users found");

    return users;
}

const getPartnerDetail = async({ userId, gymId }) => {

    if(!userId || !gymId)throw new BadRequestError("User ID and gym ID are required");

    const partner = await User.findOne({ where: { id: userId, gymId: gymId, role: "partner"}, attributes: { exclude: ["password"] }, include: [{ model: PartnerProfile, as: "profile"}, { model: Membership, as: "membership", where: { status: "active" }}]})

    if(!partner)throw new NotFoundError("Partner not found");

    return partner;
}

const getAllPartnersDetail = async({ gymId }) => {
    if(!gymId)throw new BadRequestError("Gym ID is required");

    const partners = await User.findAll({ where: { gymId, role: "partner"}, attributes: { exclude: "password" }, include: [{ model: PartnerProfile, as: "profile"}, { model: Membership, as: "membership", where: { status: "active"}}]})

    if(!partners)throw new NotFoundError("No partners found");

    return partners;
}

const onBoardPartner = async({ userData, profileData, membershipData }) => {

    const user = await User.findOne({ where: { dni: userData.dni, gymId: userData.gymId } });
    if(user) throw new BadRequestError("User already exists");

    return await sequelize.transaction(async(t) => {
       const newUser = await createUser({ ...userData, role: "partner", gymId: userData.gymId}, t);
       const [profile, membership] = await Promise.all([
            PartnerProfile.create({ ...profileData, userId: newUser.id }, { transaction: t }),
            Membership.create({ ...membershipData, userId: newUser.id }, { transaction: t }),
       ])
       
       return {
            user: newUser.get({ plain: true }),
            profile: profile.get({ plain: true }),
            membership: membership.get({ plain: true })
        };
    })

}

export default {
    createUser,
    getOneUser,
    getAllUsersByGym,
    getPartnerDetail,
    getAllPartnersDetail,
    onBoardPartner,
}