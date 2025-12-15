import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface OutputFormatSelectorProps {
  aspectRatio: string;
  onAspectRatioChange: (value: string) => void;
}

export const OutputFormatSelector = ({
  aspectRatio,
  onAspectRatioChange,
}: OutputFormatSelectorProps) => {
  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-4">Output Format</h2>
      <RadioGroup value={aspectRatio} onValueChange={onAspectRatioChange} className="flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="9:16" id="r1" />
          <Label htmlFor="r1" className="cursor-pointer">
            <div>
              <span className="font-medium">9:16 - Stories/Reels</span>
              <p className="text-xs text-muted-foreground">Instagram • TikTok • YouTube Shorts</p>
            </div>
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="3:4" id="r2" />
          <Label htmlFor="r2" className="cursor-pointer">
            <div>
              <span className="font-medium">3:4 - Feed Posts</span>
              <p className="text-xs text-muted-foreground">Instagram Feed</p>
            </div>
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="1:1" id="r3" />
          <Label htmlFor="r3" className="cursor-pointer">
            <div>
              <span className="font-medium">1:1 - Square</span>
              <p className="text-xs text-muted-foreground">Instagram • Facebook • Twitter/X</p>
            </div>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};
