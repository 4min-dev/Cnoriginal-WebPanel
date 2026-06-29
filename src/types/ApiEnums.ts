export const getDeliveryCompanies = [
  {
    key: "VLADIVOSTOK",
    value: "Владивосток",
  },
  {
    key: "PP_USURIYSK",
    value: "ПП Уссурийск",
  },
  {
    key: "SDEK",
    value: "СДЭК",
  },
  {
    key: "MAIL",
    value: "Почта",
  },
  {
    key: "MAIL_100SP",
    value: "100сп",
  },
  {
    key: "PEK",
    value: "ПЭК",
  },
  {
    key: "DEL_LINE",
    value: "Деловые линии",
  },
  {
    key: "ENERGIYA",
    value: "Энергия",
  },
  {
    key: "BAIKAL",
    value: "Байкал сервис",
  },
  {
    key: "ANOTHER",
    value: "Другое",
  },
] as const;

export type DeliveryCompanyType =
  | (typeof getDeliveryCompanies)[number]["key"]
  | "";

export type DeliveryCompanyRus =
  | (typeof getDeliveryCompanies)[number]["value"]
  | "";
