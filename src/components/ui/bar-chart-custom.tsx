import { cn } from "@/lib/utils";

interface BarChartCustomProps {
  data: { value: number; label?: string }[];
  maxValue?: number;
  height?: number;
  className?: string;
}

export const BarChartCustom = ({ 
  data, 
  maxValue, 
  height = 80,
  className 
}: BarChartCustomProps) => {
  const max = maxValue || Math.max(...data.map(d => d.value));
  
  return (
    <div className={cn("flex items-end gap-1.5", className)} style={{ height: `${height}px` }}>
      {data.map((item, index) => {
        const barHeight = (item.value / max) * 100;
        return (
          <div
            key={index}
            className="flex-1 flex flex-col items-center gap-1"
          >
            <div className="w-full flex items-end" style={{ height: `${height - 20}px` }}>
              <div
                className="w-full bg-gradient-to-t from-chart-1 via-chart-2 to-chart-3 rounded-t transition-all duration-500 ease-out hover:opacity-80"
                style={{ height: `${barHeight}%` }}
              />
            </div>
            {item.label && (
              <span className="text-[10px] text-muted-foreground">{item.label}</span>
            )}
          </div>
        );
      })}
    </div>
  );
};
