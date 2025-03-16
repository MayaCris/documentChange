import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Slider } from "./ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { Settings, RefreshCw, Type, AlignJustify } from "lucide-react";

interface ControlPanelProps {
  onBoldingRuleChange?: (value: number) => void;
  onFontSizeChange?: (value: number) => void;
  onSpacingChange?: (value: number) => void;
  onReset?: () => void;
}

const ControlPanel = ({
  onBoldingRuleChange = () => {},
  onFontSizeChange = () => {},
  onSpacingChange = () => {},
  onReset = () => {},
}: ControlPanelProps) => {
  // Default values for controls
  const [tempBoldingRule, setTempBoldingRule] = useState<number>(2);
  const [tempFontSize, setTempFontSize] = useState<number>(16);
  const [tempSpacing, setTempSpacing] = useState<number>(1.5);
  const [tempBoldingOption, setTempBoldingOption] = useState<string>("proportional");

  // Handle bolding rule change (temporary)
  const handleTempBoldingRuleChange = (value: number[]) => {
    const newValue = value[0];
    setTempBoldingRule(newValue);
  };

  // Handle font size change (temporary)
  const handleTempFontSizeChange = (value: number[]) => {
    const newValue = value[0];
    setTempFontSize(newValue);
  };

  // Handle spacing change (temporary)
  const handleTempSpacingChange = (value: number[]) => {
    const newValue = value[0];
    setTempSpacing(newValue);
  };

  // Handle bolding option change (temporary)
  const handleTempBoldingOptionChange = (value: string) => {
    setTempBoldingOption(value);

    // Update temporary bolding rules based on selected option
    if (value === "first-letter") {
      setTempBoldingRule(1);
    } else if (value === "fixed") {
      setTempBoldingRule(2);
    } else if (value === "proportional") {
      if (tempBoldingRule === 1) {
        setTempBoldingRule(2);
      }
    }
  };

  // Handle reset
  const handleReset = () => {
    setTempBoldingRule(2);
    setTempFontSize(16);
    setTempSpacing(1.5);
    setTempBoldingOption("proportional");
    onReset();
  };

  // Handle apply changes
  const handleApplyChanges = () => {
    onBoldingRuleChange(tempBoldingRule);
    onFontSizeChange(tempFontSize);
    onSpacingChange(tempSpacing);
  };

  return (
    <Card className="w-full h-full bg-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Control Panel</CardTitle>
            <CardDescription>
              Adjust document enhancement settings
            </CardDescription>
          </div>
          <Button variant="outline" size="icon" onClick={handleReset}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Bolding Rules Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-gray-500" />
            <h3 className="font-medium">Bolding Rules</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500 mb-2 block">
                Bolding Method
              </label>
              <Select
                value={tempBoldingOption}
                onValueChange={handleTempBoldingOptionChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select bolding method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="proportional">
                    Proportional (based on word length)
                  </SelectItem>
                  <SelectItem value="fixed">
                    Fixed (same for all words)
                  </SelectItem>
                  <SelectItem value="first-letter">
                    First letter only
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm text-gray-500">Letters to Bold</label>
                <span className="text-sm font-medium">{tempBoldingRule}</span>
              </div>
              <Slider
                value={[tempBoldingRule]}
                min={1}
                max={5}
                step={1}
                onValueChange={handleTempBoldingRuleChange}
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-400">Min (1)</span>
                <span className="text-xs text-gray-400">Max (5)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Font Size Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Type className="h-5 w-5 text-gray-500" />
            <h3 className="font-medium">Font Size</h3>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm text-gray-500">Size (px)</label>
              <span className="text-sm font-medium">{tempFontSize}px</span>
            </div>
            <Slider
              value={[tempFontSize]}
              min={12}
              max={24}
              step={1}
              onValueChange={handleTempFontSizeChange}
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-400">Small (12px)</span>
              <span className="text-xs text-gray-400">Large (24px)</span>
            </div>
          </div>
        </div>

        {/* Spacing Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AlignJustify className="h-5 w-5 text-gray-500" />
            <h3 className="font-medium">Line Spacing</h3>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm text-gray-500">Line Height</label>
              <span className="text-sm font-medium">{tempSpacing.toFixed(1)}</span>
            </div>
            <Slider
              value={[tempSpacing]}
              min={1}
              max={3}
              step={0.1}
              onValueChange={handleTempSpacingChange}
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-400">Tight (1.0)</span>
              <span className="text-xs text-gray-400">Loose (3.0)</span>
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <Button
          className="w-full"
          onClick={handleApplyChanges}
        >
          Apply Changes
        </Button>
      </CardContent>
    </Card>
  );
};

export default ControlPanel;
