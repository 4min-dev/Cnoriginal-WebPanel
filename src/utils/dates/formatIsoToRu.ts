import { format } from "date-fns";

export const formatIsoToRu = (isoString: string): string => {
  if (!isoString) return "-";

  const date = new Date(isoString);

  if (isNaN(date.getTime())) return "-";

  return format(date, "dd.MM.yyyy");
};
