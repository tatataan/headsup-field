import { Card } from "@/components/ui/card";
import { ContractBreakdownData } from "@/types/branch";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

interface ContractBreakdownAnalysisProps {
  breakdown: ContractBreakdownData;
}

export const ContractBreakdownAnalysis = ({ breakdown }: ContractBreakdownAnalysisProps) => {
  const newChange = ((breakdown.newContracts - breakdown.prevNewContracts) / breakdown.prevNewContracts) * 100;
  const cancelChange = ((breakdown.cancellations - breakdown.prevCancellations) / breakdown.prevCancellations) * 100;
  const netChange = ((breakdown.netIncrease - breakdown.prevNetIncrease) / breakdown.prevNetIncrease) * 100;

  const summaryCards = [
    {
      title: "新規契約数",
      value: breakdown.newContracts,
      change: newChange,
      color: "text-success",
    },
    {
      title: "解約数",
      value: breakdown.cancellations,
      change: cancelChange,
      color: "text-destructive",
    },
    {
      title: "純増数",
      value: breakdown.netIncrease,
      change: netChange,
      color: "text-primary",
    },
  ];

  return (
    <div className="space-y-6">
      {/* サマリーカード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {summaryCards.map((card) => {
          const isPositive = card.change > 0;
          return (
            <Card key={card.title} className="p-4">
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{card.title}</p>
                <p className={`text-3xl font-bold ${card.color}`}>{card.value.toLocaleString()}件</p>
                <div className="flex items-center gap-1 text-xs">
                  {isPositive ? (
                    <TrendingUp className="h-3 w-3 text-success" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-destructive" />
                  )}
                  <span className={isPositive ? "text-success" : "text-destructive"}>
                    {isPositive ? "+" : ""}
                    {card.change.toFixed(1)}%
                  </span>
                  <span className="text-muted-foreground">対前月</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* グラフエリア */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 新規・解約・純増の推移 */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">新規・解約・純増の推移</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={breakdown.monthlyTrend}>
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
                formatter={(value: number) => [`${value}件`, ""]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="new"
                stroke="hsl(var(--success))"
                strokeWidth={2}
                name="新規契約"
                dot={{ fill: "hsl(var(--success))", r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="cancel"
                stroke="hsl(var(--destructive))"
                strokeWidth={2}
                name="解約"
                dot={{ fill: "hsl(var(--destructive))", r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="net"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                name="純増"
                dot={{ fill: "hsl(var(--primary))", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 解約率の推移 */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">解約率の推移</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={breakdown.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="month"
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                domain={[0, 'auto']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  color: "hsl(var(--popover-foreground))",
                }}
                formatter={(value: number) => [`${value}%`, "解約率"]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="cancelRate"
                stroke="hsl(var(--warning))"
                strokeWidth={2}
                name="解約率"
                dot={{ fill: "hsl(var(--warning))", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 獲得チャネル別内訳 */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">新規契約の獲得チャネル別内訳</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={breakdown.acquisitionChannels} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              type="number"
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              type="category"
              dataKey="channel"
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
              formatter={(value: number, name: string, props: any) => [
                `${value}件 (${props.payload.percentage}%)`,
                "契約数",
              ]}
            />
            <Legend />
            <Bar dataKey="count" fill="hsl(var(--chart-3))" name="契約数" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
