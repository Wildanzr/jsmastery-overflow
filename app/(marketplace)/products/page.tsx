import Link from "next/link";
import React from "react";

const Product = () => {
  const products = ["meong", "cat", "kucing"];

  return (
    <div className="flex h-full w-full items-center justify-center">
      {products.map((item) => (
        <Link
          href={`/products/${item}`}
          key={item}
          className="flex p-2 text-xl font-normal"
        >
          <span className="text-2xl font-bold">{item}</span>
        </Link>
      ))}
    </div>
  );
};

export default Product;
