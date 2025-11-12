import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { branches } from "@/data/branches";
import { useMemo } from "react";

const THEME_COLORS: { [key: string]: string } = {
  "人材・育成": "hsl(var(--chart-1))",
  "商品": "hsl(var(--chart-2))",
  "業務運営": "hsl(var(--chart-3))",
  "システム": "hsl(var(--chart-4))",
  "その他": "hsl(var(--chart-5))",
};

interface BranchComparisonChartProps {
  data: Array<{
    branchId: string;
    themes: { [theme: string]: number };
    total: number;
  }>;
  onBranchClick?: (branchId: string) => void;
  topN?: number;
}

export const BranchComparisonChart = ({
  data,
  onBranchClick,
  topN = 10,
}: BranchComparisonChartProps) => {
  const chartData = useMemo(() => {
    const sorted = [...data].sort((a, b) => b.total - a.total);
    const topBranches = sorted.slice(0, topN);

    return topBranches.map(item => {
      const branch = branches.find(b => b.id === item.branchId);
      return {
        name: branch?.name || item.branchId,
        branchId: item.branchId,
        ...item.themes,
      };
    });
  }, [data, topN]);

  const allThemes = Array.from(
    new Set(data.flatMap(d => Object.keys(d.themes)))
  );

  const handleBarClick = (data: any) => {
    if (onBranchClick && data.branchId) {
      onBranchClick(data.branchId);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>支社別課題分布（上位{topN}支社）</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={500}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
            <YAxis
              dataKey="name"
              type="category"
              stroke="hsl(var(--muted-foreground))"
              width={110}
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Legend />
            {allThemes.map(theme => (
              <Bar
                key={theme}
                dataKey={theme}
                stackId="a"
                fill={THEME_COLORS[theme] || "hsl(var(--muted))"}
                onClick={handleBarClick}
                cursor="pointer"
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
