import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface RegionData {
  name: string;
  achievement: number;
}

interface RegionalHeatmapProps {
  data: RegionData[];
}

export const RegionalHeatmap = ({ data }: RegionalHeatmapProps) => {
  const getColorClass = (achievement: number) => {
    if (achievement >= 100) return "bg-success/80 text-success-foreground";
    if (achievement >= 90) return "bg-chart-2/80 text-foreground";
    if (achievement >= 80) return "bg-warning/80 text-warning-foreground";
    return "bg-destructive/80 text-destructive-foreground";
  };

  const getColorIntensity = (achievement: number) => {
    if (achievement >= 100) return "opacity-100";
    if (achievement >= 90) return "opacity-80";
    if (achievement >= 80) return "opacity-60";
    return "opacity-40";
  };

  return (
    <Card className="glass-effect hover:border-accent/50 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">地域別達成率</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {data.map((region, index) => (
            <div
              key={index}
              className={cn(
                "p-4 rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer",
                getColorClass(region.achievement),
                getColorIntensity(region.achievement)
              )}
            >
              <div className="text-sm font-medium mb-1">{region.name}</div>
              <div className="text-2xl font-bold">{region.achievement}%</div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-destructive/80"></div>
            <span>&lt;80%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-warning/80"></div>
            <span>80-89%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-chart-2/80"></div>
            <span>90-99%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-success/80"></div>
            <span>100%+</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};