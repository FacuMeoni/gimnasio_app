import { User } from "../models/index.js";

export const registerUser = async (req, res) => {
    try {
        const { fullName, email, password, role } = req.body;

        const user = await User.create({
            fullName,
            email,
            password,
            role,
        });

        return res.status(201).json({
            message: "User created successfully",
            newUser: {
                fullName: user.fullName,
                email: user.email,
                id: user.id,
            },
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error creating user",
            error: error.message,
        });
    }
};
