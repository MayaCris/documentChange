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
}

const applyBolding = (
  text: string,
  boldingRules: TextPreviewPanelProps["boldingRules"],
) => {
  if (!text) return [];

  const rules = boldingRules || { shortWords: 1, mediumWords: 2, longWords: 3 };

  return text.split(" ").map((word, index) => {
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
      <React.Fragment key={index}>
        <span className="font-bold">{boldPart}</span>
        <span>{regularPart}</span>{" "}
      </React.Fragment>
    );
  });
};

const TextPreviewPanel: React.FC<TextPreviewPanelProps> = ({
  text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.",
  isLoading = false,
  boldingRules = { shortWords: 1, mediumWords: 2, longWords: 3 },
  fontSize = 16,
  lineSpacing = 1.5,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="w-full h-full max-w-[800px] max-h-[500px] bg-white border rounded-lg shadow-md overflow-hidden">
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
          <ScrollArea className="h-[350px] rounded-md border p-4">
            <div
              style={{
                fontSize: `${fontSize}px`,
                lineHeight: `${lineSpacing}`,
              }}
              className="text-justify"
            >
              {applyBolding(text, boldingRules)}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex items-center justify-center h-[350px] border rounded-md bg-slate-50">
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

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {isExpanded ? "Collapse" : "Expand"}
        </button>
      </div>
    </Card>
  );
};

export default TextPreviewPanel;
