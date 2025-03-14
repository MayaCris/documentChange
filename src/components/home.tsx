import { useState } from "react";
import Header from "./Header";
import UploadArea from "./UploadArea";
import TextPreviewPanel from "./TextPreviewPanel";
import ControlPanel from "./ControlPanel";
import ExportPanel from "./ExportPanel";
import ProcessingIndicator from "./ProcessingIndicator";
import * as pdfjs from "pdfjs-dist";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'

pdfjs.GlobalWorkerOptions.workerSrc = '../../node_modules/pdfjs-dist/build/pdf.worker.mjs';


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
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async () => {
        try {
          setProcessingProgress(30);
          const typedArray = new Uint8Array(reader.result as ArrayBuffer);
          const pdf = await pdfjs.getDocument(typedArray).promise;
          let fullText = "";

          // Extraer texto de todas las páginas
          setProcessingProgress(50);
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item) => item.str).join(" ");
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

          // Seleccionar un número aleatorio de párrafos (entre 3 y 5)
          setProcessingProgress(85);
          const numParagraphsToSelect = Math.floor(Math.random() * 3) + 3;

          // Seleccionar un punto de inicio aleatorio para asegurar que los párrafos sean consecutivos
          let startIndex = 0;
          if (paragraphs.length > numParagraphsToSelect) {
            startIndex = Math.floor(Math.random() * (paragraphs.length - numParagraphsToSelect));
          }

          // Extraer los párrafos consecutivos
          const selectedParagraphs = paragraphs.slice(startIndex, startIndex + numParagraphsToSelect);

          // Unir los párrafos seleccionados con doble salto de línea para separarlos
          const result = selectedParagraphs.join("\n\n");
          setProcessingProgress(100);
          resolve(result);
        } catch (error) {
          console.error("Error processing PDF:", error);
          reject("Error processing PDF file");
        }
      };

      reader.onerror = () => {
        reject("Error reading file");
      };

      reader.readAsArrayBuffer(file);
    });
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
    console.log("allParagraphs", allParagraphs);
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
    setOpen(false);
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
