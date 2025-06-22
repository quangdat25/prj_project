import React from "react";
import { Button, Result } from "antd";
import { Link } from "react-router-dom";

const CompleteOrder = () => (
  <Result
    status="success"
    title="Successfully Order"
    subTitle="Your system has recorded the order."
    extra={[
      <Button type="primary">
        <Link to="/">Home</Link>
      </Button>,

      <Button key="buy">
        <Link to="/history">Your Order</Link>
      </Button>,
    ]}
  />
);

export default CompleteOrder;
