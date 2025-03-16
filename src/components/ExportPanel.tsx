import React from "react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Download, FileDown, Check, AlertCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface ExportPanelProps {
  onExport: () => Promise<void>;
  isProcessing: boolean;
  progress: number;
  isComplete: boolean;
  hasError: boolean;
  errorMessage?: string;
  fileName: string;
}

const ExportPanel: React.FC<ExportPanelProps> = ({
  onExport,
  isProcessing,
  progress,
  isComplete,
  hasError,
  errorMessage = "An error occurred during export",
  fileName,
}) => {
  return (
    <div className="w-full max-w-[600px] p-6 rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Export Enhanced Document</h3>

          {isComplete && !hasError && (
            <div className="flex items-center text-green-600">
              <Check className="w-5 h-5 mr-1" />
              <span className="text-sm">Document enhanced successfully</span>
            </div>
          )}

          {hasError && (
            <div className="flex items-center text-red-600">
              <AlertCircle className="w-5 h-5 mr-1" />
              <span className="text-sm">{errorMessage}</span>
            </div>
          )}
        </div>

        {isProcessing && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Processing document...
              </span>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <div className="flex space-x-3">
          <Button
            onClick={onExport}
            disabled={isProcessing}
            className="flex-1"
          >
            {isProcessing ? (
              <>
                <FileDown className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Generate Enhanced PDF
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExportPanel;
