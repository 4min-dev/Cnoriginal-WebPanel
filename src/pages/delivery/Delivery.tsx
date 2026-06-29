import React, { useState } from "react";
import DeliveryTable from "./deliveryTable/DeliveryTable";

import DeliveryCreateMain from "./deliveryCreate/DeliveryCreateMain";
import { DeliveryCreateProvider } from "../../context/DeliveryCreateContext";
import DeliveryNavbar from "./ui/DeliveryNavbar";
import { DeliveryTableProvider } from "../../context/DeliveryTableContext";
import { useAppSelector } from "../../hooks/useAppDispatch";
import { useGetSubscriptionStatusQuery } from "../../redux/services/subscriptionService";

const Delivery: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const isAuthenticated = useAppSelector((state) => state?.auth.isAuthenticated);
  const accessToken = useAppSelector((state) => state?.auth.accessToken);

  const { data: subscriptionStatus } = useGetSubscriptionStatusQuery(undefined, {
    skip: !isAuthenticated || !accessToken,
  });

  const isSubscriptionActive = subscriptionStatus?.data === true;

  return (
    <>
      <div className="flex flex-col lg:pt-[24px] lg:pb-[71px] pb-[30px] pt-[40px] grow overflow-x-hidden">
        <DeliveryNavbar />

        <DeliveryTableProvider>
          <DeliveryTable
            deliveryCreateClick={() => setShowPopup(true)}
            canCreateDelivery={isSubscriptionActive}
          />
        </DeliveryTableProvider>
      </div>
      {showPopup && isSubscriptionActive && (
        <DeliveryCreateProvider>
          <DeliveryCreateMain setShowPopup={setShowPopup}></DeliveryCreateMain>
        </DeliveryCreateProvider>
      )}
    </>
  );
};

export default Delivery;
