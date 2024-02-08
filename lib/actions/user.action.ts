"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";

export const getUserById = async (params: any) => {
  try {
    connectToDatabase();

    const { userId } = params;
    return await User.findOne({ clerkId: userId });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
