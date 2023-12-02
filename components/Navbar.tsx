import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex w-full items-center justify-between p-5">
        <div className="flex items-center justify-center">
          <Link href="/">
            <span className="text-2xl font-bold">Home</span>
          </Link>
        </div>

        <div className="flex items-center justify-center space-x-3">
          <Link href="/products">
            <span className="text-2xl font-bold">Products</span>
          </Link>
          <Link href="/cart">
            <span className="text-2xl font-bold">Cart</span>
          </Link>
          <Link href="/checkout">
            <span className="text-2xl font-bold">Checkout</span>
          </Link>
          <Link href="/order">
            <span className="text-2xl font-bold">Order</span>
          </Link>
          <Link href="/search">
            <span className="text-2xl font-bold">Search</span>
          </Link>
        </div>
      </div>
      <p>Home Page Buddy</p>
      <div className="flex items-center justify-start space-x-3">
        <Link href="/account">
          <span className="text-2xl font-bold">Account</span>
        </Link>
        <Link href="/login">
          <span className="text-2xl font-bold">Login</span>
        </Link>
        <Link href="/register">
          <span className="text-2xl font-bold">Register</span>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
