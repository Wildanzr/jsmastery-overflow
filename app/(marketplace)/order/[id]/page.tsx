import React from "react";

const OrderDetails = ({ params }: { params: { id: string } }) => {
  return <div>Order Details {params.id}</div>;
};

export default OrderDetails;
