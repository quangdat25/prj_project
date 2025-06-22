import { Steps } from "antd";
import OrderDetail from "components/clinet/order";
import CompleteOrder from "components/clinet/order/complete.order";
import Payment from "components/clinet/order/payment";
import { useState } from "react";

const OrderPage = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  return (
    <div>
      <Steps
        current={currentStep}
        items={[
          {
            title: "Finished",
          },
          {
            title: "In Progress",
          },
          {
            title: "Waiting",
          },
        ]}
      />

      <br />
      {currentStep === 0 && <OrderDetail setCurrentStep={setCurrentStep} />}
      {currentStep === 1 && <Payment setCurrentStep={setCurrentStep} />}
      {currentStep === 2 && <CompleteOrder setCurrentStep={setCurrentStep} />}
    </div>
  );
};
export default OrderPage;
