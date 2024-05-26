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
    const { searchQuery, filter } = payload;

    const query: FilterQuery<typeof Tag> = {}

    if (searchQuery) {
      query.$or = [
        { name: { $regex: new RegExp(searchQuery, "i") } }
      ]
    }
    
    let sortOptions = {}
    switch (filter) {
      case "popular":
        sortOptions = { questions: -1 }
        break
      case "recent":
        sortOptions = { createdAt: -1 }
        break
      case "name":
        sortOptions = { name: 1 }
        break
      case "old":
        sortOptions = { createdAt: 1 }
        break
      default:
        break
    }

    const tags = await Tag.find(query)
    .sort(sortOptions)

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

export const getTopPopularTags = async () => {
  try {
    connectToDatabase();

    const tags = await Tag.aggregate([
      { $project: { name: 1, totalQuestions: { $size: "$questions" } } },
      { $sort: { totalQuestions: -1 } },
      { $limit: 5 },
    ])
    return tags
  } catch (error) {
    console.error(error);
    throw error;
  }
}