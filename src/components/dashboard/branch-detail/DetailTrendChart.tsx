import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DetailTrendChartProps {
  title: string;
  data: { month: string; anp: number; contractCount: number; continuationRate: number }[];
  dataKey: string;
}

export const DetailTrendChart = ({ title, data, dataKey }: DetailTrendChartProps) => {
  // Y軸用のフォーマット関数
  const formatYAxisValue = (value: number) => {
    if (dataKey === "anp") {
      return `¥${(value / 1000000).toFixed(0)}M`;
    } else if (dataKey === "continuationRate") {
      return `${value}%`;
    } else {
      return value.toString();
    }
  };

  // Tooltip用のフォーマット関数
  const formatTooltipValue = (value: number) => {
    if (dataKey === "anp") return `¥${(value / 1000000).toFixed(1)}M`;
    if (dataKey === "continuationRate") return `${value}%`;
    return `${value.toLocaleString()}件`;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title} - 詳細推移</h3>
      <Tabs defaultValue="monthly" className="w-full">
        <TabsList>
          <TabsTrigger value="monthly">月次</TabsTrigger>
          <TabsTrigger value="weekly" disabled>週次</TabsTrigger>
          <TabsTrigger value="daily" disabled>日次</TabsTrigger>
        </TabsList>
        <TabsContent value="monthly" className="mt-4">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="month"
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                tickFormatter={formatYAxisValue}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  color: "hsl(var(--popover-foreground))",
                }}
                formatter={(value: number) => [formatTooltipValue(value), title]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                name={title}
                dot={{ fill: "hsl(var(--primary))", r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </TabsContent>
      </Tabs>
    </div>
  );
};
