import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea } from "recharts";

interface BranchPerformanceData {
  branchName: string;
  anp: number;
  target: number;
}

interface BranchPerformanceChartProps {
  data: BranchPerformanceData[];
}

export const BranchPerformanceChart = ({ data }: BranchPerformanceChartProps) => {
  // データをANPでソート
  const sortedData = [...data].sort((a, b) => b.anp - a.anp);
  
  // 目標値の範囲を計算（目標の90%-110%）
  const maxTarget = Math.max(...data.map(d => d.target));
  const targetLower = maxTarget * 0.9;
  const targetUpper = maxTarget * 1.1;

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">支社別ANP & 達成率</CardTitle>
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
                if (name === "ANP") return [`¥${value}M`, name];
                if (name === "目標") return [`¥${value}M`, name];
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
            <Bar dataKey="anp" fill="hsl(var(--primary))" name="ANP" radius={[0, 4, 4, 0]} />
            <Bar dataKey="target" fill="hsl(var(--chart-2))" name="目標" radius={[0, 4, 4, 0]} fillOpacity={0.5} />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
