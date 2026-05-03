import mongoose from "mongoose";

export const dbConnection = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("DB Connected:", conn.connection.host);
  } catch (e) {
    console.error("DB Connection Error:", e.message);
    process.exit(1); 
  }
};