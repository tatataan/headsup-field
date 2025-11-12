import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface DetailTrendChartProps {
  title: string;
  data: Array<({ month: string } | { period: string }) & { anp: number; contractCount: number; continuationRate: number }>;
  dataKey: string;
}

export const DetailTrendChart = ({ title, data, dataKey }: DetailTrendChartProps) => {
  // Determine if data uses 'month' or 'period' for x-axis
  const xAxisKey = data.length > 0 && 'period' in data[0] ? 'period' : 'month';
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
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey={xAxisKey}
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
  );
};
