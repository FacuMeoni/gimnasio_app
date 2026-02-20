import planServices from "../../services/planServices.js";

const createPlan = async(req, res) => {

    const planData = req.body;
    const { gymId } = req.user;

    const plan = await planServices.createPlan({ planData, gymId });

    return res.status(201).json({
        status: "OK",
        data: plan,
    });
}


const getPlanById = async(req, res) => {
    const gymId = req.user.gymId;
    const planId = req.params.id;

    const plan = await planServices.getPlanById(planId, gymId);

    return res.status(200).json({
        status: "OK",
        data: plan,
    });
}

const getPlansByGym = async(req, res) => {
    const gymId = req.user.gymId;

    const plans = await planServices.getPlansByGym(gymId);

    return res.status(200).json({
        status: "OK",
        data: plans,
    });
}


export default { createPlan, getPlanById, getPlansByGym };