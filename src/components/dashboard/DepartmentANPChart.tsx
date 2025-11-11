import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ComposedChart, Bar, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface DepartmentData {
  departmentName: string;
  actual: number;
  plan: number;
}

interface DepartmentANPChartProps {
  data: DepartmentData[];
}

export const DepartmentANPChart = ({ data }: DepartmentANPChartProps) => {
  // データを実績でソート
  const sortedData = [...data].sort((a, b) => b.actual - a.actual);
  
  // 最大値を計算
  const maxValue = Math.max(...data.map(d => Math.max(d.actual, d.plan)));
  
  // データに範囲を追加
  const enrichedData = sortedData.map(item => ({
    ...item,
    maxRange: maxValue * 1.1,
  }));

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">統括部別新規ANP及び目標達成率</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart 
            data={enrichedData}
            layout="vertical"
            margin={{ top: 5, right: 80, left: 120, bottom: 5 }}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
            <YAxis 
              type="category" 
              dataKey="departmentName" 
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
              formatter={(value: number, name: string) => {
                if (name === "実績") return [`¥${(value / 1000000).toFixed(0)}M`, name];
                if (name === "計画") return [`¥${(value / 1000000).toFixed(0)}M`, name];
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
            <Bar dataKey="actual" fill="hsl(var(--primary))" name="実績" radius={[0, 4, 4, 0]} barSize={20} />
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
