export type ParsedDeliveryAddress = {
  city?: string;
  street?: string;
  house?: string;
  flat?: string;
  postcode?: string;
};

const normalizeAddress = (address: string) =>
  address
    .replace(/\s+/g, " ")
    .replace(/\s*,\s*/g, ", ")
    .trim();

const cleanValue = (value?: string) =>
  value
    ?.replace(/^[,.\s-]+|[,.\s-]+$/g, "")
    .replace(/\s+/g, " ")
    .trim() || "";

const stripStreetType = (value: string) =>
  cleanValue(
    value.replace(
      /^(?:улица|ул\.?|проспект|пр-?т|переулок|пер\.?|шоссе|ш\.?|бульвар|б-?р|набережная|наб\.?|площадь|пл\.?|проезд|аллея)\s*/i,
      "",
    ),
  );

const isRegionPart = (value: string) =>
  /(?:республика|обл\.?|область|край|район|р-н|ао|округ)/i.test(value);

const isPostcodePart = (value: string) => /^\d{6}$/.test(value.trim());

const extractCity = (address: string, parts: string[]) => {
  const markedCity = address.match(/(?:^|,\s*)(?:город|г\.?)\s*([^,]+)/i)?.[1];
  if (markedCity) return cleanValue(markedCity);

  const fallback = parts.find((part) => {
    const value = part.trim();

    return (
      value &&
      !isPostcodePart(value) &&
      !isRegionPart(value) &&
      !/\d/.test(value) &&
      !/(?:^|\s)(?:ул\.?|улица|пр-?т|проспект|пер\.?|переулок|ш\.?|шоссе|б-?р|бульвар|наб\.?|набережная|пл\.?|площадь|проезд|аллея|д\.?|дом|кв\.?|квартира)(?:\s|$)/i.test(value)
    );
  });

  return cleanValue(fallback);
};

const extractStreet = (parts: string[]) => {
  const streetPart = parts.find((part) =>
    /(?:^|\s)(?:улица|ул\.?|проспект|пр-?т|переулок|пер\.?|шоссе|ш\.?|бульвар|б-?р|набережная|наб\.?|площадь|пл\.?|проезд|аллея)\s*/i.test(part),
  );

  if (streetPart) {
    const beforeHouse = streetPart.split(/\s+(?:д\.?|дом|№)\s*/i)[0];
    return stripStreetType(beforeHouse);
  }

  const streetWithHouse = parts.find((part) =>
    /^[^\d,]+?\s+\d+[а-яa-z0-9/.-]*$/i.test(part.trim()) &&
    !isRegionPart(part) &&
    !isPostcodePart(part),
  );

  return cleanValue(streetWithHouse?.replace(/\s+\d+[а-яa-z0-9/.-]*$/i, ""));
};

const extractHouse = (parts: string[]) => {
  const housePart = parts.find((part) => /(?:^|\s)(?:д\.?|дом|№)\s*/i.test(part));
  const markedHouse = housePart?.match(
    /(?:^|\s)(?:д\.?|дом|№)\s*([0-9]+[а-яa-z0-9/.-]*(?:\s*(?:корпус|корп\.?|к\.?|строение|стр\.?|литера|лит\.?)\s*[а-яa-z0-9/.-]+)*)/i,
  )?.[1];
  if (markedHouse) return cleanValue(markedHouse);

  const streetWithHouse = parts.find((part) =>
    /^[^\d,]+?\s+\d+[а-яa-z0-9/.-]*$/i.test(part.trim()) &&
    !isRegionPart(part) &&
    !isPostcodePart(part),
  );
  const fallbackHouse = streetWithHouse?.match(/\s+(\d+[а-яa-z0-9/.-]*)$/i)?.[1];
  if (fallbackHouse) return cleanValue(fallbackHouse);

  const numericPart = parts.find((part) =>
    /^\d+[а-яa-z0-9/.-]*$/i.test(part.trim()) &&
    !isPostcodePart(part),
  );

  return cleanValue(numericPart);
};

const extractFlat = (address: string) =>
  cleanValue(
    address.match(
      /(?:^|[,\s])(?:кв\.?|квартира|ап\.?|апартаменты|оф\.?|офис)\s*([0-9]+[а-яa-z0-9/.-]*)/i,
    )?.[1],
  );

export const parseDeliveryAddress = (rawAddress: string): ParsedDeliveryAddress => {
  const address = normalizeAddress(rawAddress);
  if (!address) return {};

  const parts = address.split(",").map((part) => part.trim()).filter(Boolean);

  return {
    postcode: cleanValue(address.match(/\b\d{6}\b/)?.[0]),
    city: extractCity(address, parts),
    street: extractStreet(parts),
    house: extractHouse(parts),
    flat: extractFlat(address),
  };
};
