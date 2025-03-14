import React, { useState } from "react";
import { ScrollArea } from "../components/ui/scroll-area";
import { Card } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Skeleton } from "../components/ui/skeleton";

interface TextPreviewPanelProps {
  text: string;
  isLoading?: boolean;
  boldingRules?: {
    shortWords: number;
    mediumWords: number;
    longWords: number;
  };
  fontSize?: number;
  lineSpacing?: number;
  onGenerateNewText?: () => void;
}

const applyBolding = (
  text: string,
  boldingRules: TextPreviewPanelProps["boldingRules"],
) => {
  if (!text) return [];

  const rules = boldingRules || { shortWords: 1, mediumWords: 2, longWords: 3 };

  // Split text into paragraphs first
  return text.split(".").map((paragraph, paragraphIndex) => {
    if (!paragraph.trim()) return null;

    const words = paragraph
      .trim()
      .split(" ")
      .map((word, wordIndex) => {
        // Skip empty words
        if (!word.trim()) return null;

        let boldLength = rules.shortWords;

        if (word.length > 6) {
          boldLength = rules.longWords;
        } else if (word.length > 3) {
          boldLength = rules.mediumWords;
        }

        // Ensure we don't try to bold more characters than exist in the word
        boldLength = Math.min(boldLength, word.length);

        const boldPart = word.substring(0, boldLength);
        const regularPart = word.substring(boldLength);

        return (
          <React.Fragment key={`word-${paragraphIndex}-${wordIndex}`}>
            <span className="font-bold">{boldPart}</span>
            <span>{regularPart}</span>{" "}
          </React.Fragment>
        );
      });

    return (
      <React.Fragment key={`paragraph-${paragraphIndex}`}>
        {words}
        {paragraphIndex < text.split(".").length - 1 && ". "}
      </React.Fragment>
    );
  });
};

const TextPreviewPanel: React.FC<TextPreviewPanelProps> = ({
  text = "Lorem ipsum. ",
  isLoading = false,
  boldingRules = { shortWords: 1, mediumWords: 2, longWords: 3 },
  fontSize = 16,
  lineSpacing = 1.5,
  onGenerateNewText,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [previewMode, setPreviewMode] = useState<"full" | "excerpt">("excerpt");

  // Extract a meaningful excerpt from the text (first 150-200 characters ending at a period)
  const getExcerpt = (fullText: string): string => {
    if (!fullText) return "";

    const minLength = 150;
    const maxLength = 200;

    // If text is already short enough, return it all
    if (fullText.length <= maxLength) return fullText;

    // Find a good breaking point (period) between min and max length
    let cutoff = maxLength;
    for (let i = minLength; i <= maxLength; i++) {
      if (i >= fullText.length) {
        cutoff = fullText.length;
        break;
      }
      if (fullText[i] === ".") {
        cutoff = i + 1; // Include the period
        break;
      }
    }

    // If no good breaking point found, just use the max length
    if (cutoff > maxLength) cutoff = maxLength;

    return (
      fullText.substring(0, cutoff) + (cutoff < fullText.length ? "..." : "")
    );
  };

  // Get the text to display based on preview mode
  const displayText = previewMode === "excerpt" ? getExcerpt(text) : text;

  return (
    <Card className={`w-full bg-white border rounded-lg shadow-md overflow-hidden ${
      isExpanded ? 'h-[600px] max-h-[600px]' : 'h-full max-h-[450px]'
    }`}>
      <div className="p-4 border-b bg-slate-50">
        <h2 className="text-lg font-semibold">Enhanced Text Preview</h2>
        <p className="text-sm text-gray-500">
          Preview how your document will look with enhanced readability
        </p>
      </div>

      <div className="p-4">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[95%]" />
            <Skeleton className="h-4 w-[85%]" />
            <Skeleton className="h-4 w-full" />
          </div>
        ) : text ? (
          <ScrollArea className={`rounded-md border p-4 ${
            isExpanded ? 'h-[450px]' : 'h-[289px]'
          }`}>
            <div
              style={{
                fontSize: `${fontSize}px`,
                lineHeight: `${lineSpacing}`,
              }}
              className="text-justify"
            >
              {applyBolding(displayText, boldingRules)}
            </div>
          </ScrollArea>
        ) : (
          <div className={`flex items-center justify-center border rounded-md bg-slate-50 ${
            isExpanded ? 'h-[450px]' : 'h-[350px]'
          }`}>
            <p className="text-gray-500 text-center">
              Upload a document to see the enhanced text preview
            </p>
          </div>
        )}
      </div>

      <Separator />

      <div className="p-4 bg-slate-50 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {text ? (
            <span>
              Showing enhanced text with {boldingRules.shortWords}/
              {boldingRules.mediumWords}/{boldingRules.longWords} bolding rule
            </span>
          ) : (
            <span>No document loaded</span>
          )}
        </div>

        <div className="flex gap-4">
          {text && text.length > 200 && (
            <>
              <button
                onClick={onGenerateNewText}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Generate New Text
              </button>
              <button
                onClick={() =>
                  setPreviewMode(previewMode === "excerpt" ? "full" : "excerpt")
                }
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {previewMode === "excerpt" ? "Show Full Text" : "Show Excerpt"}
              </button>
            </>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {isExpanded ? "Collapse" : "Expand"}
          </button>
        </div>
      </div>
    </Card>
  );
};

export default TextPreviewPanel;
