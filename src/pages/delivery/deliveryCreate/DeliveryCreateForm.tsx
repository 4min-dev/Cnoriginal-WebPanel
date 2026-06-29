import React from "react";
import LabelInput from "../../../ui/inputs/LabelInput";
import LHeading from "../../../ui/text/LHeading";
import { useDeliveryCreate } from "../../../context/DeliveryCreateContext";
import InputRadio from "../../../ui/inputs/InputRadio";
import { PACKAGE_VARIANTS } from "../../../types/Delivery";
import InputSwitch from "../../../ui/inputs/InputSwitch";
import LabelTextarea from "../../../ui/inputs/LabelTextarea";
import DefaultSelect from "../../../ui/inputs/DefaultSelect";
import { useGetDeliveryCompaniesEnumQuery } from "../../../redux/services/enumService";
import DeliveryCreateFormUser from "./DeliveryCreateFormUser";
import Skeleton from "react-loading-skeleton";
import type { DeliveryCompanyRus } from "../../../types/ApiEnums";

const DeliveryCreateForm: React.FC = () => {
  const { formData, setFormData } = useDeliveryCreate();

  const { data: deliveryCompanies } = useGetDeliveryCompaniesEnumQuery();

  const selectedDeliveryCompanyKey =
    deliveryCompanies?.data.find((i: any) => i.value === formData.type)?.key ||
    "";

  return (
    <div className="flex flex-col gap-[25px]">
      <DeliveryCreateFormUser></DeliveryCreateFormUser>

      <hr />

      <div className="">
        <LHeading
          level={3}
          className="mb-3"
        >
          Способ доставки
        </LHeading>

        <div className="flex flex-col gap-4">
          <InputRadio
            name="delivery-type"
            checked={formData.type === "Владивосток"}
            onChange={() => setFormData({ type: "Владивосток" })}
          >
            По городу
          </InputRadio>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-8">
            <InputRadio
              name="delivery-type"
              checked={formData.type !== "Владивосток"}
              onChange={() =>
                setFormData({ type: deliveryCompanies?.data[1]?.value })
              }
              disabled={!deliveryCompanies?.data}
            >
              Транспортная компания
            </InputRadio>

            {deliveryCompanies ? (
              <DefaultSelect
                disabled={formData.type === "Владивосток"}
                value={selectedDeliveryCompanyKey}
                onChange={(val) =>
                  setFormData({ type: val?.value as DeliveryCompanyRus })
                }
                placeholder="Выберите "
                className="max-h-[40px]"
                options={[
                  ...deliveryCompanies.data.filter(
                    (i) => i.key !== "VLADIVOSTOK",
                  ),
                ]}
              ></DefaultSelect>
            ) : (
              <Skeleton
                width={158}
                height={40}
                borderRadius={5}
              />
            )}
          </div>
        </div>
      </div>

      <hr />

      <div>
        <LHeading
          level={3}
          className="mb-3"
        >
          Упаковка
        </LHeading>

        <div className="flex flex-col gap-4 mb-4">
          {PACKAGE_VARIANTS.map((i) => (
            <InputRadio
              key={i.key}
              name="package-type"
              checked={formData.package === i.key}
              onChange={() => setFormData({ package: i.key })}
            >
              {i.value}
            </InputRadio>
          ))}
        </div>

        <div className="inline-flex flex-col gap-4">
          <hr />

          <InputSwitch
            checked={formData.lattice}
            onChange={() => setFormData({ lattice: !formData.lattice })}
            name="my-switch"
          >
            Деревянная обрещётка
          </InputSwitch>
        </div>
      </div>

      <hr />

      <div>
        <LHeading
          level={3}
          className="mb-3"
        >
          Объявленная ценность
        </LHeading>
        <LabelInput
          required
          type="price"
          maxLength={8}
          placeholder="10 000 ₽"
          lastSymbol="₽"
          hint="От объявленной ценности зависит страховка отправления"
          value={formData.declared_value || ""}
          onChange={(val: number) => setFormData({ declared_value: val })}
        />
      </div>

      <hr />

      <div>
        <LHeading
          level={3}
          className="mb-3"
        >
          Описание груза
        </LHeading>
        <LabelTextarea
          required
          placeholder="Коротко опиши товар — что это и какой вариант"
          value={formData.description || ""}
          onChange={(e) => setFormData({ description: e.target.value })}
        />
      </div>
    </div>
  );
};

export default DeliveryCreateForm;
