// components/StatusIcon.tsx
import React from "react";
import type { Delivery } from "../../../types/Delivery";
import { COMPANIES_LOGOS } from "../../../types/Delivery";
import { getDeliveryCompanies } from "../../../types/ApiEnums";

type DeliveryCompanyImgProps = {
  deliveryCompany: Delivery["delivery_company"];
};

const DeliveryCompanyImg: React.FC<DeliveryCompanyImgProps> = ({
  deliveryCompany,
}) => {
  const currentType = getDeliveryCompanies.find(
    (compnay) => compnay.value === deliveryCompany,
  );
  const currentLogo = COMPANIES_LOGOS[currentType?.key || ""];

  return (
    <div>
      {currentLogo ? (
        <img
          className="max-h-[35px]"
          src={`/logos/${currentLogo}`}
          alt={currentType?.value}
          title={currentType?.value}
        />
      ) : (
        "По городу"
      )}
    </div>
  );
};

export default DeliveryCompanyImg;
