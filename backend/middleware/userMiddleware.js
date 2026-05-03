import jwt from "jsonwebtoken"
import { UserModel } from "../models/usermodel.js";
import { catchAsyncError } from "./CatchAsyncErrorMiddleWare.js";

export const isAuthenticated = catchAsyncError(async (req, res, next) => {

    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized - No token"
        });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);



    if(!decoded){
        res.status(500).json({
            success:false,
            message:"Token verification failed.Please login again"
        })
    }





   
    const user = await UserModel.findById(decoded.id);

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "User not found"
        });
    }

   
    req.user = user;

    next();
});