import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea } from "recharts";
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
  
  // 目標値の範囲を計算
  const maxTarget = viewMode === "count" 
    ? Math.max(...data.map(d => d.targetCount))
    : Math.max(...data.map(d => d.targetValue));
  const targetLower = maxTarget * 0.9;
  const targetUpper = maxTarget * 1.1;

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
            data={sortedData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
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
                } else {
                  if (name === "契約高") return [`¥${value}M`, name];
                  if (name === "目標") return [`¥${value}M`, name];
                }
                return [value, name];
              }}
            />
            <Legend />
            <ReferenceArea
              x1={0}
              x2={sortedData.length - 1}
              y1={targetLower}
              y2={targetUpper}
              fill="hsl(var(--muted))"
              fillOpacity={0.3}
              label={{ value: "目標範囲", position: "insideTopRight", fill: "hsl(var(--muted-foreground))" }}
            />
            <Bar 
              dataKey={viewMode === "count" ? "contractCount" : "contractValue"} 
              fill="hsl(var(--chart-2))" 
              name={viewMode === "count" ? "契約数" : "契約高"} 
              radius={[0, 4, 4, 0]} 
            />
            <Bar 
              dataKey={viewMode === "count" ? "targetCount" : "targetValue"} 
              fill="hsl(var(--chart-3))" 
              name="目標" 
              radius={[0, 4, 4, 0]} 
              fillOpacity={0.5}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
