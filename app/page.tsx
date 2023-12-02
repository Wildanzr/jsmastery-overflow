"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [search, setSearch] = useState<string>("");
  const router = useRouter();

  const handleSearch = () => {
    if (search === "") {
      return;
    }

    router.push(`/search?q=${search}`);
  };
  return (
    <div className="flex h-full w-full flex-col items-center justify-center space-y-3">
      <p className="text-2xl font-bold">Search Main Page</p>

      <div className="flex flex-row items-center justify-between space-x-5">
        <input
          type="text"
          className="rounded-md border-2 border-gray-400"
          placeholder="Search for a product"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="rounded-md bg-blue-500 px-3 py-1 text-white"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
    </div>
  );
}
