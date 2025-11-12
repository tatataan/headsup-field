import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { CustomerSegmentData } from "@/types/branch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BranchInsightCard } from "./BranchInsightCard";

interface CustomerSegmentAnalysisProps {
  segments: CustomerSegmentData;
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export const CustomerSegmentAnalysis = ({ segments }: CustomerSegmentAnalysisProps) => {
  const totalContracts = segments.ageSegments.reduce((sum, s) => sum + s.contractCount, 0);
  const totalANP = segments.ageSegments.reduce((sum, s) => sum + s.anp, 0);
  
  const dominantAge = segments.ageSegments.reduce((max, seg) => seg.anp > max.anp ? seg : max);
  const longTermCustomers = segments.contractDurationSegments.find(d => d.duration === "5年以上");
  const maleSegment = segments.genderSegments.find(g => g.gender === "男性");

  const allSegments = [
    ...segments.ageSegments.map((s) => ({ ...s, type: "年齢層" })),
    ...segments.genderSegments.map((s) => ({ ...s, type: "性別", ageRange: s.gender })),
    ...segments.contractDurationSegments.map((s) => ({ ...s, type: "契約期間", ageRange: s.duration })),
  ];

  return (
    <div className="space-y-6">
      <BranchInsightCard
        title="顧客基盤分析"
        insights={[
          `${dominantAge.ageRange}が最大セグメントで、ANPの${dominantAge.percentage.toFixed(1)}%を占めています`,
          `5年以上の長期顧客が${longTermCustomers ? longTermCustomers.percentage.toFixed(1) : '0'}%で、顧客ロイヤルティは${longTermCustomers && longTermCustomers.percentage > 30 ? '高い' : '改善の余地がある'}水準です`,
          `男女比は${maleSegment ? maleSegment.percentage.toFixed(0) : '50'}:${maleSegment ? (100 - maleSegment.percentage).toFixed(0) : '50'}で、${Math.abs((maleSegment?.percentage || 50) - 50) > 20 ? '性別による偏りが見られます' : 'バランスが取れています'}`
        ]}
        recommendation={
          dominantAge.percentage > 40
            ? `${dominantAge.ageRange}以外の年齢層へのアプローチを強化し、顧客基盤の多様化を図ることを推奨します`
            : longTermCustomers && longTermCustomers.percentage < 25
            ? "顧客ロイヤルティプログラムの導入や定期的なフォローアップにより、長期顧客の育成を強化してください"
            : "バランスの取れた顧客基盤を活かし、セグメント別のパーソナライズドサービスを展開してください"
        }
        status="neutral"
      />
      
      {/* 年齢層別分析 */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">年齢層別契約数分布</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={segments.ageSegments} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              type="number"
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              type="category"
              dataKey="ageRange"
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
                color: "hsl(var(--popover-foreground))",
              }}
              formatter={(value: number, name: string, props: any) => [
                `${value}件 (ANP: ¥${props.payload.anp}M, 構成比: ${props.payload.percentage}%)`,
                "契約数",
              ]}
            />
            <Legend />
            <Bar dataKey="contractCount" fill="hsl(var(--chart-1))" name="契約数" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 性別・契約期間別分析 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 性別分析 */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">性別分布</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={segments.genderSegments}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ gender, percentage }) => `${gender} ${percentage}%`}
                outerRadius={80}
                fill="hsl(var(--primary))"
                dataKey="contractCount"
                nameKey="gender"
              >
                {segments.genderSegments.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string, props: any) => [
                  `${value}件 (ANP: ¥${props.payload.anp}M)`,
                  name,
                ]}
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  color: "hsl(var(--popover-foreground))",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 契約期間別分析 */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">契約期間分布</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={segments.contractDurationSegments}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ duration, percentage }) => `${duration} ${percentage}%`}
                outerRadius={80}
                fill="hsl(var(--primary))"
                dataKey="contractCount"
                nameKey="duration"
              >
                {segments.contractDurationSegments.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string, props: any) => [
                  `${value}件 (ANP: ¥${props.payload.anp}M)`,
                  name,
                ]}
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  color: "hsl(var(--popover-foreground))",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* セグメント別詳細テーブル */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">セグメント別詳細</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>セグメントタイプ</TableHead>
              <TableHead>セグメント名</TableHead>
              <TableHead className="text-right">契約数</TableHead>
              <TableHead className="text-right">構成比</TableHead>
              <TableHead className="text-right">ANP</TableHead>
              <TableHead className="text-right">平均契約額</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allSegments.map((segment, index) => {
              const avgValue = segment.anp / segment.contractCount;
              return (
                <TableRow key={index}>
                  <TableCell className="font-medium">{segment.type}</TableCell>
                  <TableCell>{segment.ageRange}</TableCell>
                  <TableCell className="text-right">{segment.contractCount.toLocaleString()}件</TableCell>
                  <TableCell className="text-right">{segment.percentage}%</TableCell>
                  <TableCell className="text-right">¥{segment.anp}M</TableCell>
                  <TableCell className="text-right">¥{avgValue.toFixed(2)}M</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
