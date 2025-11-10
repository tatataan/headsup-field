import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ComposedChart, Bar, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

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
  
  // 最大値を計算（グラフの範囲用）
  const maxValue = Math.max(...data.map(d => Math.max(d.anp, d.target)));
  
  // データに背景範囲と差分を追加
  const enrichedData = sortedData.map(item => ({
    ...item,
    maxRange: maxValue * 1.1,
    difference: item.anp - item.target,
  }));

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">支社別ANP & 達成率</CardTitle>
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
                if (name === "ANP") return [`¥${value}M`, name];
                if (name === "目標") return [`¥${value}M`, name];
                if (name === "差分") return [`¥${value > 0 ? '+' : ''}${value.toFixed(1)}M`, name];
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
            <Bar dataKey="anp" fill="hsl(var(--primary))" name="ANP" radius={[0, 4, 4, 0]} barSize={20} />
            {/* 目標値をラインマークで表示 */}
            <Scatter 
              dataKey="target" 
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
