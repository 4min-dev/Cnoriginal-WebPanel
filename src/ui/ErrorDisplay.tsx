import React from "react";

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  title = "Произошла ошибка",
  message = "Что-то пошло не так. Попробуйте еще раз.",
  onRetry,
}) => (
  <div className="flex flex-col items-center justify-center h-64 text-gray-600">
    <img
      src="images/warnTriangle.svg"
      className="w-12 h-12 mb-4 text-gray-400"
    />
    <p className="text-lg font-medium">{title}</p>
    <p className="text-sm text-gray-500 mt-1">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-2 text-sm text-blue-500 underline hover:text-blue-600"
      >
        Повторить попытку
      </button>
    )}
  </div>
);

export default ErrorDisplay;
