import React, { useState } from "react";
import Header from "./Header";
import UploadArea from "./UploadArea";
import TextPreviewPanel from "./TextPreviewPanel";
import ControlPanel from "./ControlPanel";
import ExportPanel from "./ExportPanel";
import ProcessingIndicator from "./ProcessingIndicator";

const Home = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingProgress, setProcessingProgress] = useState<number>(0);
  const [processingStatus, setProcessingStatus] = useState<
    "idle" | "processing" | "complete" | "error"
  >("idle");

  // Control panel states
  const [boldingRules, setBoldingRules] = useState({
    shortWords: 1,
    mediumWords: 2,
    longWords: 3,
  });
  const [fontSize, setFontSize] = useState<number>(16);
  const [lineSpacing, setLineSpacing] = useState<number>(1.5);

  // Handle file upload
  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setProcessingStatus("processing");
    setIsProcessing(true);

    // Simulate text extraction with progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setProcessingProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setIsProcessing(false);
        setProcessingStatus("complete");

        // Simulate extracted text
        setExtractedText(
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.",
        );
      }
    }, 300);
  };

  // Handle bolding rule change
  const handleBoldingRuleChange = (value: number) => {
    setBoldingRules({
      shortWords: value,
      mediumWords: Math.min(value + 1, 3),
      longWords: Math.min(value + 2, 5),
    });
  };

  // Handle export
  const handleExport = async () => {
    setProcessingStatus("processing");
    setIsProcessing(true);

    // Simulate export process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsProcessing(false);
    setProcessingStatus("complete");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />

      <main className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 gap-8">
          {/* Upload Section */}
          <section className="flex justify-center">
            {!uploadedFile && <UploadArea onFileUpload={handleFileUpload} />}

            {isProcessing && (
              <ProcessingIndicator
                status={processingStatus}
                progress={processingProgress}
                message={
                  uploadedFile
                    ? `Processing ${uploadedFile.name}...`
                    : "Processing document..."
                }
              />
            )}
          </section>

          {/* Document Preview and Controls Section */}
          {extractedText && (
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Text Preview */}
              <div className="lg:col-span-2 flex justify-center">
                <TextPreviewPanel
                  text={extractedText}
                  boldingRules={boldingRules}
                  fontSize={fontSize}
                  lineSpacing={lineSpacing}
                />
              </div>

              {/* Control Panel */}
              <div className="lg:col-span-1">
                <ControlPanel
                  onBoldingRuleChange={handleBoldingRuleChange}
                  onFontSizeChange={(value) => setFontSize(value)}
                  onSpacingChange={(value) => setLineSpacing(value)}
                  onReset={() => {
                    setBoldingRules({
                      shortWords: 1,
                      mediumWords: 2,
                      longWords: 3,
                    });
                    setFontSize(16);
                    setLineSpacing(1.5);
                  }}
                />
              </div>
            </section>
          )}

          {/* Export Section */}
          {extractedText && (
            <section className="flex justify-center mt-8">
              <ExportPanel
                onExport={handleExport}
                isProcessing={isProcessing && processingStatus === "processing"}
                progress={processingProgress}
                isComplete={processingStatus === "complete"}
                fileName={
                  uploadedFile
                    ? `enhanced-${uploadedFile.name}.pdf`
                    : "enhanced-document.pdf"
                }
              />
            </section>
          )}
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>Document Readability Enhancer &copy; {new Date().getFullYear()}</p>
          <p className="mt-1">
            Improve reading speed by strategically bolding initial letters of
            words
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
