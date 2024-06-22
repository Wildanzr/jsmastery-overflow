"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  GetUserStatsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question, { IQuestion } from "@/database/question.model";
import { FilterQuery } from "mongoose";
import Tag from "@/database/tag.model";
import Answer from "@/database/answer.model";

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

    const { searchQuery, filter, page = 1, pageSize = 10 } = payload;
    const skipAmount = (page - 1) * pageSize;
    const query: FilterQuery<typeof User> = {};

    if (searchQuery) {
      query.$or = [
        { name: { $regex: new RegExp(searchQuery, "i") } },
        { username: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    let sortOptions = {};
    switch (filter) {
      case "new_users":
        sortOptions = { joinedAt: -1 };
        break;
      case "old_users":
        sortOptions = { joinedAt: 1 };
        break;
      case "top_contributors":
        sortOptions = { reputation: -1 };
        break;
      default:
        break;
    }

    const users = await User.find(query)
    .skip(skipAmount)
    .limit(pageSize)
    .sort(sortOptions);

    const totalUsers = await User.countDocuments(query);
    const isNext = totalUsers > skipAmount + users.length;

    return { users, isNext };
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
      await User.findByIdAndUpdate(
        userId,
        { $pull: { saved: questionId } },
        { new: true }
      );
    } else {
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { saved: questionId } },
        { new: true }
      );
    }

    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getSavedQuestions = async (payload: GetSavedQuestionsParams) => {
  try {
    connectToDatabase();

    const { clerkId, filter, page = 1, pageSize = 20, searchQuery } = payload;
    const skipAmount = (page - 1) * pageSize;
    const query: FilterQuery<typeof Question> = {};

    if (searchQuery) {
      query.$or = [{ title: { $regex: new RegExp(searchQuery, "i") } }];
    }

    let sortOptions = {}
    switch (filter) {
      case "most_recent":
        sortOptions = { createdAt: -1 }
        break;
      case "oldest":
        sortOptions = { createdAt: 1 }
        break;
      case "most_voted":
        sortOptions = { upvotes: -1 }
        break;
      case "most_viewed":
        sortOptions = { views: -1 }
        break;
      case "most_answered":
        sortOptions = { answers: -1 }
        break;
      default:
        break;
    }

    const user = await User.findOne({ clerkId }).populate({
      path: "saved",
      options: { sort: sortOptions, skip: skipAmount, limit: pageSize + 1},
      match: query,
      populate: [
        { path: "tags", model: Tag, select: "name _id" },
        { path: "author", model: User, select: "name _id picture" },
      ],
    });

    const isNext = user.saved.length > pageSize;

    if (!user) throw new Error("User not found");

    const savedQuestions = user.saved;
    return { questions: savedQuestions, isNext };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUserInfo = async (payload: GetUserByIdParams) => {
  try {
    connectToDatabase();

    const { userId } = payload;
    const user = await User.findOne({ _id: userId });
    if (!user) throw new Error("User not found");

    const totalQuestion = await Question.countDocuments({ author: user._id });
    const totalAnswers = await Answer.countDocuments({ author: user._id });

    return { user, totalQuestion, totalAnswers };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUserQuestions = async (payload: GetUserStatsParams) => {
  try {
    connectToDatabase();

    const { userId, page = 1, pageSize = 10 } = payload;
    const skipAmount = (page - 1) * pageSize;

    const totalQuestions = await Question.countDocuments({ author: userId });
    const userQuestions = await Question.find({ author: userId })
      .sort({ views: -1, upvotes: -1 })
      .skip(skipAmount)
      .limit(pageSize)
      .populate("tags", "_id name")
      .populate("author", "_id clerkId name picture")

    const isNext = totalQuestions > skipAmount + userQuestions.length;

    return { totalQuestions, questions: userQuestions, isNext };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUserAnswers = async (payload: GetUserStatsParams) => {
  try {
    connectToDatabase();

    const { userId, page = 1, pageSize = 10 } = payload;
    const skipAmount = (page - 1) * pageSize;

    const totalAnswers = await Answer.countDocuments({ author: userId });
    const userAnswers = await Answer.find({ author: userId })
      .sort({ upvotes: -1 })
      .skip(skipAmount)
      .limit(pageSize)
      .populate("question", "_id title")
      .populate("author", "_id clerkId name picture");

    const isNext = totalAnswers > skipAmount + userAnswers.length;

    return { totalAnswers, answers: userAnswers, isNext };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
