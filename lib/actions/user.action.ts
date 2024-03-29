"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import { FilterQuery } from "mongoose";
import Tag from "@/database/tag.model";

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

    await User.findOneAndUpdate({ clerkId }, updateData, { new: true });
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

export const getAllUsers = async (payload: GetAllUsersParams) => {
  try {
    connectToDatabase();

    // const { filter, page = 1, pageSize = 20, searchQuery } = payload;
    const users = await User.find({}).sort({ createdAt: -1 });
    return { users };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const saveQuestion = async (payload: ToggleSaveQuestionParams) => {
  try {
    connectToDatabase();

    const { path, questionId, userId } = payload;
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const hasSaved = user.saved.includes(questionId);
    if (hasSaved) {
      await User.findByIdAndUpdate(userId, { $pull: { saved: questionId } }, { new: true });
    } else {
      await User.findByIdAndUpdate(userId, { $addToSet: { saved: questionId } }, { new: true });
    }

    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const getSavedQuestions = async (payload: GetSavedQuestionsParams) => {
  try {
    connectToDatabase();

    const { clerkId, filter, page = 1, pageSize = 10, searchQuery } = payload;
    const query: FilterQuery<typeof Question> = searchQuery
    ? { title: { $regex: new RegExp(searchQuery, "i") } }
    : {};

    const user = await User.findOne({ clerkId })
      .populate({
        path: 'saved', 
        options: { sort: { createdAt: -1 } },
        match: query,
        populate: [
          { path: 'tags', model: Tag, select: 'name _id'},
          { path: 'author', model: User, select: 'name _id picture'},
        ]
      })

    if (!user) throw new Error("User not found");

    const savedQuestions = user.saved;
    return { questions: savedQuestions }

  } catch (error) {
    console.error(error);
    throw error;
  }
}