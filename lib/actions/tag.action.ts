"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import { GetAllTagsParams, GetTopInteractedTagsParams } from "./shared.types";
import Tag from "@/database/tag.model";

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
