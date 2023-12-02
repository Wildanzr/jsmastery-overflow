import React from "react";

const ProductDetails = ({ params }: { params: { id: string } }) => {
  return <div>Product Details {params.id}</div>;
};

export default ProductDetails;
