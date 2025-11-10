import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";

interface BranchPerformanceData {
  branchName: string;
  anp: number;
  achievementRate: number;
}

interface BranchPerformanceChartProps {
  data: BranchPerformanceData[];
}

export const BranchPerformanceChart = ({ data }: BranchPerformanceChartProps) => {
  return (
    <Card className="glass-effect hover:border-accent/50 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">支社別ANP & 達成率</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart 
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="anpGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                <stop offset="100%" stopColor="hsl(var(--chart-2))" stopOpacity={0.6} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="branchName" 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              yAxisId="left"
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              label={{ value: 'ANP (M¥)', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              label={{ value: '達成率 (%)', angle: 90, position: 'insideRight', fill: 'hsl(var(--muted-foreground))' }}
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
                if (name === "達成率") return [`${value}%`, name];
                return [value, name];
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
            <ReferenceLine 
              yAxisId="right" 
              y={100} 
              stroke="hsl(var(--success))" 
              strokeDasharray="5 5"
              label={{ value: '目標100%', position: 'right', fill: 'hsl(var(--success))' }}
            />
            <Bar 
              yAxisId="left"
              dataKey="anp" 
              fill="url(#anpGradient)"
              name="ANP"
              radius={[8, 8, 0, 0]}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="achievementRate" 
              stroke="hsl(var(--accent))"
              strokeWidth={3}
              name="達成率"
              dot={{ fill: 'hsl(var(--accent))', r: 5 }}
              activeDot={{ r: 7 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
