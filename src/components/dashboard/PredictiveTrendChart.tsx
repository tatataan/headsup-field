import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, ReferenceLine } from "recharts";

interface DataPoint {
  month: string;
  actual?: number;
  predicted?: number;
}

interface PredictiveTrendChartProps {
  title: string;
  historicalData: { month: string; value: number; type: "actual" }[];
  predictedData: { month: string; value: number; type: "predicted" }[];
  targetValue?: number;
}

export const PredictiveTrendChart = ({ 
  title, 
  historicalData, 
  predictedData,
  targetValue 
}: PredictiveTrendChartProps) => {
  // データを統合して、actual/predicted を分離
  const allMonths = [...historicalData.map(d => d.month), ...predictedData.map(d => d.month)];
  const chartData: DataPoint[] = allMonths.map((month, index) => {
    const historical = historicalData.find(d => d.month === month);
    const predicted = predictedData.find(d => d.month === month);
    
    return {
      month,
      actual: historical?.value,
      predicted: predicted?.value,
    };
  });

  return (
    <Card className="glass-effect hover:border-accent/50 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          {title}
          <span className="block text-sm text-muted-foreground font-normal mt-1">
            実績値と予測トレンド
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="month" 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            {targetValue && (
              <ReferenceLine 
                y={targetValue} 
                stroke="hsl(var(--chart-4))" 
                strokeDasharray="5 5"
                label={{ 
                  value: '目標', 
                  position: 'right',
                  fill: 'hsl(var(--chart-4))',
                  fontSize: 12
                }}
              />
            )}
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
                color: 'hsl(var(--popover-foreground))'
              }}
              labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
            />
            <Line 
              type="monotone" 
              dataKey="actual" 
              stroke="hsl(var(--chart-1))" 
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--chart-1))', r: 5 }}
              activeDot={{ r: 7, fill: 'hsl(var(--chart-1))', stroke: 'hsl(var(--background))', strokeWidth: 2 }}
              connectNulls
              name="実績値"
            />
            <Line 
              type="monotone" 
              dataKey="predicted" 
              stroke="hsl(var(--chart-1))" 
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={{ fill: 'none', stroke: 'hsl(var(--chart-1))', strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, fill: 'hsl(var(--chart-1))', stroke: 'hsl(var(--background))', strokeWidth: 2 }}
              connectNulls
              name="予測値"
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 flex items-center justify-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-chart-1"></div>
            <span>実績値</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 border-t-2 border-dashed border-chart-1"></div>
            <span>予測値</span>
          </div>
          {targetValue && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 border-t-2 border-dashed border-chart-4"></div>
              <span>目標値</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};