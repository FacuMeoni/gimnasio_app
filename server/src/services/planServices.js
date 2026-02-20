import Plan from "../models/Plan.js";
import { BadRequestError } from "../utils/errorTemplates.js";


const createPlan = async({ planData, gymId }) => {

    const existingPlan = await Plan.findOne({ where: { name: planData.name, gymId }})
    if(existingPlan) throw new BadRequestError("Plan already exists");
   
    const newPlan = await Plan.create({ ...planData, gymId });

    return newPlan;
}


const getPlanById = async(planId, gymId) => {
   
    const plan = await Plan.findOne({ where: { id: planId, gymId, isDeleted: false }});
    if(!plan) throw new BadRequestError("Plan not found");

    return plan
}


const getPlansByGym = async(gymId) => {

    const plans = await Plan.findAll({ where: { gymId, isActive: true, isDeleted: false }, order: [["price", "ASC"]] });
    if(!plans) throw new BadRequestError("Plans not found");

    return plans;
}

const deletePlan = async(planId, gymId) => {

    const plan = await Plan.findOne({ where: { id: planId, gymId }});
    if(!plan) throw new BadRequestError("Plan not found");

    await Plan.update({ isDeleted: true }, { where: { id: planId }});

    return true;
}


const patchPlan = async(planId, gymId, planData) => {
    const plan = await Plan.findOne({ where: { id: planId, gymId }});
    if(!plan) throw new BadRequestError("Plan not found");

    await Plan.update(planData, { where: { id: planId, gymId }});
    await plan.reload();

    return plan;
}


export default { createPlan, getPlanById, getPlansByGym, deletePlan, patchPlan };