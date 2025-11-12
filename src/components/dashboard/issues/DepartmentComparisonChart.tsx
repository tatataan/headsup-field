import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { departments } from "@/data/departments";

const THEME_COLORS: { [key: string]: string } = {
  "人材・育成": "hsl(var(--chart-1))",
  "商品": "hsl(var(--chart-2))",
  "業務運営": "hsl(var(--chart-3))",
  "システム": "hsl(var(--chart-4))",
  "その他": "hsl(var(--chart-5))",
};

interface DepartmentComparisonChartProps {
  data: Array<{
    departmentId: string;
    themes: { [theme: string]: number };
    total: number;
  }>;
  onDepartmentClick?: (departmentId: string) => void;
}

export const DepartmentComparisonChart = ({
  data,
  onDepartmentClick,
}: DepartmentComparisonChartProps) => {
  const chartData = data.map(item => {
    const dept = departments.find(d => d.id === item.departmentId);
    return {
      name: dept?.name || item.departmentId,
      departmentId: item.departmentId,
      ...item.themes,
    };
  });

  const allThemes = Array.from(
    new Set(data.flatMap(d => Object.keys(d.themes)))
  );

  const handleBarClick = (data: any) => {
    if (onDepartmentClick && data.departmentId) {
      onDepartmentClick(data.departmentId);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>統括部別課題分布</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
            <YAxis
              dataKey="name"
              type="category"
              stroke="hsl(var(--muted-foreground))"
              width={90}
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
