"use client";

import { useSearchParams } from "next/navigation";
import React from "react";

const SearchDetails = () => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q");
  return <p>Searching for {searchQuery}</p>;
};

export default SearchDetails;
