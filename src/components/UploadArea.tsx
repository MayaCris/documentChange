import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

interface UploadAreaProps {
  onFileUpload?: (file: File) => void;
  acceptedFileTypes?: string[];
  maxFileSize?: number;
}

const UploadArea = ({
  onFileUpload = () => {},
  acceptedFileTypes = [".pdf", ".doc", ".docx"],
  maxFileSize = 10 * 1024 * 1024, // 10MB default
}: UploadAreaProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);
      if (acceptedFiles.length === 0) {
        return;
      }

      const selectedFile = acceptedFiles[0];

      // Check file type
      const fileExtension = `.${selectedFile.name.split(".").pop()?.toLowerCase()}`;
      if (!acceptedFileTypes.includes(fileExtension)) {
        setError(
          `Invalid file type. Please upload ${acceptedFileTypes.join(", ")} files only.`,
        );
        return;
      }

      // Check file size
      if (selectedFile.size > maxFileSize) {
        setError(
          `File is too large. Maximum size is ${maxFileSize / (1024 * 1024)}MB.`,
        );
        return;
      }

      setFile(selectedFile);
      onFileUpload(selectedFile);
    },
    [acceptedFileTypes, maxFileSize, onFileUpload],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  React.useEffect(() => {
    setIsDragging(isDragActive);
  }, [isDragActive]);

  return (
    <div className="w-full max-w-[600px] mx-auto bg-white p-6 rounded-lg shadow-md">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-md p-8 flex flex-col items-center justify-center cursor-pointer transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-gray-300 hover:border-primary/50",
          file ? "bg-green-50 border-green-300" : "",
        )}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center text-center">
          {file ? (
            <>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium mb-1">{file.name}</h3>
              <p className="text-sm text-gray-500 mb-4">
                {(file.size / 1024).toFixed(2)} KB
              </p>
              <Button
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
              >
                Remove file
              </Button>
            </>
          ) : (
            <>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-1">
                Drag & drop your document here
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Supported formats: {acceptedFileTypes.join(", ")}
              </p>
              <p className="text-xs text-gray-400 mb-4">
                Maximum file size: {maxFileSize / (1024 * 1024)}MB
              </p>
              <Button>Browse files</Button>
            </>
          )}
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default UploadArea;
