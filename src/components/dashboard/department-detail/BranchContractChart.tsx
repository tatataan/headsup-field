import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ComposedChart, Bar, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface BranchData {
  branchName: string;
  actual: number;
  plan: number;
}

interface BranchContractChartProps {
  data: BranchData[];
}

export const BranchContractChart = ({ data }: BranchContractChartProps) => {
  // データを実績でソート
  const sortedData = [...data].sort((a, b) => b.actual - a.actual);
  
  // 最大値を計算
  const maxValue = Math.max(...data.map(d => Math.max(d.actual, d.plan)));
  
  // データに範囲を追加
  const enrichedData = sortedData.map(item => ({
    ...item,
    maxRange: maxValue * 1.1,
    name: item.branchName.length > 8 ? item.branchName.substring(0, 8) + "..." : item.branchName,
    fullName: item.branchName
  }));

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">支社別新規契約数及び目標達成率</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={Math.max(400, data.length * 35)}>
          <ComposedChart 
            data={enrichedData}
            layout="vertical"
            margin={{ top: 5, right: 80, left: 120, bottom: 5 }}
            barCategoryGap="15%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
            <YAxis 
              type="category" 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))"
              width={110}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
                color: 'hsl(var(--popover-foreground))'
              }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-popover border border-border rounded-lg p-2 shadow-lg">
                      <p className="font-semibold">{payload[0].payload.fullName}</p>
                      <p className="text-sm">実績: {payload[0].payload.actual.toLocaleString()}件</p>
                      <p className="text-sm">計画: {payload[0].payload.plan.toLocaleString()}件</p>
                      <p className="text-sm">達成率: {((payload[0].payload.actual / payload[0].payload.plan) * 100).toFixed(1)}%</p>
                    </div>
                  );
                }
                return null;
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
            <Bar dataKey="actual" fill="hsl(var(--chart-2))" name="実績" radius={[0, 4, 4, 0]} barSize={18} />
            {/* 計画値をラインマークで表示 */}
            <Scatter 
              dataKey="plan" 
              fill="hsl(var(--chart-3))" 
              name="計画"
              shape={(props: any) => {
                const { cx, cy } = props;
                return (
                  <g>
                    <line 
                      x1={cx} 
                      y1={cy - 12} 
                      x2={cx} 
                      y2={cy + 12} 
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
