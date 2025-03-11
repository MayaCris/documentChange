import React from "react";
import { cn } from "../lib/utils";
import { BookOpen } from "lucide-react";

interface HeaderProps {
  title?: string;
  description?: string;
}

const Header = ({
  title = "Document Readability Enhancer",
  description = "Upload documents and enhance readability by strategically bolding initial letters of words",
}: HeaderProps) => {
  return (
    <header className="w-full bg-slate-50 border-b border-slate-200 py-4 px-6 shadow-sm">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
        </div>
        <p className="text-slate-600 text-sm md:text-base max-w-2xl">
          {description}
        </p>
      </div>
    </header>
  );
};

export default Header;
