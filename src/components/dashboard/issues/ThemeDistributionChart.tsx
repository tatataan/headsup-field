import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface ThemeDistributionChartProps {
  data: { theme: string; count: number; percentage: number }[];
  onThemeClick?: (theme: string) => void;
}

const COLORS = {
  "経営・戦略": "hsl(var(--chart-1))",
  "人材・育成": "hsl(var(--chart-2))",
  "販売・市場": "hsl(var(--chart-3))",
  "品質・事務": "hsl(var(--chart-4))",
  "関係性・要望": "hsl(var(--chart-5))",
};

export const ThemeDistributionChart = ({ data, onThemeClick }: ThemeDistributionChartProps) => {
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
