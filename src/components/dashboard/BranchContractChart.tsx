import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ComposedChart, Bar, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface BranchContractData {
  branchName: string;
  contractCount: number;
  contractValue: number;
  targetCount: number;
  targetValue: number;
}

interface BranchContractChartProps {
  data: BranchContractData[];
}

export const BranchContractChart = ({ data }: BranchContractChartProps) => {
  const [viewMode, setViewMode] = useState<"count" | "value">("count");
  
  // データをソート
  const sortedData = [...data].sort((a, b) => 
    viewMode === "count" ? b.contractCount - a.contractCount : b.contractValue - a.contractValue
  );
  
  // 最大値を計算
  const maxValue = viewMode === "count" 
    ? Math.max(...data.map(d => Math.max(d.contractCount, d.targetCount)))
    : Math.max(...data.map(d => Math.max(d.contractValue, d.targetValue)));
  
  // データに背景範囲と差分を追加
  const enrichedData = sortedData.map(item => ({
    ...item,
    maxRange: maxValue * 1.1,
    actualValue: viewMode === "count" ? item.contractCount : item.contractValue,
    targetValue: viewMode === "count" ? item.targetCount : item.targetValue,
    difference: viewMode === "count" 
      ? item.contractCount - item.targetCount 
      : item.contractValue - item.targetValue,
  }));

  return (
    <Card className="border border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            支社別保有契約{viewMode === "count" ? "数" : "高"}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "count" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("count")}
            >
              契約数
            </Button>
            <Button
              variant={viewMode === "value" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("value")}
            >
              契約高
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart 
            data={enrichedData}
            layout="vertical"
            margin={{ top: 5, right: 80, left: 100, bottom: 5 }}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
            <YAxis 
              type="category" 
              dataKey="branchName" 
              stroke="hsl(var(--muted-foreground))"
              width={90}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
                color: 'hsl(var(--popover-foreground))'
              }}
              formatter={(value: number, name: string) => {
                if (viewMode === "count") {
                  if (name === "契約数") return [`${value.toLocaleString()}件`, name];
                  if (name === "目標") return [`${value.toLocaleString()}件`, name];
                  if (name === "差分") return [`${value > 0 ? '+' : ''}${value.toLocaleString()}件`, name];
                } else {
                  if (name === "契約高") return [`¥${value}M`, name];
                  if (name === "目標") return [`¥${value}M`, name];
                  if (name === "差分") return [`¥${value > 0 ? '+' : ''}${value.toFixed(1)}M`, name];
                }
                return [value, name];
              }}
            />
            <Legend 
              content={(props) => {
                const { payload } = props;
                return (
                  <ul className="flex justify-center gap-6 mt-4">
                    {payload?.filter((entry: any) => entry.dataKey !== 'maxRange').map((entry: any, index: number) => (
                      <li key={`item-${index}`} className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-sm"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-sm text-muted-foreground">{entry.value}</span>
                      </li>
                    ))}
                  </ul>
                );
              }}
            />
            {/* 実績バー */}
            <Bar 
              dataKey="actualValue" 
              fill="hsl(var(--chart-2))" 
              name={viewMode === "count" ? "契約数" : "契約高"} 
              radius={[0, 4, 4, 0]}
              barSize={20}
            />
            {/* 目標値をラインマークで表示 */}
            <Scatter 
              dataKey="targetValue" 
              fill="hsl(var(--chart-3))" 
              name="目標"
              shape={(props: any) => {
                const { cx, cy } = props;
                return (
                  <g>
                    <line 
                      x1={cx} 
                      y1={cy - 15} 
                      x2={cx} 
                      y2={cy + 15} 
                      stroke="hsl(var(--chart-3))" 
                      strokeWidth={3}
                    />
                  </g>
                );
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
