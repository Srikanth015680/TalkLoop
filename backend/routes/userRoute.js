import express from "express";
import { getuser, signin, signout, signup, updateProfile } from "../controllers/userController.js";
import { isAuthenticated } from "../middleware/userMiddleware.js";
const userRouter = express.Router();

userRouter.post("/sign-up", signup);
userRouter.post("/sign-in", signin);   
userRouter.get("/sign-out", signout);


userRouter.get("/me", isAuthenticated, getuser);
userRouter.put("/update-profile",isAuthenticated,  updateProfile);

export default userRouter;

// userMiddleware,