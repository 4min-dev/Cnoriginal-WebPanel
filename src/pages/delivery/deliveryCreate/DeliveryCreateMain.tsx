import { useDeliveryCreate } from "../../../context/DeliveryCreateContext";
import DefaultPopup from "../../../ui/popup/DefaultPopup";
import DefaultBtn from "../../../ui/DefaultBtn";
import LHeading from "../../../ui/text/LHeading";
import { useEffect, useRef, useState } from "react";
import {
  useCreateDeliveryOrderMutation,
  useGetDeliveryOrdersQuery,
} from "../../../redux/services/deliveryService";
import createPostDataDelivery from "../utils/createPostDataDelivery";
import StatusPopup from "../../../ui/popup/StatusPopup";
import { deliveryCreateSteps } from "../utils/createDeliverySteps";
import { useAppSelector } from "../../../hooks/useAppDispatch";

const DeliveryCreate: React.FC<{ setShowPopup: (show: boolean) => void }> = ({
  setShowPopup,
}) => {
  const {
    currentStep,
    setCurrentStep,
    selectedOrdersIds,
    confirmedCorrect,
    currentOrders,
    formData,
  } = useDeliveryCreate();
  const isAuthenticated = useAppSelector(
    (state) => state?.auth.isAuthenticated,
  );
  const accessToken = useAppSelector((state) => state?.auth.accessToken);

  const [createDelivery, { isLoading }] = useCreateDeliveryOrderMutation();
  const { refetch: DeliveriesRefetch } = useGetDeliveryOrdersQuery(undefined, {
    skip: !isAuthenticated || !accessToken,
  });
  const [statusInfo, setStatusInfo] = useState<{
    status: "success" | "error";
    title: string;
    text: string;
  } | null>(null);

  const CurrentComponent =
    deliveryCreateSteps[currentStep] &&
    deliveryCreateSteps[currentStep].component;

  const handleNext = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (currentStep === 2) {
      try {
        const payload = createPostDataDelivery(
          formData,
          selectedOrdersIds,
          currentOrders,
        );
        await createDelivery(payload).unwrap();

        setStatusInfo({
          status: "success",
          title: "Заявка создана",
          text: "Информация о доставке появится в разделе “Доставка”",
        });
        DeliveriesRefetch();
        setCurrentStep(3);
      } catch (err) {
        const error = err as { status?: number };
        console.error("Ошибка создания доставки", err);

        setStatusInfo({
          status: "error",
          title: `Ошибка создания заявки ${error?.status ? `(код ${error.status})` : ""}`,
          text: "Произошла ошибка при формировании доставки. Попробуйте снова.",
        });
        setCurrentStep(3);
      }
      return;
    }

    if (currentStep < deliveryCreateSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const popupRef = useRef<HTMLDivElement>(null);

  const handlePrev = () => {
    if (isLoading) return;

    if (currentStep > 0 && currentStep !== 3) {
      setCurrentStep(currentStep - 1);
    } else {
      setShowPopup(false);
    }
  };

  useEffect(() => {
    if (popupRef.current && popupRef.current.scrollTop !== 0) {
      popupRef.current.scrollTop = 0;
    }
  }, [currentStep]);

  return (
    <>
      {CurrentComponent && currentStep !== 3 && (
        <DefaultPopup
          onClose={() => setShowPopup(false)}
          classNameInner={
            deliveryCreateSteps[currentStep].popupClass +
            " max-h-[95vh] ms:max-h-[80vh]"
          }
          ref={popupRef}
        >
          <form
            className="min-h-full flex flex-col"
            onSubmit={handleNext}
          >
            <div className="flex gap-3 mb-4">
              {deliveryCreateSteps.map((step, index) => (
                <span
                  key={step.id}
                  className={`px-[13px] py-[3px] border rounded-3xl text-[#B9B9B9] ${index === currentStep
                    ? "_active bg-[#ED0028] text-white"
                    : ""
                    }`}
                  style={{
                    borderColor: index === currentStep ? "#ED0028" : "#F1F1F1",
                  }}
                >
                  Шаг {step.id + 1}
                </span>
              ))}
            </div>

            <LHeading
              level={1}
              className="mb-4"
            >
              {deliveryCreateSteps[currentStep].title}
            </LHeading>

            <div className="mb-4">
              <CurrentComponent />
            </div>

            <div
              className={
                currentStep === 0
                  ? "sticky bottom-0 bg-white py-1   sm:bottom-0 mt-auto "
                  : ""
              }
            >
              {currentStep === 0 && (
                <div className="order-4 text-sm text-[#B3B3B3] inline-flex justify-between items-center mb-2 gap-2">
                  <span>Выбрано заказов:</span>
                  <span className="text-[#ED0028] font-medium">
                    {selectedOrdersIds.length || 0}
                  </span>
                </div>
              )}

              <div className={`flex gap-3 items-center mt-auto ${currentStep === 0 ? '' : 'mb-[20px]'}`}>
                <DefaultBtn
                  onClick={handlePrev}
                  variant="secondary"
                  className="w-full"
                >
                  Назад
                </DefaultBtn>

                <DefaultBtn
                  isLoading={isLoading}
                  type="submit"
                  variant="primary"
                  className="w-full"
                  disabled={
                    isLoading ||
                    selectedOrdersIds.length === 0 ||
                    (currentStep === 2 && !confirmedCorrect)
                  }
                >
                  {currentStep === 2 ? "Сформировать" : "Далее"}
                </DefaultBtn>
              </div>
            </div>
          </form>
        </DefaultPopup>
      )}

      {currentStep === 3 && statusInfo && (
        <StatusPopup
          setShowPopup={setShowPopup}
          title={statusInfo.title}
          status={statusInfo.status}
          text={statusInfo.text}
        />
      )}
    </>
  );
};

export default DeliveryCreate;
