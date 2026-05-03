import { catchAsyncError } from "../middleware/CatchAsyncErrorMiddleWare.js";
import { MessageModel } from "../models/messagemodel.js";
import { UserModel } from "../models/usermodel.js";
import {v2 as cloudinary } from "cloudinary"
import { getReciverSocketId,io } from "../utils/socket.js";






export const getAllUsers = catchAsyncError(async (req, res) => {
  const user = req.user;

  const filteredUser = await UserModel.find({
    _id: { $ne: user._id },
  }).select("-password");

  res.status(200).json({
    success: true,
    users: filteredUser,
  });
});

export const getMessages = catchAsyncError(async (req, res) => {
  const receiverId = req.params.id;
  const myId = req.user._id;

  const receiver = await UserModel.findById(receiverId);

  if (!receiver) {
    return res.status(400).json({
      success: false,
      message: "Receiver ID Invalid",
    });
  }

  const messages = await MessageModel.find({
    $or: [
      { senderId: myId, receiverId },
      { senderId: receiverId, receiverId: myId },
    ],
  }).sort({ createdAt: 1 });

  res.status(200).json({
    success: true,
    messages,
  });
});

export const sendMessage = catchAsyncError(async (req, res) => {
  const { text } = req.body;
  const media = req?.files?.media;
  const receiverId = req.params.id;
  const senderId = req.user._id;

  const receiver = await UserModel.findById(receiverId);

  if (!receiver) {
    return res.status(400).json({
      success: false,
      message: "Receiver ID Invalid",
    });
  }

  const sanitized = text?.trim() || "";

  if (!sanitized && !media) {
    return res.status(400).json({
      success: false,
      message: "Can't send empty message",
    });
  }

  let mediaUrl = "";

  if (media) {
    try {
      const uploadResponse = await cloudinary.uploader.upload(
        media.tempFilePath,
        {
          resource_type: "auto",
          folder: "TalkLoop ChatApp mediaFiles",
        }
      );

      mediaUrl = uploadResponse.secure_url;
    } catch (e) {
      console.error("Cloudinary upload error:", e);
      return res.status(500).json({
        success: false,
        message: "Failed to upload media",
      });
    }
  }

  const newMessage = await MessageModel.create({
    senderId,
    receiverId,
    text: sanitized,
    media: mediaUrl,
  });

  const receiverSocketId = getReciverSocketId(receiverId);

  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", newMessage);
  }

  res.status(201).json({
    success: true,
    newMessage,
  });
});



















