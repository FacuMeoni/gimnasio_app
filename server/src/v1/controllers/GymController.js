import { Gym } from "../../models/index.js";
import { BadRequestError } from "../../utils/errorTemplates.js";


export const createGym = async(req, res) => {
    const { name, location, ownerId } = req.body;

    if(!name || !location || !ownerId) throw new BadRequestError("All fields are required");

    const existingGym = await Gym.findOne({ where: { name } });
    if(existingGym) throw new BadRequestError("Gym already exists");

    const gym = await Gym.create({ name, location, ownerId });

    return res.status(201).json({
        message: "Gym created successfully",
        data: { gym },
    });
}

