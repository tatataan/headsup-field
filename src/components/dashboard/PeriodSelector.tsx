import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PeriodType } from "@/types/kpi";

interface PeriodSelectorProps {
  value: PeriodType;
  onChange: (value: PeriodType) => void;
}

export const PeriodSelector = ({ value, onChange }: PeriodSelectorProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="期間を選択" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="monthly">月次</SelectItem>
        <SelectItem value="quarterly">四半期</SelectItem>
        <SelectItem value="yearly">年次</SelectItem>
      </SelectContent>
    </Select>
  );
};
