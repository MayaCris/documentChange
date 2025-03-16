import { useState } from "react";
import Header from "./Header";
import UploadArea from "./UploadArea";
import TextPreviewPanel from "./TextPreviewPanel";
import ControlPanel from "./ControlPanel";
import ExportPanel from "./ExportPanel";
import ProcessingIndicator from "./ProcessingIndicator";
import { PDFDocument, StandardFonts, rgb, PDFName, PDFDict } from 'pdf-lib';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import * as pdfjs from 'pdfjs-dist';

// Set worker path to use local worker file
pdfjs.GlobalWorkerOptions.workerSrc = '../../node_modules/pdfjs-dist/build/pdf.worker.mjs';

interface TextContent {
  items: Array<{ str: string }>;
}

// Function to clean text while preserving accents and special characters
const cleanText = (text: string): string => {
  // Keep letters (including accented), numbers, basic punctuation
  return text.replace(/[^\p{L}\p{N}\s.,!?¡¿;:'"()-]/gu, '')
    .replace(/[\u0300-\u036f]/g, c => c) // Preserve combining diacritical marks
    .trim();
};

const Home = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingProgress, setProcessingProgress] = useState<number>(0);
  const [processingStatus, setProcessingStatus] = useState<
    "idle" | "processing" | "complete" | "error"
  >("idle");
  const [allParagraphs, setAllParagraphs] = useState<string[]>([]);
  const [open, setOpen] = useState(false)

  // Control panel states
  const [boldingRules, setBoldingRules] = useState({
    shortWords: 1,
    mediumWords: 2,
    longWords: 3,
  });
  const [fontSize, setFontSize] = useState<number>(16);
  const [lineSpacing, setLineSpacing] = useState<number>(1.5);

  // Function to extract text from file
  const extractTextFromFile = async (file: File): Promise<string> => {
    if (!file) {
      return Promise.reject("No file selected");
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument(arrayBuffer).promise;
      setProcessingProgress(30);

      let fullText = "";
      
      // Extract text from each page
      setProcessingProgress(50);
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent() as TextContent;
        const pageText = textContent.items.map(item => item.str).join(" ");
        fullText += pageText + " ";
      }

          // Dividir el texto en párrafos usando expresiones regulares
          // Busca secuencias de texto que terminen en punto seguido de espacio o nueva línea
          setProcessingProgress(70);
          const paragraphs = fullText
            .split(/(?<=\.)\s+/)  // Divide después de un punto seguido de espacios
            .filter(paragraph => paragraph.trim().length > 80) // Solo párrafos con cierta longitud
            .map(paragraph => paragraph.trim());

      setAllParagraphs(paragraphs);

      // Select random consecutive paragraphs
      setProcessingProgress(85);
      const numParagraphsToSelect = Math.floor(Math.random() * 3) + 3; // 3-5 paragraphs

      let startIndex = 0;
      if (paragraphs.length > numParagraphsToSelect) {
        startIndex = Math.floor(Math.random() * (paragraphs.length - numParagraphsToSelect));
      }

      const selectedParagraphs = paragraphs.slice(startIndex, startIndex + numParagraphsToSelect);
      const result = selectedParagraphs.join("\n\n");
      
      setProcessingProgress(100);
      return result;
    } catch (error) {
      console.error("Error processing PDF:", error);
      return Promise.reject("Error processing PDF file");
    }
  };

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setProcessingStatus("processing");
    setIsProcessing(true);
    setExtractedText(""); // Clear previous text
    setProcessingProgress(0);
    setOpen(true);

    // Inicia el proceso de extracción con un pequeño delay para mostrar el progreso visual
    setTimeout(() => {
      setProcessingProgress(10);

      extractTextFromFile(file)
        .then((text) => {
          setExtractedText(text);
          setIsProcessing(false);
          setOpen(false);
          setProcessingStatus("complete");
        })
        .catch((error) => {
          console.error("Error extracting text:", error);
          setProcessingStatus("error");
          setIsProcessing(false);
          setOpen(false);
        });
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

  // Función para extraer un nuevo párrafo aleatorio del PDF ya procesado
  const handleGenerateNewText = () => {
    if (allParagraphs.length === 0) {
      return;
    }

    setProcessingStatus("processing");
    setOpen(true);
    setIsProcessing(true);
    setProcessingProgress(0);

    // Simula un procesamiento con actualizaciones de progreso
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setProcessingProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);

        // Selecciona un párrafo aleatorio o varios consecutivos
        const numParagraphsToSelect = Math.floor(Math.random() * 3) + 3;
        let startIndex = Math.floor(Math.random() * (allParagraphs.length - numParagraphsToSelect));
        if (startIndex < 0) startIndex = 0;

        const selectedParagraphs = allParagraphs.slice(startIndex, startIndex + numParagraphsToSelect);
        const newText = selectedParagraphs.join("\n\n");

        setExtractedText(newText);
        setOpen(false);
        setIsProcessing(false);
        setProcessingStatus("complete");
      }
    }, 100);
  };

  // Handle export
  const handleExport = async () => {
    setProcessingStatus("processing");
    setOpen(true);
    setIsProcessing(true);
    setProcessingProgress(0);

    try {
      if (!uploadedFile) {
        throw new Error("No file uploaded");
      }

      // Create two separate array buffers from the file
      const fileBlob = new Blob([uploadedFile]);
      const pdfJsArrayBuffer = await fileBlob.arrayBuffer();
      const pdfLibArrayBuffer = await fileBlob.arrayBuffer();

      // Load the PDF with pdf-lib for modification
      const pdfDoc = await PDFDocument.load(pdfLibArrayBuffer);
      
      // Embed the fonts we'll use
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      
      setProcessingProgress(20);

      // Process each paragraph
      let currentPage = pdfDoc.addPage([612, 792]); // US Letter size
      let { width, height } = currentPage.getSize();
      let yOffset = height - 50;
      let xOffset = 50;

      for (const paragraph of allParagraphs) {
        const words = paragraph.split(/\s+/).filter(word => word.trim());
        
        for (const word of words) {
          // Clean the word while preserving accents
          const cleanWord = cleanText(word);
          if (!cleanWord) continue;

          // Determine bold length based on word length
          let boldLength = boldingRules.shortWords;
          if (cleanWord.length > 6) {
            boldLength = boldingRules.longWords;
          } else if (cleanWord.length > 3) {
            boldLength = boldingRules.mediumWords;
          }
          boldLength = Math.min(boldLength, cleanWord.length);

          const boldPart = cleanWord.substring(0, boldLength);
          const regularPart = cleanWord.substring(boldLength);

          // Calculate word widths
          const boldWidth = helveticaBoldFont.widthOfTextAtSize(boldPart, fontSize);
          const regularWidth = helveticaFont.widthOfTextAtSize(regularPart + ' ', fontSize);
          const totalWidth = boldWidth + regularWidth;

          // Check if we need to start a new line
          if (xOffset + totalWidth > width - 50) {
            xOffset = 50;
            yOffset -= fontSize * lineSpacing;

            // Check if we need a new page
            if (yOffset < 50) {
              currentPage = pdfDoc.addPage([width, height]);
              yOffset = height - 50;
              xOffset = 50;
            }
          }

          // Draw bold part
          currentPage.drawText(boldPart, {
            x: xOffset,
            y: yOffset,
            size: fontSize,
            font: helveticaBoldFont,
            color: rgb(0, 0, 0),
          });

          // Draw regular part
          currentPage.drawText(regularPart + ' ', {
            x: xOffset + boldWidth,
            y: yOffset,
            size: fontSize,
            font: helveticaFont,
            color: rgb(0, 0, 0),
          });

          xOffset += totalWidth;
        }

        // Move to next paragraph
        yOffset -= fontSize * lineSpacing * 1.5;
        xOffset = 50;

        // Check if we need a new page for the next paragraph
        if (yOffset < 50) {
          currentPage = pdfDoc.addPage([width, height]);
          yOffset = height - 50;
          xOffset = 50;
        }

        setProcessingProgress(20 + (allParagraphs.indexOf(paragraph) / allParagraphs.length) * 60);
      }

      setProcessingProgress(80);

      // Save the PDF
      const pdfBytes = await pdfDoc.save();
      
      setProcessingProgress(90);

      // Create and trigger download
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = uploadedFile 
        ? `ReadEasy-${uploadedFile.name.replace(/\.[^/.]+$/, "")}.pdf`
        : "ReadEasy-document.pdf";
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setProcessingProgress(100);
      setProcessingStatus("complete");
    } catch (error) {
      console.error('Error during export:', error);
      setProcessingStatus("error");
    } finally {
      setIsProcessing(false);
      setOpen(false);
    }
  };


  return (
    <div className="min-h-screen bg-slate-100">
      <Header />

      <main className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 gap-8">
          {/* Upload Section */}
          <section className="flex justify-center">
            {!uploadedFile && <UploadArea onFileUpload={handleFileUpload} />}

            {/* {isProcessing && (
              <ProcessingIndicator
                status={processingStatus}
                progress={processingProgress}
                message={
                  uploadedFile
                    ? `Processing ${uploadedFile.name}...`
                    : "Processing document..."
                }
              />
            )} */}
            <Dialog open={open} onClose={setOpen} className="relative z-10">
              <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
              />
              <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                  <DialogPanel
                    transition
                    className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                  >
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                      <div className="sm:flex sm:items-start">
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                          <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                            Processing document...
                          </DialogTitle>
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
                        </div>
                      </div>
                    </div>
                  </DialogPanel>
                </div>
              </div>
            </Dialog>
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
                  onGenerateNewText={handleGenerateNewText}
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
                isProcessing={isProcessing}
                progress={processingProgress}
                isComplete={processingStatus === "complete"}
                hasError={processingStatus === "error"}
                fileName={
                  uploadedFile
                    ? `ReadEasy-${uploadedFile.name.replace(/\.[^/.]+$/, "")}.pdf`
                    : "ReadEasy-document.pdf"
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
