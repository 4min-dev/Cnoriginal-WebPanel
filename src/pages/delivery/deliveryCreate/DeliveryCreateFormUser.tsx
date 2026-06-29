import React, { useEffect, useState } from "react";
import DefaultBtn from "../../../ui/DefaultBtn";
import LabelInput from "../../../ui/inputs/LabelInput";
import LHeading from "../../../ui/text/LHeading";
import { useDeliveryCreate } from "../../../context/DeliveryCreateContext";
import { useGetProfileQuery } from "../../../redux/services/userService";
import Checkbox from "../../../ui/Checkbox";
import isMobileDevice from "../../../assets/isMobileDevice";

const DeliveryCreateFormUser: React.FC = () => {
  const { formData, setFormData } = useDeliveryCreate();
  const isMobile = isMobileDevice();

  const { data: profile, isFetching, isLoading } = useGetProfileQuery();

  const handleFillFromProfile = () => {
    if (!profile) return

    const address = profile.data.full_delivery_address || ""

    const addressParts = address.split(",")

    const street =
      addressParts.find(part =>
        part.trim().toLowerCase().startsWith("ул.")
      )?.replace(/ул\.\s*/i, "").trim() || ""

    const house =
      addressParts.find(part =>
        part.trim().toLowerCase().startsWith("д.")
      )?.replace(/д\.\s*/i, "").trim() || ""

    setFormData({
      fio: `${profile.data.last_name} ${profile.data.first_name} ${profile.data.patronymic_name || ""}`.trim(),
      city: profile.data.city || "",
      street,
      house,
      postcode: profile.data.postcode || "",
      phone: profile.data.phone || "",
    })
  }

  const [isHasFlat, setIsHasFlat] = useState(false);

  useEffect(() => {
    if (!isHasFlat) {
      setFormData({ flat: "" });
    }
  }, [isHasFlat, setFormData]);

  return (
    <div className="">
      <div className="flex justify-between items-center mb-2">
        <LHeading
          level={3}
          className="mb-3"
        >
          Данные о клиенте
        </LHeading>
        <DefaultBtn
          className="max-w-[180px]"
          variant="outline"
          adaptive={true}
          onClick={handleFillFromProfile}
          disabled={isFetching || !profile}
          isLoading={isLoading}
          type="button"
        >
          {isMobile ? "Из профиля" : "Взять из профиля"}
        </DefaultBtn>
      </div>

      <div className=" flex flex-col sm:gap-6 gap-3">
        <LabelInput
          label="ФИО"
          placeholder="Иванов Иван Иванович"
          value={formData.fio || ""}
          onChange={(e) => setFormData({ fio: e.target.value })}
          pattern="^.*\s.{2,}$"
          minLength={5}
          required
        />
        <LabelInput
          type="tel"
          label="Телефон"
          placeholder="+7 000 000-00-00"
          value={formData.phone || ""}
          onChange={(e) => setFormData({ phone: e.target.value })}
          required
        />

        <div className="flex gap-4">
          <LabelInput
            label="Город"
            placeholder="Владивосток"
            value={formData.city || ""}
            onChange={(e) => setFormData({ city: e.target.value })}
            required
          />
          <LabelInput
            label="Улица"
            placeholder="Ленина"
            value={formData.street || ""}
            onChange={(e) => setFormData({ street: e.target.value })}
            required
          />
        </div>
        <div className="flex gap-4">
          <LabelInput
            label="Номер дома"
            placeholder="1"
            value={formData.house || ""}
            onChange={(e) => setFormData({ house: e.target.value })}
            required
            type="number"
          />
          <LabelInput
            label="Индекс"
            type="number"
            placeholder="123456"
            value={formData.postcode || ""}
            onChange={(e) => setFormData({ postcode: e.target.value })}
            required
          />
        </div>

        {isHasFlat && (
          <LabelInput
            type="number"
            label="Номер квартиры"
            onChange={(e) => setFormData({ flat: e.target.value })}
            required
          />
        )}

        <label
          htmlFor="hasFlat"
          className="flex gap-2 items-center mt-2"
        >
          <Checkbox
            id="hasFlat"
            checked={isHasFlat}
            onChange={() => setIsHasFlat(!isHasFlat)}
          ></Checkbox>
          Квартира
        </label>
      </div>
    </div>
  );
};

export default DeliveryCreateFormUser;
