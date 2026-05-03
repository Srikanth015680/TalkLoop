import express from "express"
import{getAllUsers,getMessages,sendMessage}from "../controllers/messageController.js";
import { isAuthenticated } from "../middleware/userMiddleware.js";


const messageRouter = express.Router();

messageRouter.get("/user", isAuthenticated, getAllUsers);
messageRouter.get("/:id", isAuthenticated, getMessages);
messageRouter.post("/sent/:id", isAuthenticated, sendMessage);

export default messageRouter;

