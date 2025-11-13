import { Card } from "@/components/ui/card";
import { BranchKPI } from "@/types/branch";
import { Users } from "lucide-react";
import { useState } from "react";
import { DetailTrendChart } from "./DetailTrendChart";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { PeriodSelector } from "../PeriodSelector";
import { PeriodType } from "@/types/kpi";
import { PercentageBadge } from "@/components/ui/percentage-badge";

interface BranchKPICardsProps {
  kpi: BranchKPI;
  historicalData: {
    monthly: { month: string; anp: number; contractCount: number; continuationRate: number }[];
    quarterly: { period: string; anp: number; contractCount: number; continuationRate: number }[];
    yearly: { period: string; anp: number; contractCount: number; continuationRate: number }[];
  };
}

export const BranchKPICards = ({ kpi, historicalData }: BranchKPICardsProps) => {
  const [selectedKPI, setSelectedKPI] = useState<string | null>(null);
  const [trendPeriod, setTrendPeriod] = useState<PeriodType>('monthly');

  const anpChange = kpi.newANP.achievementRate - 100;
  const contractChange = kpi.newContractCount.achievementRate - 100;
  const continuationChange = kpi.continuationRate.achievementRate - 100;

  const kpiCards = [
    {
      id: "anp",
      title: "新規ANP",
      value: `¥${(kpi.newANP.actual / 1000000).toFixed(1)}M`,
      change: anpChange,
      label: "達成率",
      dataKey: "anp",
    },
    {
      id: "contracts",
      title: "新規契約数",
      value: `${kpi.newContractCount.actual}件`,
      change: contractChange,
      label: "達成率",
      dataKey: "contractCount",
    },
    {
      id: "continuation",
      title: "継続率",
      value: `${kpi.continuationRate.actual}%`,
      change: continuationChange,
      label: "達成率",
      dataKey: "continuationRate",
    },
    {
      id: "agents",
      title: "営業社員数",
      value: `${kpi.activeAgents}名`,
      subValue: `全体: ${kpi.totalAgents}名`,
      icon: Users,
      dataKey: "anp",
    },
  ];

  const getValueColor = (change?: number) => {
    if (change === undefined) return "text-foreground";
    if (change >= 0) return "text-success";
    if (change < -10) return "text-destructive";
    return "text-warning";
  };

  const getTrendData = () => {
    switch (trendPeriod) {
      case 'monthly':
        return historicalData.monthly;
      case 'quarterly':
        return historicalData.quarterly;
      case 'yearly':
        return historicalData.yearly;
      default:
        return historicalData.monthly;
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {kpiCards.map((card) => {
          return (
            <Card
              key={card.id}
              className={`glass-effect p-6 cursor-pointer hover:border-accent/50 transition-all duration-300 group ${
                selectedKPI === card.id ? "border-accent" : ""
              }`}
              onClick={() => setSelectedKPI(selectedKPI === card.id ? null : card.id)}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    {card.title}
                  </p>
                  {card.change !== undefined && (
                    <PercentageBadge value={card.change} />
                  )}
                </div>
                <div className="flex items-baseline gap-2">
                  <p className={`text-4xl md:text-5xl font-bold ${getValueColor(card.change)} animate-count-up group-hover:text-accent transition-colors`}>
                    {card.value}
                  </p>
                  {card.icon && <card.icon className="h-5 w-5 text-muted-foreground" />}
                </div>
                {card.subValue && (
                  <p className="text-sm text-muted-foreground">{card.subValue}</p>
                )}
                {card.change !== undefined && !card.title.includes("継続率") && (
                  <p className="text-sm text-muted-foreground">達成率: {(100 + card.change).toFixed(1)}%</p>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {selectedKPI && (
        <Collapsible open={!!selectedKPI}>
          <CollapsibleContent>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {kpiCards.find((c) => c.id === selectedKPI)?.title || ""} - 詳細推移
                </h3>
                <PeriodSelector value={trendPeriod} onChange={setTrendPeriod} />
              </div>
              <DetailTrendChart
                title={kpiCards.find((c) => c.id === selectedKPI)?.title || ""}
                data={getTrendData()}
                dataKey={kpiCards.find((c) => c.id === selectedKPI)?.dataKey || "anp"}
              />
            </Card>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
};
