import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <h1>This is layout Contact</h1>
      {children}
    </div>
  );
};

export default Layout;
