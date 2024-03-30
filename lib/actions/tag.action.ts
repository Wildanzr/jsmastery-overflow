"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from "./shared.types";
import Tag, { ITag } from "@/database/tag.model";
import Question from "@/database/question.model";
import { FilterQuery } from "mongoose";

export const getAllTags = async (payload: GetAllTagsParams) => {
  try {
    connectToDatabase();

    const tags = await Tag.find({});

    return { tags };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getTopInteractedTags = async (
  payload: GetTopInteractedTagsParams
) => {
  try {
    connectToDatabase();

    const { userId } = payload;
    const users = await User.findById(userId);
    if (!users) throw new Error("User not found");

    return [
      {
        _id: "1",
        name: "React",
      },
      {
        _id: "2",
        name: "Typescript",
      },
      {
        _id: "3",
        name: "Javascript",
      },
    ];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getQuestionsByTagId = async (
  payload: GetQuestionsByTagIdParams
) => {
  try {
    connectToDatabase();

    const { tagId, page = 1, pageSize = 10, searchQuery } = payload;
    const tagFilter: FilterQuery<ITag> = { _id: tagId };

    const tag = await Tag.findOne(tagFilter).populate({
      path: "questions",
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: "i" } }
        : {},
      options: {
        sort: { createdAt: -1 },
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });

    if (!tag) throw new Error("Tag not found");

    const questions = tag.questions;
    return { tagTitle: tag.name, questions };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
