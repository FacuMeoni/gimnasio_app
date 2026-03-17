import { User, PartnerProfile, Membership, sequelize, Plan } from "../models/index.js";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../utils/errorTemplates.js";
import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "../utils/envProvider.js";
import { Op } from "sequelize";

const createUser = async (userData, transaction = null) =>
    await User.create(
        { ...userData, password: await bcrypt.hash(userData.password, SALT_ROUNDS) },
        { transaction }
    );

const checkUserUniquess = async ({ email, dni, gymId }) => {
    const existsByEmail = await User.findOne({ where: { email, gymId } });
    const existsByDni = await User.findOne({ where: { gymId, dni } });
 
    if(existsByDni || existsByEmail) { 
         throw new BadRequestError(`User with this ${
             existsByDni ? 'dni' : 'email'
         } is already registered on this gym.`)
    }
}

const getUserById = async ({ id }) => {
    const user = await User.findByPk(id);
    if (!user) throw new NotFoundError("User not found");
    return user;
};

const createPartner = async ({ userData, profileData, membershipData }) => {
    await checkUserUniquess({ email: userData.email, dni: userData.dni, gymId: userData.gymId });

    const planExists = await Plan.findOne({ where: { id: membershipData.planId, gymId: userData.gymId }});
    if (!planExists) throw new BadRequestError("Invalid plan");

    return await sequelize.transaction(async (t) => {
        const newUser = await createUser(
            { ...userData, role: "partner", gymId: userData.gymId },
            t
        );

        const [profile, membership] = await Promise.all([
            PartnerProfile.create({ ...profileData, userId: newUser.id }, { transaction: t }),
            Membership.create({ ...membershipData, userId: newUser.id }, { transaction: t }),
        ]);

        return {
            user: newUser.get({ plain: true }),
            profile: profile.get({ plain: true }),
            membership: membership.get({ plain: true }),
        };
    });
};

const getPartnerById = async ({ userId, gymId }) => {
    const partner = await User.findOne({
        where: { id: userId, gymId, role: "partner" },
        attributes: { exclude: ["password"] },
        include: [
            { model: PartnerProfile, as: "profile" },
            { model: Membership, as: "membership", where: { status: "active" } },
        ],
    });

    if (!partner) throw new NotFoundError("Partner not found");
    return partner;
};

const getAllPartnersByGym = async ({ gymId }) => {
    const partners = await User.findAll({
        where: { gymId, role: "partner" },
        attributes: { exclude: "password" },
        include: [
            { model: PartnerProfile, as: "profile" },
            { model: Membership, as: "membership", where: { status: "active" } },
        ],
    });

    if (!partners) throw new NotFoundError("No partners found");
    return partners;
};

const getGymStaff = async ({ gymId }) => {
    const staff = await User.findAll({
        where: { gymId, role: { [Op.in]: ["admin", "employee"] } },
        attributes: { exclude: "password" },
    });

    if (!staff) throw new NotFoundError("No staff found");
    return staff;
};

const registerUser = async ({ userData }) => {
    await checkUserUniquess({ email: userData.email, dni: userData.dni, gymId: userData.gymId });
    return await createUser({ ...userData, role: "employee", gymId: userData.gymId });
};

const loginUser = async ({ email, password }) => {
    if (!email || !password) throw new BadRequestError("Credentials are missing.");

    const user = await User.findOne({
        where: { email, role: { [Op.in]: ["admin", "employee", "partner", "superadmin"] } },
    });
    if (!user) throw new UnauthorizedError("Invalid credentials, email or password are incorrect.");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedError("Invalid credentials, email or password are incorrect.");

    return user;
};

export const partnerService = { createPartner, getPartnerById, getAllPartnersByGym };
export const staffService = { registerUser, getGymStaff };
export const userService = { createUser, getUserById, loginUser };
