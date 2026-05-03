import { catchAsyncError } from "../middleware/CatchAsyncErrorMiddleWare.js";
import { UserModel } from "../models/usermodel.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import {v2 as cloudinary } from "cloudinary"

export const signup = catchAsyncError(async (req, res) => {

    const { fullName, email, password } = req.body;

    // Check required fields
    if (!fullName || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please provide all required fields"
        });
    }

    // Regex validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Invalid email format"
        });
    }

    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            success: false,
            message: "Password must include uppercase, lowercase, number, special character and be at least 8 characters long"
        });
    }

    // Check existing user
    const isEmailAlreadyUsed = await UserModel.findOne({ email });
    if (isEmailAlreadyUsed) {
        return res.status(400).json({
            success: false,
            message: "Email already exists"
        });
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await UserModel.create({
        fullName,
        email,
        password: hashPassword,
        avatar: {
            public_id: "",
            url: "",
        }
    });

    // generate token
    const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET_KEY,
        { expiresIn: process.env.JWT_EXPIRE }
    );

   
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "deveopnment"?true:false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000 
    };

    
    res
      .status(201)
      .cookie("token", token, options)
      .json({
          success: true,
          message: "User registered successfully",
          id:user._id,
          fullName:user.fullName,
          email:user.email,
          token
          
      });

});







export const signin = catchAsyncError(async (req, res) => {

    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please provide all credentials"
        });
    }

    // Validate email
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Invalid email format"
        });
    }

    // Find user
    const user = await UserModel.findOne({ email });
    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Invalid email or password"
        });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({
            success: false,
            message: "Invalid email or password"
        });
    }

    // Generate token
    const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET_KEY,
        { expiresIn: process.env.JWT_EXPIRE }
    );

    // Cookie options
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
       sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    };

    // Remove password before sending
    user.password = undefined;

    // Send response
    res
        .status(200)
        .cookie("token", token, options)
        .json({
            success: true,
            message: "Login successful",
            user,
            token
        });

});


export const signout = catchAsyncError(async (req, res) => {

    res
        .status(200)
        .cookie("token", "", {
            httpOnly: true,
            maxAge:0, // expire immediately
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development"?true:false
        })
        .json({
            success: true,
            message: "Logged out successfully"
        });

});


export const getuser=catchAsyncError(async(req,res)=>{
    const user=await UserModel.findById(req.user._id).select("-password")
    res.status(200).json({
            success:true,
            user
    })
})


export const updateProfile = catchAsyncError(async (req, res) => {
  const { fullName, email } = req.body;

  
  if (!fullName || !email || fullName.trim().length === 0 || email.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "FullName and Email can't be empty",
    });
  }

  
  const avatar = req?.files?.avatar;
  let cloudinaryResponse = {};

  if (avatar) {
    try {
      const oldAvaterPublicId = req.user?.avatar?.public_id;

      
      if (oldAvaterPublicId) {
        await cloudinary.uploader.destroy(oldAvaterPublicId);
      }

      cloudinaryResponse = await cloudinary.uploader.upload(
        avatar.tempFilePath,
        {
          folder: "TalkLoop ChatAPP",
          transformation: [
            { width: 300, height: 300, crop: "limit" },
            { quality: "auto" },
            { fetch_format: "auto" },
          ],
        }
      );
    } catch (e) {
      console.error("Cloudinary upload error: ", e);
      return res.status(500).json({
        success: false,
        message: "failed to upload avatar",
      });
    }
  }

  let data = {
    fullName,
    email,
  };

  
  if (
    avatar &&
    cloudinaryResponse?.public_id &&
    cloudinaryResponse?.secure_url
  ) {
    data.avatar = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
  }

 
  let user = await UserModel.findByIdAndUpdate(req.user._id, data, {
    returnDocument: "after",
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user,
  });
});