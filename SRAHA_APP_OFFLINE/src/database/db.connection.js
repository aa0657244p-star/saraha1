import mongoose from "mongoose";

export const databaseConnection = async () => {
  try {
    await mongoose.connect(`${process.env.DB_CONNECTION_STRING}/${process.env.DB_NAME}`);
    console.log("DB connected successfully using Mongoose");
  } catch (err) {
    console.error("DB connection error:", err);
    process.exit(1);
  }
};
