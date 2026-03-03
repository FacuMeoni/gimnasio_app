import Plan from "../models/Plan.js";
import { BadRequestError, NotFoundError } from "../utils/errorTemplates.js";

const createPlan = async({ planData, gymId, transaction = null }) => {
    const planExisted = await Plan.findOne({ where: { ...planData, gymId, isDeleted: false } });
    if(planExisted)throw new BadRequestError("Plan already exists");

    return await Plan.create({ ...planData, gymId }, { transaction });
}

const getOnePlanWhere = async(where, options = {}) => {
    const plan = await Plan.findOne({ where: { ...where }, ...options });
    if(!plan)throw new NotFoundError("Plan not found");

    return plan;
}

const getPlansWhere = async(where, options = {}) => {
    const plans = await Plan.findAll({ where: { ...where }, ...options });
    if(!plans)throw new NotFoundError("Plans not found");

    return plans;
}

const deletePlan = async(planId) => {
    const plan = await getOnePlanWhere({ id: planId });
    await plan.update({ isDeleted: true });
    return true;
}

const patchPlan = async(planId, planData) => {
    const plan = await getOnePlanWhere({ id: planId });
    await plan.update(planData);
    return plan;
}

export default { createPlan, getOnePlanWhere, getPlansWhere, deletePlan, patchPlan };
