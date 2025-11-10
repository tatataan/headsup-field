import { KPICard } from "@/components/dashboard/KPICard";
import { AIInsightsCard } from "@/components/dashboard/AIInsightsCard";
import { AgencyList } from "@/components/dashboard/AgencyList";
import { MonthlyTrendChart } from "@/components/dashboard/MonthlyTrendChart";
import { KPIDetailModal } from "@/components/dashboard/KPIDetailModal";
import { PillButton } from "@/components/ui/pill-button";
import { useState } from "react";

const Dashboard = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedKPI, setSelectedKPI] = useState<{
    title: string;
    value: string;
    data: { month: string; value: number }[];
  } | null>(null);

  // サンプル月次データ
  const anpMonthlyData = [
    { month: "1月", value: 420 },
    { month: "2月", value: 445 },
    { month: "3月", value: 478 },
    { month: "4月", value: 490 },
    { month: "5月", value: 502 },
    { month: "6月", value: 523.5 },
  ];

  const contractMonthlyData = [
    { month: "1月", value: 7.8 },
    { month: "2月", value: 7.9 },
    { month: "3月", value: 8.0 },
    { month: "4月", value: 8.05 },
    { month: "5月", value: 8.1 },
    { month: "6月", value: 8.2 },
  ];

  const handleKPIClick = (title: string, value: string, data: { month: string; value: number }[]) => {
    setSelectedKPI({ title, value, data });
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">ダッシュボード</h1>
          <p className="text-muted-foreground">チャネル全体のパフォーマンスと課題を確認</p>
        </div>

        <div className="flex gap-2 mb-8">
          <PillButton 
            active={activeFilter === "all"}
            onClick={() => setActiveFilter("all")}
          >
            全体
          </PillButton>
          <PillButton 
            active={activeFilter === "month"}
            onClick={() => setActiveFilter("month")}
          >
            今月
          </PillButton>
          <PillButton 
            active={activeFilter === "quarter"}
            onClick={() => setActiveFilter("quarter")}
          >
            四半期
          </PillButton>
          <PillButton 
            active={activeFilter === "year"}
            onClick={() => setActiveFilter("year")}
          >
            年間
          </PillButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="全社ANP進捗"
            value="¥523.5M"
            change="+12.5% vs 前月"
            changeType="positive"
            onClick={() => handleKPIClick("全社ANP進捗", "¥523.5M", anpMonthlyData)}
          />
          <KPICard
            title="保有契約高"
            value="¥8.2B"
            change="+5.2% vs 前月"
            changeType="positive"
            onClick={() => handleKPIClick("保有契約高", "¥8.2B", contractMonthlyData)}
          />
          <KPICard
            title="活動代理店数"
            value="47店"
            change="前月と同じ"
            changeType="neutral"
          />
          <KPICard
            title="目標達成率"
            value="89.2%"
            change="-3.1% vs 前月"
            changeType="negative"
          />
        </div>

        <div className="mb-8">
          <MonthlyTrendChart
            title="月次ANP推移"
            data={anpMonthlyData}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <AIInsightsCard />
          <AgencyList />
        </div>

        <KPIDetailModal
          open={selectedKPI !== null}
          onOpenChange={(open) => !open && setSelectedKPI(null)}
          title={selectedKPI?.title || ""}
          currentValue={selectedKPI?.value || ""}
          monthlyData={selectedKPI?.data || []}
        />
      </div>
    </div>
  );
};

export default Dashboard;
