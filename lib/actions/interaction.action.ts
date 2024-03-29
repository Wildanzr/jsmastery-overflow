"use server";
import Interaction from "@/database/interaction.model";
import { ViewQuestionParams } from "./shared.types";
import { connectToDatabase } from "../mongoose";
import Question from "@/database/question.model";

export const viewQuestion = async (params: ViewQuestionParams) => {
  try {
    connectToDatabase();

    const { questionId, userId } = params;

    await Question.findByIdAndUpdate(questionId, { $inc: { views: 1 } });

    if (userId) {
      const existingInteraction = await Interaction.findOne({ user: userId, action: "view", question: questionId });
      if (existingInteraction) return null;

      await Interaction.create({ user: userId, action: "view", question: questionId })
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}