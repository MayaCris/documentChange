import React from "react";
import { Progress } from "../components/ui/progress";
import { Loader2 } from "lucide-react";

interface ProcessingIndicatorProps {
  status?: "idle" | "processing" | "complete" | "error";
  progress?: number;
  message?: string;
}

const ProcessingIndicator = ({
  status = "idle",
  progress = 0,
  message = "Processing your document...",
}: ProcessingIndicatorProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto flex flex-col items-center justify-center space-y-4">
      {status === "idle" && (
        <div className="text-gray-400 text-center">
          <p>Ready to process</p>
        </div>
      )}

      {status === "processing" && (
        <>
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-primary animate-spin mr-2" />
            <span className="text-lg font-medium">{message}</span>
          </div>
          <div className="w-full space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-500 text-right">{progress}%</p>
          </div>
        </>
      )}

      {status === "complete" && (
        <div className="text-center text-green-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <p className="mt-2 text-lg font-medium">Processing complete!</p>
        </div>
      )}

      {status === "error" && (
        <div className="text-center text-red-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <p className="mt-2 text-lg font-medium">An error occurred</p>
          <p className="text-sm text-red-500">{message}</p>
        </div>
      )}
    </div>
  );
};

export default ProcessingIndicator;
