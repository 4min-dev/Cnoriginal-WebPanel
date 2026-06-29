import { useState } from "react";
type Props = {
  text: string;
  maxLength: number;
};

const TruncatedWithHover: React.FC<Props> = ({ text, maxLength }) => {
  const [hovered, setHovered] = useState(false);

  const isLong = text.length > maxLength;
  const shortText = isLong ? text.slice(0, maxLength) + "..." : text;

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span>{shortText}</span>

      {hovered && isLong && (
        <div
          className="
        absolute left-[-13px] top-[-45%] z-50
        bg-gray-700 text-gray-100
        px-3 py-2 rounded-lg shadow-lg
        flex items-center gap-2
        whitespace-nowrap
        border border-gray-700
  "
        >
          <span>{text}</span>
        </div>
      )}
    </div>
  );
};

export default TruncatedWithHover;
