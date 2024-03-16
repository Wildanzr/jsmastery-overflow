import { getQuestionById } from '@/lib/actions/question.action'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import Metric from '@/components/shared/Metric'
import { formatAndDivideNumber, getTimestamp } from '@/lib/utils'
import ParseHTML from '@/components/shared/ParseHTML'
import RenderTag from '@/components/shared/RenderTag'
import Answer from '@/components/forms/Answer'
import { auth } from '@clerk/nextjs'
import { getUserById } from '@/lib/actions/user.action'
import AllAnswer from '@/components/shared/AllAnswer'
import Votes from '@/components/shared/Votes'

const QuestionDetailPage = async ({ params, searchParams}: any) => {
  const { question} = await getQuestionById({ questionId: params.id })
  const { userId } = auth();
  let mongoUser;

  if (userId) {
    mongoUser = await getUserById({ userId });
  }

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className='flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2'>
          <Link className='flex items-center justify-start gap-1 ' href={`/profile/${question.author.clerkId}`}>
            <Image src={question.author.picture} alt="user" width={22} height={22} />
            <p className='paragraph-semibold text-dark300_light700'>
              {question.author.name}
            </p>
          </Link>

          <div className="flex justify-end">
            <Votes 
              types="question"
              itemId={JSON.stringify(question._id)}
              userId={JSON.stringify(mongoUser._id)}
              upvotes={question.upvotes.length}
              downvotes={question.downvotes.length}
              hasUpvoted={question.upvotes.includes(mongoUser._id)}
              hasDownvoted={question.downvotes.includes(mongoUser._id)}
              // hasSaved={question.saved.includes(question._id)}
            />
          </div>
        </div>

        <h2 className='h2-semibold text-dark200_light900 mt-3.5 w-full text-left'>
          {question.title}
        </h2>
      </div>

      <div className='mb-8 mt-5 flex flex-wrap gap-4'>
      <Metric
          imgUrl="/assets/icons/clock.svg"
          alt="clock icon"
          value={`Asked ${getTimestamp(question.createdAt)}`}
          title=""
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="answers"
          value={formatAndDivideNumber(question.answers.length)}
          title="Answers"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="Eye"
          value={question.views}
          title="Views"
          textStyles="small-medium text-dark400_light800"
        />
      </div>

      <ParseHTML data={question.content} />

      <div className='mt-8 flex flex-wrap gap-2'>
        {question.tags.map((tag: any, index: number) => (
          <RenderTag key={index} 
          _id={tag._id}
          name={tag.name}
          showCount={false} 
          />
        ))}
      </div>

      <AllAnswer 
        questionId={JSON.stringify(question._id)}
        userId={JSON.stringify(mongoUser._id)}
        totalAnswers={question.answers.length}
      />

      <Answer 
        question={question.content}
        questionId={JSON.stringify(question._id)}
        authorId={JSON.stringify(mongoUser._id)}
      />
    </>
  )
}

export default QuestionDetailPage