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
      await onExport();

      // Update progress based on parent component's progress
      setLocalProgress(100);
      setLocalIsComplete(true);
    } catch (error) {
      setLocalHasError(true);
      console.error("Export error:", error);
    } finally {
      setLocalIsProcessing(false);
    }
  };

  const handleDownload = () => {
    // In a real implementation, this would trigger the actual file download
    console.log(`Downloading ${fileName}`);

    // Create a fake download link
    const link = document.createElement("a");
    link.href =
      "data:application/pdf;base64,JVBERi0xLjcKJeLjz9MKNSAwIG9iago8PCAvVHlwZSAvUGFnZSAvUGFyZW50IDEgMCBSIC9MYXN0TW9kaWZpZWQgKEQ6MjAyMzAxMDEwMDAwMDArMDAnMDAnKSAvUmVzb3VyY2VzIDIgMCBSIC9NZWRpYUJveCBbMCAwIDU5NS4yNzU2IDg0MS44ODk4XSAvQ3JvcEJveCBbMCAwIDU5NS4yNzU2IDg0MS44ODk4XSAvQmxlZWRCb3ggWzAgMCA1OTUuMjc1NiA4NDEuODg5OF0gL1RyaW1Cb3ggWzAgMCA1OTUuMjc1NiA4NDEuODg5OF0gL0FydEJveCBbMCAwIDU5NS4yNzU2IDg0MS44ODk4XSAvQ29udGVudHMgNiAwIFIgL1JvdGF0ZSAwIC9Hcm91cCA8PCAvVHlwZSAvR3JvdXAgL1MgL1RyYW5zcGFyZW5jeSAvQ1MgL0RldmljZVJHQiA+PiAvQW5ub3RzIFsgNSAwIFIgXSAvUFogMSA+PgplbmRvYmoKNiAwIG9iago8PC9GaWx0ZXIgL0ZsYXRlRGVjb2RlIC9MZW5ndGggMTc0Pj4gc3RyZWFtCnicXY8xDoMwDEX3nMI3iNMEkBCLhYGBoXdoqtLSqkHq0Ns3JAVV8mC/b1n+tgMc4Lw9pxvMECEhTXHJa0wEEZKGFZLg1dZaNWMEK7PQHXr3DDOzYDSsGr5v7DJpVr3DG2ZFhLhgVo1qwk/ZjYayWrOyZGbRnJAqZvFf9Wj5UPO+1V5bm0tOEXLRzMWzYCFOzJWFCrkg/gDpWzxoCmVuZHN0cmVhbQplbmRvYmoKNyAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMSAwIFIgL09wZW5BY3Rpb24gWzMgMCBSIC9GaXRIIG51bGxdIC9QYWdlTGF5b3V0IC9PbmVDb2x1bW4gPj4KZW5kb2JqCjggMCBvYmoKPDwgL0NyZWF0b3IgKFJlYWRFYXN5IERvY3VtZW50IEVuaGFuY2VyKSAvQ3JlYXRpb25EYXRlIChEOjIwMjMwMTAxMDAwMDAwKzAwJzAwJykgL01vZERhdGUgKEQ6MjAyMzAxMDEwMDAwMDArMDAnMDAnKSA+PgplbmRvYmoKeHJlZgowIDkKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDAwIDAwMDAwIG4gCjAwMDAwMDAwMDAgMDAwMDAgbiAKMDAwMDAwMDAwMCAwMDAwMCBuIAowMDAwMDAwMDAwIDAwMDAwIG4gCjAwMDAwMDAwMDAgMDAwMDAgbiAKMDAwMDAwMDAwMCAwMDAwMCBuIAowMDAwMDAwMjQzIDAwMDAwIG4gCjAwMDAwMDAzNDYgMDAwMDAgbiAKdHJhaWxlcgo8PCAvU2l6ZSA5IC9Sb290IDcgMCBSIC9JbmZvIDggMCBSIC9JRCBbIDxjNGRmOTg4YTc1NjAyYWVmYjM3YWJkZmY5NWVhMGIwYT4gPGM0ZGY5ODhhNzU2MDJhZWZiMzdhYmRmZjk1ZWEwYjBhPiBdID4+CnN0YXJ0eHJlZgo0ODYKJSVFT0YK";
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Show success message
    const successMessage = `Successfully downloaded ${fileName}`;
    console.log(successMessage);
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
