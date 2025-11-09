import { KPICard } from "@/components/dashboard/KPICard";
import { AIInsightsCard } from "@/components/dashboard/AIInsightsCard";
import { AgencyList } from "@/components/dashboard/AgencyList";
import { PillButton } from "@/components/ui/pill-button";
import { useState } from "react";

const Dashboard = () => {
  const [activeFilter, setActiveFilter] = useState("all");

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
          />
          <KPICard
            title="保有契約高"
            value="¥8.2B"
            change="+5.2% vs 前月"
            changeType="positive"
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <AIInsightsCard />
          <AgencyList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
