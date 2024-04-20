import { SearchParamsProps } from '@/types';
import React from 'react'

interface AnswerTabProps extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const AnswerTab = ({ searchParams, userId, clerkId }: AnswerTabProps) => {
  return (
    <div>AnswerTab</div>
  )
}

export default AnswerTab