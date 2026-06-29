import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { copyToClipboard } from "../../utils/text/copyToClipboard";

type CopyTextProps = {
  text: string;
};

const CopyText: React.FC<CopyTextProps> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await copyToClipboard(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      console.error("Copy failed", e);
    }
  };

  return (
    <div
      onClick={handleCopy}
      className="inline-flex items-center gap-2 cursor-pointer select-none group"
    >
      <span className="transition-opacity group-hover:opacity-80">{text}</span>

      <span className="flex items-center justify-center">
        {copied ? (
          <Check
            size={16}
            className="transition-transform scale-110"
          />
        ) : (
          <Copy
            size={16}
            className="opacity-70 group-hover:opacity-100 transition-opacity"
          />
        )}
      </span>
    </div>
  );
};

export default CopyText;
