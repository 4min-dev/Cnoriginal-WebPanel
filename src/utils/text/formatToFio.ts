export const formatFioShort = (
  first_name: string,
  last_name: string,
  patronymic_name: string,
): string => {
  if (!last_name) return "-";

  const lastName = last_name?.trim() || "";
  const firstInitial = first_name?.trim()?.[0];
  const patronymicInitial = patronymic_name?.trim()?.[0];

  if (!lastName && !firstInitial && !patronymicInitial) return "-";

  let result = lastName;

  if (firstInitial) {
    result += ` ${firstInitial}.`;
  }

  if (patronymicInitial) {
    result += ` ${patronymicInitial}.`;
  }

  return result || "-";
};
