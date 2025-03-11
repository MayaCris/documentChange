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
  const [boldingRule, setBoldingRule] = useState<number>(2);
  const [fontSize, setFontSize] = useState<number>(16);
  const [spacing, setSpacing] = useState<number>(1.5);
  const [boldingOption, setBoldingOption] = useState<string>("proportional");

  // Handle bolding rule change
  const handleBoldingRuleChange = (value: number[]) => {
    const newValue = value[0];
    setBoldingRule(newValue);
    onBoldingRuleChange(newValue);
  };

  // Handle font size change
  const handleFontSizeChange = (value: number[]) => {
    const newValue = value[0];
    setFontSize(newValue);
    onFontSizeChange(newValue);
  };

  // Handle spacing change
  const handleSpacingChange = (value: number[]) => {
    const newValue = value[0];
    setSpacing(newValue);
    onSpacingChange(newValue);
  };

  // Handle bolding option change
  const handleBoldingOptionChange = (value: string) => {
    setBoldingOption(value);
  };

  // Handle reset
  const handleReset = () => {
    setBoldingRule(2);
    setFontSize(16);
    setSpacing(1.5);
    setBoldingOption("proportional");
    onReset();
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
                value={boldingOption}
                onValueChange={handleBoldingOptionChange}
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
                <span className="text-sm font-medium">{boldingRule}</span>
              </div>
              <Slider
                value={[boldingRule]}
                min={1}
                max={5}
                step={1}
                onValueChange={handleBoldingRuleChange}
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
              <span className="text-sm font-medium">{fontSize}px</span>
            </div>
            <Slider
              value={[fontSize]}
              min={12}
              max={24}
              step={1}
              onValueChange={handleFontSizeChange}
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
              <span className="text-sm font-medium">{spacing.toFixed(1)}</span>
            </div>
            <Slider
              value={[spacing]}
              min={1}
              max={3}
              step={0.1}
              onValueChange={handleSpacingChange}
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-400">Tight (1.0)</span>
              <span className="text-xs text-gray-400">Loose (3.0)</span>
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <Button className="w-full">Apply Changes</Button>
      </CardContent>
    </Card>
  );
};

export default ControlPanel;
