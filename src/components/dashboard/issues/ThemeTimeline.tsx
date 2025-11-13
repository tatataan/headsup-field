import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { HearingHistory } from "@/hooks/useHearingHistory";
import { useMemo } from "react";

interface ThemeTimelineProps {
  hearingHistory: HearingHistory[];
}

const THEME_COLORS = {
  "事業承継": "hsl(var(--chart-1))",
  "人材育成": "hsl(var(--chart-2))",
  "業務効率化": "hsl(var(--chart-3))",
  "販売力強化": "hsl(var(--chart-4))",
  "リスク管理": "hsl(var(--chart-5))",
  "コンプライアンス": "hsl(var(--accent))",
};

export const ThemeTimeline = ({ hearingHistory }: ThemeTimelineProps) => {
  const timelineData = useMemo(() => {
    // Get last 6 months
    const today = new Date();
    const months: string[] = [];
    const monthDates: Date[] = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      monthDates.push(date);
      months.push(date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' }));
    }

    // Initialize all months with 0 for all themes
    const monthlyData: Record<string, Record<string, number>> = {};
    months.forEach(month => {
      monthlyData[month] = {};
      Object.keys(THEME_COLORS).forEach(theme => {
        monthlyData[month][theme] = 0;
      });
    });

    // Count actual occurrences
    hearingHistory.forEach((record) => {
      const recordDate = new Date(record.date);
      const month = recordDate.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' });
      
      if (monthlyData[month] && THEME_COLORS[record.major_theme as keyof typeof THEME_COLORS]) {
        monthlyData[month][record.major_theme] = (monthlyData[month][record.major_theme] || 0) + 1;
      }
    });

    return months.map(month => ({
      month,
      ...monthlyData[month]
    }));
  }, [hearingHistory]);

  const themes = Object.keys(THEME_COLORS);

  return (
    <Card>
      <CardHeader>
        <CardTitle>課題発生トレンド</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timelineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--card))", 
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px"
              }}
            />
            <Legend />
            {themes.map((theme) => (
              <Line
                key={theme}
                type="monotone"
                dataKey={theme}
                stroke={THEME_COLORS[theme as keyof typeof THEME_COLORS]}
                strokeWidth={2}
                dot={{ fill: THEME_COLORS[theme as keyof typeof THEME_COLORS] }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
