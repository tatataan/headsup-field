import { Card } from "@/components/ui/card";
import { PercentageBadge } from "@/components/ui/percentage-badge";
import { PeriodType } from "@/types/kpi";
import { PeriodSelector } from "./PeriodSelector";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { DetailTrendChart } from "./branch-detail/DetailTrendChart";
import { useState } from "react";

interface KPIData {
  title: string;
  value: string;
  achievementRate: number;
  changeType: "positive" | "negative" | "neutral";
}

interface EnhancedKPICardsProps {
  kpis: KPIData[];
  historicalData: {
    monthly: { period: string; anp: number; contractCount: number; continuationRate: number }[];
    quarterly: { period: string; anp: number; contractCount: number; continuationRate: number }[];
    yearly: { period: string; anp: number; contractCount: number; continuationRate: number }[];
  };
  onPeriodChange?: (period: PeriodType) => void;
}

export const EnhancedKPICards = ({ kpis, historicalData, onPeriodChange }: EnhancedKPICardsProps) => {
  const [selectedKPI, setSelectedKPI] = useState<number | null>(null);
  const [trendPeriod, setTrendPeriod] = useState<PeriodType>('monthly');

  const getValueColor = (changeType: "positive" | "negative" | "neutral") => {
    if (changeType === "positive") return "text-success";
    if (changeType === "neutral") return "text-warning";
    if (changeType === "negative") return "text-destructive";
    return "text-foreground";
  };

  const handleKPIClick = (index: number) => {
    setSelectedKPI(selectedKPI === index ? null : index);
  };

  const handleTrendPeriodChange = (period: PeriodType) => {
    setTrendPeriod(period);
    if (onPeriodChange) {
      onPeriodChange(period);
    }
  };

  const getDataKey = (kpiIndex: number): 'anp' | 'contractCount' | 'continuationRate' => {
    if (kpiIndex === 0) return 'anp';
    if (kpiIndex === 1) return 'contractCount';
    return 'continuationRate';
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpis.map((kpi, index) => {
          const isSelected = selectedKPI === index;
          return (
            <Card 
              key={index}
              className={`glass-effect p-6 hover:border-accent/50 transition-all duration-300 cursor-pointer group ${
                isSelected ? 'border-accent ring-2 ring-accent/20' : ''
              }`}
              onClick={() => handleKPIClick(index)}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{kpi.title}</p>
                  {kpi.achievementRate !== 0 && (
                    <PercentageBadge value={kpi.achievementRate - 100} />
                  )}
                </div>
                <p className={`text-4xl md:text-5xl font-bold ${getValueColor(kpi.changeType)} animate-count-up group-hover:text-accent transition-colors`}>
                  {kpi.value}
                </p>
                {!kpi.title.includes("継続率") && (
                  <p className="text-sm text-muted-foreground">
                    達成率: {kpi.achievementRate.toFixed(1)}%
                  </p>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {selectedKPI !== null && (
        <Collapsible open={selectedKPI !== null}>
          <CollapsibleContent>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{kpis[selectedKPI].title} - 詳細推移</h3>
                <PeriodSelector value={trendPeriod} onChange={handleTrendPeriodChange} />
              </div>
              <DetailTrendChart
                title={kpis[selectedKPI].title}
                data={getTrendData().map(d => ({
                  month: d.period,
                  anp: d.anp,
                  contractCount: d.contractCount,
                  continuationRate: d.continuationRate
                }))}
                dataKey={getDataKey(selectedKPI)}
              />
            </Card>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
};
