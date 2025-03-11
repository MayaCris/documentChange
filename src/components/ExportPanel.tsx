import React, { useState } from "react";
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
  onExport?: () => Promise<void>;
  isProcessing?: boolean;
  progress?: number;
  isComplete?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  fileName?: string;
}

const ExportPanel: React.FC<ExportPanelProps> = ({
  onExport = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
  },
  isProcessing = false,
  progress = 0,
  isComplete = false,
  hasError = false,
  errorMessage = "An error occurred during export",
  fileName = "enhanced-document.pdf",
}) => {
  const [localIsProcessing, setLocalIsProcessing] = useState(isProcessing);
  const [localProgress, setLocalProgress] = useState(progress);
  const [localIsComplete, setLocalIsComplete] = useState(isComplete);
  const [localHasError, setLocalHasError] = useState(hasError);

  const handleExport = async () => {
    if (localIsProcessing || localIsComplete) return;

    setLocalIsProcessing(true);
    setLocalProgress(0);
    setLocalHasError(false);
    setLocalIsComplete(false);

    try {
      // Simulate progress updates
      const interval = setInterval(() => {
        setLocalProgress((prev) => {
          const newProgress = prev + 10;
          if (newProgress >= 100) {
            clearInterval(interval);
            return 100;
          }
          return newProgress;
        });
      }, 300);

      await onExport();

      clearInterval(interval);
      setLocalProgress(100);
      setLocalIsComplete(true);
    } catch (error) {
      setLocalHasError(true);
    } finally {
      setLocalIsProcessing(false);
    }
  };

  const handleDownload = () => {
    // In a real implementation, this would trigger the actual file download
    console.log(`Downloading ${fileName}`);

    // Simulate download with an alert
    alert(`Downloading ${fileName}`);
  };

  return (
    <div className="w-full max-w-[600px] p-6 rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Export Enhanced Document</h3>

          {localIsComplete && !localHasError && (
            <div className="flex items-center text-green-600">
              <Check className="w-5 h-5 mr-1" />
              <span className="text-sm">Ready for download</span>
            </div>
          )}

          {localHasError && (
            <div className="flex items-center text-red-600">
              <AlertCircle className="w-5 h-5 mr-1" />
              <span className="text-sm">{errorMessage}</span>
            </div>
          )}
        </div>

        {localIsProcessing && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Processing document...
              </span>
              <span className="text-sm font-medium">{localProgress}%</span>
            </div>
            <Progress value={localProgress} className="h-2" />
          </div>
        )}

        <div className="flex space-x-3">
          {!localIsComplete ? (
            <Button
              onClick={handleExport}
              disabled={localIsProcessing}
              className="flex-1"
            >
              <FileDown className="mr-2 h-4 w-4" />
              {localIsProcessing ? "Processing..." : "Generate Enhanced PDF"}
            </Button>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleDownload}
                    variant="default"
                    className="flex-1"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Enhanced PDF
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download your enhanced document</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {localIsComplete && (
            <Button
              onClick={() => {
                setLocalIsComplete(false);
                setLocalProgress(0);
              }}
              variant="outline"
            >
              Create New
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExportPanel;
