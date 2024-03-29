"use client";

import { downvoteAnswer, upvoteAnswer } from "@/lib/actions/answer.action";
import { viewQuestion } from "@/lib/actions/interaction.action";
import {
  downvoteQuestion,
  upvoteQuestion,
} from "@/lib/actions/question.action";
import { saveQuestion } from "@/lib/actions/user.action";
import { formatAndDivideNumber } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

interface VotesProps {
  types: "question" | "answer";
  itemId: string;
  userId: string;
  upvotes: number;
  downvotes: number;
  hasUpvoted: boolean;
  hasDownvoted: boolean;
  hasSaved?: boolean;
}

const Votes = ({
  types,
  itemId,
  userId,
  upvotes,
  downvotes,
  hasUpvoted,
  hasDownvoted,
  hasSaved,
}: VotesProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleUpvote = async () => {
    if (!userId) return;

    if (types === "question") {
      await upvoteQuestion({
        questionId: JSON.parse(itemId),
        userId: JSON.parse(userId),
        hasdownVoted: hasDownvoted,
        hasupVoted: hasUpvoted,
        path: pathname,
      });
    } else if (types === "answer") {
      await upvoteAnswer({
        answerId: JSON.parse(itemId),
        userId: JSON.parse(userId),
        hasdownVoted: hasDownvoted,
        hasupVoted: hasUpvoted,
        path: pathname,
      });
    }

    // TODO: show toast
  };

  const handleDownvote = async () => {
    if (!userId) return;

    if (types === "question") {
      await downvoteQuestion({
        questionId: JSON.parse(itemId),
        userId: JSON.parse(userId),
        hasdownVoted: hasDownvoted,
        hasupVoted: hasUpvoted,
        path: pathname,
      });
    } else if (types === "answer") {
      await downvoteAnswer({
        answerId: JSON.parse(itemId),
        userId: JSON.parse(userId),
        hasdownVoted: hasDownvoted,
        hasupVoted: hasUpvoted,
        path: pathname,
      });
    }
  };

  const handleSave = async () => {
    await saveQuestion({
      questionId: JSON.parse(itemId),
      userId: JSON.parse(userId),
      path: pathname,
    });
  };

  useEffect(() => {
    viewQuestion({
      questionId: JSON.parse(itemId),
      userId: userId ? JSON.parse(userId) : undefined,
    });
  }, [itemId, userId, pathname, router]);
  return (
    <div className="flex gap-5 ">
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
          <Image
            src={
              hasUpvoted
                ? "/assets/icons/upvoted.svg"
                : "/assets/icons/upvote.svg"
            }
            width={18}
            height={18}
            alt="upvote"
            className="cursor-pointer"
            onClick={handleUpvote}
          />
          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatAndDivideNumber(upvotes)}
            </p>
          </div>
        </div>
      </div>
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
          <Image
            src={
              hasDownvoted
                ? "/assets/icons/downvoted.svg"
                : "/assets/icons/downvote.svg"
            }
            width={18}
            height={18}
            alt="downvote"
            className="cursor-pointer"
            onClick={handleDownvote}
          />
          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatAndDivideNumber(downvotes)}
            </p>
          </div>
        </div>
      </div>

      {types === "question" && (
        <Image
          src={
            hasSaved
              ? "/assets/icons/star-filled.svg"
              : "/assets/icons/star-red.svg"
          }
          width={18}
          height={18}
          alt="star"
          className="cursor-pointer"
          onClick={handleSave}
        />
      )}
    </div>
  );
};

export default Votes;
