import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scatter, ScatterChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, ZAxis, Cell } from "recharts";
import { useNavigate } from "react-router-dom";

interface ActivityScatterData {
  id: string;
  name: string;
  visits: number;
  anp: number;
  achievement: number;
}

interface ActivityScatterChartProps {
  data: ActivityScatterData[];
}

export const ActivityScatterChart = ({ data }: ActivityScatterChartProps) => {
  const navigate = useNavigate();

  const getColor = (achievement: number) => {
    if (achievement >= 100) return "hsl(var(--success))";
    if (achievement >= 90) return "hsl(var(--chart-2))";
    if (achievement >= 80) return "hsl(var(--warning))";
    return "hsl(var(--destructive))";
  };

  const handleClick = (data: any) => {
    if (data && data.id) {
      navigate(`/agency/${data.id}`);
    }
  };

  return (
    <Card className="glass-effect hover:border-accent/50 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          活動量 vs 成果分析
          <span className="block text-sm text-muted-foreground font-normal mt-1">
            訪問回数とANPの相関関係
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              type="number" 
              dataKey="visits" 
              name="訪問回数"
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              label={{ value: '訪問回数', position: 'insideBottom', offset: -10, fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              type="number" 
              dataKey="anp" 
              name="ANP"
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              label={{ value: 'ANP (M)', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }}
            />
            <ZAxis type="number" dataKey="achievement" range={[100, 1000]} />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
                color: 'hsl(var(--popover-foreground))'
              }}
              formatter={(value: number, name: string) => {
                if (name === '訪問回数') return [`${value}回`, name];
                if (name === 'ANP') return [`¥${value}M`, name];
                return [value, name];
              }}
              labelFormatter={(label, payload) => {
                if (payload && payload[0]) {
                  const data = payload[0].payload;
                  return `${data.name} (達成率: ${data.achievement}%)`;
                }
                return '';
              }}
            />
            <Scatter 
              name="代理店" 
              data={data} 
              onClick={handleClick}
              className="cursor-pointer"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getColor(entry.achievement)}
                  className="hover:opacity-80 transition-opacity"
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-destructive"></div>
            <span>&lt;80%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-warning"></div>
            <span>80-89%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-chart-2"></div>
            <span>90-99%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success"></div>
            <span>100%+</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};