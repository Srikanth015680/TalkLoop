import app from "./app.js"
import {v2 as cloudinary} from "cloudinary"
import { dbConnection } from "./database/db.js";

import http from "http"
import { initSocket } from "./utils/socket.js";


cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})



const server=http.createServer(app);
initSocket(server);



const main = async () => {
  try {
    await dbConnection();
    server.listen(process.env.PORT_NO, () => {
      console.log(`Server running on ${process.env.PORT_NO}`);
    });
  } catch (err) {
    console.error("Error:", err.message);
  }
};

main();
