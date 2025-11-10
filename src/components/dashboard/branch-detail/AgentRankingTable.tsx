import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AgentPerformance } from "@/types/branch";
import { ArrowUpDown, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BarChartCustom } from "@/components/ui/bar-chart-custom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { BranchInsightCard } from "./BranchInsightCard";

interface AgentRankingTableProps {
  agents: AgentPerformance[];
}

export const AgentRankingTable = ({ agents }: AgentRankingTableProps) => {
  const [sortBy, setSortBy] = useState<"achievementRate" | "anp" | "contractCount">("achievementRate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);

  const sortedAgents = [...agents].sort((a, b) => {
    const multiplier = sortOrder === "desc" ? -1 : 1;
    return (a[sortBy] - b[sortBy]) * multiplier;
  });
  
  const highPerformers = sortedAgents.filter(a => a.achievementRate >= 100).length;
  const lowPerformers = sortedAgents.filter(a => a.achievementRate < 90).length;
  const avgRate = sortedAgents.reduce((sum, a) => sum + a.achievementRate, 0) / sortedAgents.length;

  const handleSort = (key: typeof sortBy) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    } else {
      setSortBy(key);
      setSortOrder("desc");
    }
  };

  const getAchievementColor = (rate: number) => {
    if (rate >= 100) return "bg-success/10 text-success";
    if (rate >= 90) return "bg-warning/10 text-warning";
    return "bg-destructive/10 text-destructive";
  };

  const getTrendIcon = (trend: { month: string; anp: number }[]) => {
    if (trend.length < 2) return <Minus className="h-4 w-4 text-muted-foreground" />;
    const last = trend[trend.length - 1].anp;
    const prev = trend[trend.length - 2].anp;
    if (last > prev) return <TrendingUp className="h-4 w-4 text-success" />;
    if (last < prev) return <TrendingDown className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="space-y-4">
      <BranchInsightCard
        title="エージェントパフォーマンス分析"
        insights={[
          `支社全体の平均達成率は${avgRate.toFixed(1)}%で、${highPerformers}名が目標達成しています`,
          `上位エージェントは月次ANPで下位の約${(sortedAgents[0]?.anp / sortedAgents[sortedAgents.length - 1]?.anp).toFixed(1)}倍の成果を出しています`,
          lowPerformers > 0 
            ? `${lowPerformers}名のエージェントが達成率90%未満で、育成支援が必要です`
            : "全エージェントが安定したパフォーマンスを維持しています"
        ]}
        recommendation={
          lowPerformers > 0
            ? "低達成エージェントに対して、上位エージェントとのペアリング研修を実施し、営業手法の共有を推奨します"
            : "現在の好調なパフォーマンスを維持するため、定期的な成功事例共有会を継続してください"
        }
        status={lowPerformers > 2 ? "warning" : avgRate >= 100 ? "positive" : "neutral"}
      />
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">順位</TableHead>
            <TableHead>エージェント名</TableHead>
            <TableHead className="text-right">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort("anp")}
                className="font-semibold"
              >
                ANP
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort("contractCount")}
                className="font-semibold"
              >
                契約件数
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort("achievementRate")}
                className="font-semibold"
              >
                達成率
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="text-center">トレンド</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedAgents.map((agent, index) => (
            <Collapsible
              key={agent.id}
              open={expandedAgent === agent.id}
              onOpenChange={(open) => setExpandedAgent(open ? agent.id : null)}
              asChild
            >
              <>
                <CollapsibleTrigger asChild>
                  <TableRow
                    className={`cursor-pointer hover:bg-muted/50 ${getAchievementColor(
                      agent.achievementRate
                    )}`}
                  >
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="font-medium">{agent.name}</TableCell>
                    <TableCell className="text-right">¥{agent.anp}M</TableCell>
                    <TableCell className="text-right">{agent.contractCount.toLocaleString()}件</TableCell>
                    <TableCell className="text-right font-semibold">{agent.achievementRate}%</TableCell>
                    <TableCell className="text-center">{getTrendIcon(agent.trend)}</TableCell>
                  </TableRow>
                </CollapsibleTrigger>
                <CollapsibleContent asChild>
                  <TableRow>
                    <TableCell colSpan={6} className="p-6 bg-muted/20">
                      <div className="space-y-4">
                        <h4 className="text-sm font-semibold">直近6ヶ月のANP推移</h4>
                        <BarChartCustom
                          data={agent.trend.map((t) => ({ value: t.anp, label: t.month }))}
                          height={120}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                </CollapsibleContent>
              </>
            </Collapsible>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
