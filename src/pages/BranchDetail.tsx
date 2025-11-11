import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { getBranchById } from '@/data/branches';
import { departments } from '@/data/departments';
import { PeriodType } from '@/types/kpi';
import { PeriodSelector } from '@/components/dashboard/PeriodSelector';
import { generateBranchDetailData } from '@/data/sample-data-generator';
import { BranchKPICards } from '@/components/dashboard/branch-detail/BranchKPICards';
import { DetailTrendChart } from '@/components/dashboard/branch-detail/DetailTrendChart';
import { AgentRankingTable } from '@/components/dashboard/branch-detail/AgentRankingTable';
import { ProductMixAnalysis } from '@/components/dashboard/branch-detail/ProductMixAnalysis';
import { ContractBreakdownAnalysis } from '@/components/dashboard/branch-detail/ContractBreakdownAnalysis';
import { CustomerSegmentAnalysis } from '@/components/dashboard/branch-detail/CustomerSegmentAnalysis';
import { BranchInsightCard } from '@/components/dashboard/branch-detail/BranchInsightCard';
import { AchievementLegend } from '@/components/ui/achievement-legend';

const BranchDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [periodType, setPeriodType] = useState<PeriodType>('monthly');

  const branch = id ? getBranchById(id) : null;
  const data = branch ? generateBranchDetailData(branch, periodType) : null;
  
  // 統括部情報を取得
  const department = departments.find(dept => 
    branch && dept.branchIds.includes(branch.id)
  );

  if (!branch || !data) {
    return (
      <div className="flex-1 overflow-auto p-8">
        <div className="text-center">
          <p className="text-muted-foreground">支社が見つかりませんでした</p>
          <Button onClick={() => navigate('/')} className="mt-4">
            ダッシュボードに戻る
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        {/* ヘッダー */}
        <div className="mb-6 flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
            className="hover:bg-muted"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">{branch.name} - 詳細分析</h1>
            {department && (
              <p className="text-sm text-muted-foreground mt-1">
                所属: {department.name}
              </p>
            )}
          </div>
          <AchievementLegend />
          <PeriodSelector value={periodType} onChange={setPeriodType} />
        </div>

        {/* KPIカード */}
        <BranchKPICards kpi={data.kpi} monthlyData={data.monthlyData} />

        {/* コンテンツエリア */}
        <div className="space-y-6 mt-6">
          {/* トレンドチャート */}
          <DetailTrendChart 
            title="パフォーマンス推移"
            data={data.monthlyData}
            dataKey="anp"
          />

          {/* 代理店営業社員別実績ランキング */}
          <AgentRankingTable agents={data.agents} />

          {/* 商品別構成分析 */}
          <ProductMixAnalysis products={data.productMix} />

          {/* 新規・解約・継続の内訳 */}
          <ContractBreakdownAnalysis breakdown={data.contractBreakdown} />

          {/* 顧客セグメント別分析 */}
          <CustomerSegmentAnalysis segments={data.customerSegments} />

          {/* インサイトカード */}
          <BranchInsightCard 
            title="AIインサイト"
            insights={[
              `新規ANP達成率: ${data.kpi.newANP.achievementRate.toFixed(1)}%`,
              `継続率達成率: ${data.kpi.continuationRate.achievementRate.toFixed(1)}%`,
              `アクティブ営業社員: ${data.kpi.activeAgents}名/${data.kpi.totalAgents}名`
            ]}
            recommendation={
              data.kpi.newANP.achievementRate >= 100 
                ? "目標達成中です。この調子で継続しましょう。"
                : "目標未達成です。営業活動の強化を推奨します。"
            }
            status={
              data.kpi.newANP.achievementRate >= 100 
                ? "positive" 
                : data.kpi.newANP.achievementRate >= 90 
                ? "warning" 
                : "warning"
            }
          />
        </div>
      </div>
    </div>
  );
};

export default BranchDetail;
