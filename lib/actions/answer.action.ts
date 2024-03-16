"use server";

import Answer from "@/database/answer.model";
import { connectToDatabase } from "../mongoose";
import { AnswerVoteParams, CreateAnswerParams, GetAnswersParams } from "./shared.types";
import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";

export const createAnswer = async (params: CreateAnswerParams) => {
  try {
    connectToDatabase();

    const { author, content, path, question } = params;
    const answer = await Answer.create({
      author,
      content,
      question,
    })
    
    await Question.findByIdAndUpdate(question, {
      $push: { answers: answer._id }
    })

    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const getAnswers = async (params: GetAnswersParams) => {
  try {
    connectToDatabase()

    const { questionId } = params;
    const answers = await Answer.find({ question: questionId })
      .populate({ path: "author", model: "User", select: "_id clerkId name picture" })
      .sort({ createdAt: -1 })

    return { answers }

  } catch (error) {
    console.error(error)
    throw error
  }
}

export const upvoteAnswer = async (params: AnswerVoteParams) => {
  try {
    connectToDatabase();

    const { answerId, hasdownVoted, hasupVoted, path, userId } = params;

    let updateQuery = {};
    if (hasupVoted) {
      updateQuery = { $pull: { upvotes: userId } };
    } else if (hasdownVoted) {
      updateQuery = { $pull: { downvotes: userId }, $push: { upvotes: userId } };
    } else {
      updateQuery = { $addToSet: { upvotes: userId } };
    }

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, { new: true });
    if (!answer) {
      throw new Error("Answer not found");
    }

    // TODO: reputation

    revalidatePath(path);

  } catch (error) {
    console.error(error)
    throw error
  }
}

export const downvoteAnswer = async (params: AnswerVoteParams) => {
  try {
    connectToDatabase();

    const { answerId, hasdownVoted, hasupVoted, path, userId } = params;

    let updateQuery = {};
    if (hasdownVoted) {
      updateQuery = { $pull: { downvotes: userId } };
    } else if (hasupVoted) {
      updateQuery = { $pull: { upvotes: userId }, $push: { downvotes: userId } };
    } else {
      updateQuery = { $addToSet: { downvotes: userId } };
    }

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, { new: true });
    if (!answer) {
      throw new Error("Answer not found");
    }

    revalidatePath(path);

  } catch (error) {
    console.error(error)
    throw error
  }
}