import Link from "next/link";
import React from "react";

const RightSidebar = () => {
  const hotQuestions = [
    {
      _id: 1,
      title: "How to create a website?",
    },
    {
      _id: 2,
      title: "What is the best way to learn React?",
    },
    {
      _id: 3,
      title: "How to create a website? What is the best way to learn React?",
    },
    {
      _id: 4,
      title: "What is the best way to learn React? What is the best way to learn React? What is the best way to learn React?",
    },
    {
      _id: 5,
      title: "How to create a website? What is the best way to learn React?",
    }
  ]
  return (
    <section className="background-light900_dark200 light-border custom-scrollbar sticky right-0 top-0 flex h-screen w-[350px] flex-col overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {hotQuestions.map((item, idx) => (
            <Link key={idx} href={item._id.toString()}>
            <p>Meong</p>
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-16"></div>
    </section>
  );
};

export default RightSidebar;
