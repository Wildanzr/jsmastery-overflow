import Link from "next/link";
import React from "react";

const Order = () => {
  const orders = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  return (
    <div className="flex h-full w-full flex-col space-y-3">
      <p>Product Main Page</p>

      <div className="flex h-full w-full flex-col items-center justify-center space-y-2">
        {orders.map((item) => (
          <Link href={`/order/${item}`} key={item} className="font-bold">
            <span className="text-2xl font-bold">Order #{item}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Order;
