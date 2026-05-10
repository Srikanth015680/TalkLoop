import express from "express"
import cookieParser from "cookie-parser"
import { config } from "dotenv"
import fileUpload from "express-fileupload"
import cors from "cors"
import userRouter from "./routes/userRoute.js"
import messageRouter from "./routes/messageRoute.js"
const app=express()
app.set("trust proxy", 1);
config({path:"./config/config.env"})

app.use(
  cors({
   origin: [
  "http://localhost:5173",
  "https://talk-loop-phi.vercel.app",
],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"./temp/"
    })
)


app.use("/api/v1/user",userRouter)
app.use("/api/v1/message",messageRouter)

export default app;

