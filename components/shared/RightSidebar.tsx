import Image from "next/image";
import Link from "next/link";
import React from "react";
import RenderTag from "./RenderTag";

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
      title:
        "What is the best way to learn React? What is the best way to learn React? What is the best way to learn React?",
    },
    {
      _id: 5,
      title: "How to create a website? What is the best way to learn React?",
    },
  ];

  const popularTags = [
    {
      _id: 1,
      name: "React",
      totalQuestions: 5,
    },
    {
      _id: 2,
      name: "Next.js",
      totalQuestions: 3,
    },
    {
      _id: 3,
      name: "Tailwind CSS",
      totalQuestions: 190,
    },
    {
      _id: 4,
      name: "React",
      totalQuestions: 35,
    },
    {
      _id: 5,
      name: "Next.js",
      totalQuestions: 121,
    },
    {
      _id: 6,
      name: "Tailwind CSS",
      totalQuestions: 1,
    },
    {
      _id: 7,
      name: "React",
      totalQuestions: 5,
    },
    {
      _id: 8,
      name: "Next.js",
      totalQuestions: 5,
    },
    {
      _id: 9,
      name: "Tailwind CSS",
      totalQuestions: 5,
    },
  ];
  return (
    <section className="background-light900_dark200 light-border custom-scrollbar sticky right-0 top-0 flex h-screen w-[350px] flex-col overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {hotQuestions.map((item, idx) => (
            <Link
              key={idx}
              href={item._id.toString()}
              className="flex cursor-pointer items-center justify-between gap-7"
            >
              <p className="body-medium text-dark500_light700">{item.title}</p>
              <Image
                src="/assets/icons/chevron-right.svg"
                alt="chevron-right"
                width={20}
                height={20}
                className="invert-colors"
              />
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
        <div className="mt-7 flex flex-col gap-4">
          {popularTags.map((item) => (
            <RenderTag
              key={item._id.toString()}
              _id={item._id.toString()}
              name={item.name.toLowerCase()}
              totalQuestions={item.totalQuestions}
              showCount
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
