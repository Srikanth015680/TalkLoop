import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {   
        type: String,
        required: true,
        unique: true,     
        lowercase: true,  
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8     
    },
    avatar: {
        public_id: String,
        url: String
    }
}, { timestamps: true });

export const UserModel = mongoose.model("User", userSchema);