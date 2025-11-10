import { Card } from "@/components/ui/card";
import { BranchKPI } from "@/types/branch";
import { TrendingUp, TrendingDown, Users } from "lucide-react";
import { useState } from "react";
import { DetailTrendChart } from "./DetailTrendChart";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface BranchKPICardsProps {
  kpi: BranchKPI;
  monthlyData: { month: string; anp: number; contractCount: number }[];
}

export const BranchKPICards = ({ kpi, monthlyData }: BranchKPICardsProps) => {
  const [selectedKPI, setSelectedKPI] = useState<string | null>(null);

  const anpChange = ((kpi.currentANP - kpi.targetANP) / kpi.targetANP) * 100;
  const contractChange = ((kpi.contractCount - kpi.prevContractCount) / kpi.prevContractCount) * 100;
  const valueChange = ((kpi.contractValue - kpi.prevContractValue) / kpi.prevContractValue) * 100;

  const kpiCards = [
    {
      id: "anp",
      title: "今月ANP",
      value: `¥${kpi.currentANP}M`,
      change: anpChange,
      label: "対目標",
      dataKey: "anp",
    },
    {
      id: "contracts",
      title: "保有契約数",
      value: `${kpi.contractCount.toLocaleString()}件`,
      change: contractChange,
      label: "対前月",
      dataKey: "contractCount",
    },
    {
      id: "value",
      title: "保有契約高",
      value: `¥${(kpi.contractValue / 100).toFixed(1)}億円`,
      change: valueChange,
      label: "対前月",
      dataKey: "contractCount",
    },
    {
      id: "achievement",
      title: "達成率",
      value: `${kpi.achievementRate}%`,
      change: kpi.achievementRate - 100,
      label: "目標比",
      dataKey: "anp",
    },
    {
      id: "agents",
      title: "エージェント数",
      value: `${kpi.activeAgents}名`,
      subValue: `全体: ${kpi.totalAgents}名`,
      icon: Users,
      dataKey: "anp",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {kpiCards.map((card) => {
          const isPositive = card.change !== undefined && card.change > 0;
          const isNeutral = card.change === undefined;
          
          return (
            <Card
              key={card.id}
              className={`p-4 cursor-pointer hover:border-accent/50 transition-all duration-300 ${
                selectedKPI === card.id ? "border-accent" : ""
              }`}
              onClick={() => setSelectedKPI(selectedKPI === card.id ? null : card.id)}
            >
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  {card.title}
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-foreground">{card.value}</p>
                  {card.icon && <card.icon className="h-4 w-4 text-muted-foreground" />}
                </div>
                {card.change !== undefined && (
                  <div className="flex items-center gap-1 text-xs">
                    {isPositive ? (
                      <TrendingUp className="h-3 w-3 text-success" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-destructive" />
                    )}
                    <span className={isPositive ? "text-success" : "text-destructive"}>
                      {isPositive ? "+" : ""}
                      {card.change.toFixed(1)}%
                    </span>
                    <span className="text-muted-foreground">{card.label}</span>
                  </div>
                )}
                {card.subValue && (
                  <p className="text-xs text-muted-foreground">{card.subValue}</p>
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
              <DetailTrendChart
                title={kpiCards.find((c) => c.id === selectedKPI)?.title || ""}
                data={monthlyData}
                dataKey={kpiCards.find((c) => c.id === selectedKPI)?.dataKey || "anp"}
              />
            </Card>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
};
