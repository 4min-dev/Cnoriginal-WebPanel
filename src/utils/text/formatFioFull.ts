export const formatFioFull = (
  first_name: string,
  last_name: string,
  patronymic_name: string,
): string => {
  return `${last_name || ""} ${first_name || ""} ${patronymic_name || ""}`;
};
