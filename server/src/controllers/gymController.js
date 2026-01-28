import { Gym } from "../models/index.js";

export const registerGym = async (req, res) => {
    try {
        const { name, location, ownerId } = req.body;

        const gym = await Gym.create({
            name,
            location,
            ownerId,
        });

        return res.status(201).json({
            message: "Gym created successfully",
            gym,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error creating gym",
            error: error.message,
        });
    }
};
