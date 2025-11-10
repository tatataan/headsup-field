import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";
import { useNavigate } from "react-router-dom";

interface BranchRankingData {
  id: string;
  name: string;
  anp: number;
  achievement: number;
}

interface AgencyRankingChartProps {
  data: BranchRankingData[];
}

export const AgencyRankingChart = ({ data }: AgencyRankingChartProps) => {
  const navigate = useNavigate();

  const getBarColor = (achievement: number) => {
    if (achievement >= 100) return "hsl(var(--success))";
    if (achievement >= 90) return "hsl(var(--chart-2))";
    if (achievement >= 80) return "hsl(var(--warning))";
    return "hsl(var(--destructive))";
  };

  const handleBarClick = (data: any) => {
    if (data && data.id) {
      navigate(`/agency/${data.id}`);
    }
  };

  return (
    <Card className="glass-effect hover:border-accent/50 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">支店別ANPランキング (Top 10)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart 
            data={data} 
            layout="vertical" 
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <XAxis 
              type="number" 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              width={90}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
                color: 'hsl(var(--popover-foreground))'
              }}
              formatter={(value: number, name: string, props: any) => [
                `¥${value}M (達成率: ${props.payload.achievement}%)`,
                'ANP'
              ]}
            />
            <Bar 
              dataKey="anp" 
              radius={[0, 8, 8, 0]}
              onClick={handleBarClick}
              className="cursor-pointer"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getBarColor(entry.achievement)}
                  className="hover:opacity-80 transition-opacity"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};