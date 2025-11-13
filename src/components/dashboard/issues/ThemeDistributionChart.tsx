import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useThemes } from "@/hooks/useThemes";
import { generateThemeColors } from "@/lib/theme-colors";
import { useMemo } from "react";

interface ThemeDistributionChartProps {
  data: { theme: string; count: number; percentage: number }[];
  onThemeClick?: (theme: string) => void;
}

export const ThemeDistributionChart = ({ data, onThemeClick }: ThemeDistributionChartProps) => {
  const { data: themesData } = useThemes();
  
  // Get unique major themes from database
  const majorThemes = useMemo(() => {
    if (!themesData) return [];
    return Array.from(new Set(themesData.map(t => t.major_theme)));
  }, [themesData]);

  const COLORS = useMemo(() => 
    generateThemeColors(majorThemes), 
    [majorThemes]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>経営課題テーマ分布</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
            <YAxis dataKey="theme" type="category" width={100} stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--card))", 
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px"
              }}
              formatter={(value: number, name: string, props: any) => [
                `${value}件 (${props.payload.percentage.toFixed(1)}%)`, 
                "ヒアリング数"
              ]}
            />
            <Bar 
              dataKey="count" 
              radius={[0, 8, 8, 0]}
              onClick={(data) => onThemeClick?.(data.theme)}
              cursor="pointer"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[entry.theme as keyof typeof COLORS] || "hsl(var(--primary))"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
