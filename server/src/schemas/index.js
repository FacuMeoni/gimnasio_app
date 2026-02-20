import { gymSchema } from "./gymSchema.js";
import * as userSchemas from "./userSchema.js";
import { onBoardingSchema } from "./onBoardingSchema.js";
import { planSchema } from "./planSchema.js";

export default {
    gym: gymSchema,
    superAdmin: userSchemas.superAdminSchema,
    staff: userSchemas.staffSchema,
    partner: userSchemas.partnerSchema,
    onBoarding: onBoardingSchema,
    plan: planSchema,
}