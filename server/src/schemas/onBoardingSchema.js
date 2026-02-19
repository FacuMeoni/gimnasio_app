import { z } from "zod";
import { gymSchema } from "./gymSchema.js";
import { staffSchema } from "./userSchema.js";

export const onBoardingSchema = z.object({
    gymData: gymSchema,
    staffData: staffSchema,
});