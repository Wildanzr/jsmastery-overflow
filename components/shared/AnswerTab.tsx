import { getUserAnswers } from '@/lib/actions/user.action';
import { SearchParamsProps } from '@/types';
import React from 'react'
import AnswerCard from '../card/AnswerCard';

interface AnswerTabProps extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const AnswerTab = async ({ searchParams, userId, clerkId }: AnswerTabProps) => {
  const { answers, totalAnswers } = await getUserAnswers({
    userId,
    page: 1,
  })
  return (
    <>
      {answers.map((item) => (
        <AnswerCard 
          key={item._id}
          clerkId={clerkId}
          _id={item._id}
          question={item.question}
          author={item.author}
          upvotes={item.upvotes}
          createdAt={item.createdAt}
        />
      ))}
    </>
  )
}

export default AnswerTab