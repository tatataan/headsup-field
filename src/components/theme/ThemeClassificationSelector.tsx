import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useThemeClassifications } from "@/hooks/useThemes";

interface ThemeClassificationSelectorProps {
  majorTheme: string;
  middleTheme: string;
  detailTheme: string;
  onMajorThemeChange: (value: string) => void;
  onMiddleThemeChange: (value: string) => void;
  onDetailThemeChange: (value: string) => void;
}

export const ThemeClassificationSelector = ({
  majorTheme,
  middleTheme,
  detailTheme,
  onMajorThemeChange,
  onMiddleThemeChange,
  onDetailThemeChange,
}: ThemeClassificationSelectorProps) => {
  const { data: classifications, isLoading } = useThemeClassifications();

  const selectedMajor = classifications?.find(
    (c) => c.major_theme === majorTheme
  );
  const selectedMiddle = selectedMajor?.middle_themes.find(
    (m) => m.middle_theme === middleTheme
  );

  const handleMajorChange = (value: string) => {
    onMajorThemeChange(value);
    onMiddleThemeChange("");
    onDetailThemeChange("");
  };

  const handleMiddleChange = (value: string) => {
    onMiddleThemeChange(value);
    onDetailThemeChange("");
  };

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">読み込み中...</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="major-theme">テーマ大分類</Label>
        <Select value={majorTheme} onValueChange={handleMajorChange}>
          <SelectTrigger id="major-theme" className="mt-2">
            <SelectValue placeholder="大分類を選択" />
          </SelectTrigger>
          <SelectContent>
            {classifications?.map((c) => (
              <SelectItem key={c.major_theme} value={c.major_theme}>
                {c.major_theme}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {majorTheme && (
        <div>
          <Label htmlFor="middle-theme">テーマ中分類</Label>
          <Select value={middleTheme} onValueChange={handleMiddleChange}>
            <SelectTrigger id="middle-theme" className="mt-2">
              <SelectValue placeholder="中分類を選択" />
            </SelectTrigger>
            <SelectContent>
              {selectedMajor?.middle_themes.map((m) => (
                <SelectItem key={m.middle_theme} value={m.middle_theme}>
                  {m.middle_theme}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {middleTheme && (
        <div>
          <Label htmlFor="detail-theme">テーマ小分類</Label>
          <Select value={detailTheme} onValueChange={onDetailThemeChange}>
            <SelectTrigger id="detail-theme" className="mt-2">
              <SelectValue placeholder="小分類を選択" />
            </SelectTrigger>
            <SelectContent>
              {selectedMiddle?.detail_themes.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};
