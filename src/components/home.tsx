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

  // Sample text sections to simulate document extraction
  const sampleTextSections = [
    "The quick brown fox jumps over the lazy dog. This sentence contains every letter in the English alphabet. It is commonly used for testing fonts and keyboard layouts. The sentence has been used since at least the late 19th century.",
    "Readability is the ease with which a reader can understand a written text. In natural language, the readability of text depends on its content and its presentation. Researchers have used various factors to measure readability, such as speed of perception, perceptibility at a distance, perceptibility in peripheral vision, visibility, the reflex blink technique, rate of work, eye movements, and fatigue in reading.",
    "Learning to read is the process of acquiring the skills necessary for reading; that is, the ability to acquire meaning from print. Learning to read is paradoxical in some ways. For an adult who is a fairly good reader, reading seems like a simple, effortless and automatic skill but the process builds on cognitive, linguistic, and social skills developed in the years before reading typically begins.",
    "Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed. The arrangement of type involves selecting typefaces, point sizes, line lengths, line-spacing, and letter-spacing, and adjusting the space between pairs of letters.",
  ];

  // Function to extract text from file
  const extractTextFromFile = (file: File): Promise<string> => {
    // In a real app, this would use PDF.js or a similar library to extract text
    // For this demo, we'll simulate text extraction with sample text
    return new Promise((resolve) => {
      // Simulate processing delay
      setTimeout(() => {
        // Use filename to determine which sample text to use
        const fileName = file.name.toLowerCase();
        let extractedContent = "";

        if (fileName.includes("typography") || fileName.includes("font")) {
          extractedContent = sampleTextSections[3]; // Typography text
        } else if (fileName.includes("read") || fileName.includes("learning")) {
          extractedContent = sampleTextSections[2]; // Learning to read text
        } else if (fileName.includes("readability")) {
          extractedContent = sampleTextSections[1]; // Readability text
        } else {
          extractedContent = sampleTextSections[0]; // Default text
        }

        // Add some random sections to make it longer
        const additionalSections = [];
        const numAdditionalSections = Math.floor(Math.random() * 2) + 1; // 1-2 additional sections

        const availableSections = sampleTextSections.filter(
          (section) => section !== extractedContent,
        );

        for (
          let i = 0;
          i < numAdditionalSections && availableSections.length > 0;
          i++
        ) {
          const randomIndex = Math.floor(
            Math.random() * availableSections.length,
          );
          additionalSections.push(availableSections[randomIndex]);
          availableSections.splice(randomIndex, 1);
        }

        resolve([extractedContent, ...additionalSections].join(" "));
      }, 1500);
    });
  };

  // Handle file upload
  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setProcessingStatus("processing");
    setIsProcessing(true);
    setExtractedText(""); // Clear previous text

    // Simulate text extraction with progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setProcessingProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);

        // Extract text from the file
        extractTextFromFile(file)
          .then((text) => {
            setExtractedText(text);
            setIsProcessing(false);
            setProcessingStatus("complete");
          })
          .catch((error) => {
            console.error("Error extracting text:", error);
            setProcessingStatus("error");
            setIsProcessing(false);
          });
      }
    }, 200);
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
    setProcessingProgress(0);

    // Simulate export process with progress updates
    const interval = setInterval(() => {
      setProcessingProgress((prev) => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 200);

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000));

    clearInterval(interval);
    setProcessingProgress(100);
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
                    ? `ReadEasy-${uploadedFile.name.replace(/\.[^/.]+$/, "")}.pdf`
                    : "ReadEasy-document.pdf"
                }
                hasError={processingStatus === "error"}
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
