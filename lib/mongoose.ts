import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URL) {
    return console.error("MONGODB_URL is not set");
  }

  if (isConnected) {
    console.info("MongoDB is already connected");
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: "devflow",
    });
    isConnected = true;
    console.info("MongoDB is connected");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
};
