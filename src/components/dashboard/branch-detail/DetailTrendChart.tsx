import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DetailTrendChartProps {
  title: string;
  data: { month: string; anp: number; contractCount: number }[];
  dataKey: string;
}

export const DetailTrendChart = ({ title, data, dataKey }: DetailTrendChartProps) => {
  const formatValue = (value: number) => {
    if (dataKey === "anp") return `¥${value}M`;
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
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  color: "hsl(var(--popover-foreground))",
                }}
                formatter={(value: number) => [formatValue(value), title]}
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
