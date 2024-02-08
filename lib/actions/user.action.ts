"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
  GetUserByIdParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";

export const getUserById = async (payload: GetUserByIdParams) => {
  try {
    connectToDatabase();

    const { userId } = payload;
    return await User.findOne({ clerkId: userId });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createUser = async (payload: CreateUserParams) => {
  try {
    connectToDatabase();

    return await User.create(payload);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateUser = async (payload: UpdateUserParams) => {
  try {
    connectToDatabase();

    const { clerkId, updateData, path } = payload;

    await User.findByIdAndUpdate({ clerkId }, updateData, { new: true });
    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteUser = async (payload: DeleteUserParams) => {
  try {
    connectToDatabase();

    const { clerkId } = payload;
    const user = await User.findOne({ clerkId });
    if (!user) throw new Error("User not found");

    // Delete user from db
    // question, answers, comments, etc
    // const userQuestionIds = await Question.find({ author: user._id })
    //   .distinct("_id")

    await Question.deleteMany({ author: user._id });

    // TODO: delete user answers, comments, etc

    return await User.findOneAndDelete({ clerkId });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
