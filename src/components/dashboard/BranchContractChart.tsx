import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

interface BranchContractData {
  branchName: string;
  contractCount: number;
  achievementRate: number;
}

interface BranchContractChartProps {
  data: BranchContractData[];
}

export const BranchContractChart = ({ data }: BranchContractChartProps) => {
  // データを達成率でソート
  const sortedData = [...data].sort((a, b) => b.achievementRate - a.achievementRate);

  // 達成率に応じた色を返す関数
  const getAchievementColor = (rate: number) => {
    if (rate >= 100) return "hsl(var(--success))";
    if (rate >= 90) return "hsl(var(--warning))";
    return "hsl(var(--destructive))";
  };

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">支社別保有契約数 & 達成率</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart 
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
                if (name === "保有契約数") return [`${value.toLocaleString()}件`, name];
                if (name === "達成率") return [`${value}%`, name];
                return [value, name];
              }}
            />
            <Legend />
            <Bar dataKey="contractCount" fill="hsl(var(--chart-2))" name="保有契約数" radius={[0, 4, 4, 0]} />
            <Bar dataKey="achievementRate" name="達成率" radius={[0, 4, 4, 0]}>
              {sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getAchievementColor(entry.achievementRate)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
