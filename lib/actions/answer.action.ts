"use server";

import Answer from "@/database/answer.model";
import { connectToDatabase } from "../mongoose";
import { CreateAnswerParams, GetAnswersParams } from "./shared.types";
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