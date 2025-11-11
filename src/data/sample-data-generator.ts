import { Department } from '@/types/department';
import { Branch } from './branches';
import { PeriodType, KPIMetrics, PeriodData } from '@/types/kpi';
import { BranchDetailData, AgentPerformance, ProductMixData, ContractBreakdownData, CustomerSegmentData } from '@/types/branch';

// ヘルパー関数: ランダムな数値を生成
const randomInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const randomFloat = (min: number, max: number, decimals: number = 2): number => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
};

// 期間文字列を生成
const generatePeriodString = (periodType: PeriodType, index: number): string => {
  const currentYear = 2024;
  const currentMonth = 11; // 11月
  
  switch (periodType) {
    case 'monthly':
      const month = ((currentMonth - index - 1 + 12) % 12) + 1;
      const year = currentYear - Math.floor((currentMonth - index - 1) / 12);
      return `${year}年${month}月`;
    
    case 'quarterly':
      const currentQuarter = Math.ceil(currentMonth / 3);
      const quarter = ((currentQuarter - index - 1 + 4) % 4) + 1;
      const qYear = currentYear - Math.floor((currentQuarter - index - 1) / 4);
      return `${qYear}年Q${quarter}`;
    
    case 'yearly':
      return `${currentYear - index}年度`;
    
    default:
      return `${currentYear}年${currentMonth}月`;
  }
};

// 支社規模に応じた基礎値を取得
const getBranchBaseMetrics = (branch: Branch) => {
  const sizeMultiplier = branch.agentCount / 15; // 平均15名を基準
  return {
    baseNewANP: Math.floor(20000000 * sizeMultiplier), // 2000万円 * 規模
    baseContractCount: Math.floor(80 * sizeMultiplier) // 80件 * 規模
  };
};

// 月次KPIメトリクスを生成
export const generateMonthlyMetrics = (branch: Branch, monthOffset: number = 0): KPIMetrics => {
  const { baseNewANP, baseContractCount } = getBranchBaseMetrics(branch);
  
  // 計画値（基礎値に季節変動を加味）
  const seasonalFactor = 1 + Math.sin((11 - monthOffset) * Math.PI / 6) * 0.15;
  const planNewANP = Math.floor(baseNewANP * seasonalFactor);
  const planContractCount = Math.floor(baseContractCount * seasonalFactor);
  
  // 実績値（計画の70%-120%）
  const achievementFactor = randomFloat(0.7, 1.2);
  const actualNewANP = Math.floor(planNewANP * achievementFactor);
  const actualContractCount = Math.floor(planContractCount * achievementFactor);
  
  // 達成率
  const anpAchievementRate = parseFloat(((actualNewANP / planNewANP) * 100).toFixed(1));
  const contractAchievementRate = parseFloat(((actualContractCount / planContractCount) * 100).toFixed(1));
  
  // 継続率（計画値と実績値）
  const continuationRatePlan = randomFloat(95, 98, 1);
  const continuationRateActual = randomFloat(93, 99, 1);
  const continuationRateAchievement = parseFloat(((continuationRateActual / continuationRatePlan) * 100).toFixed(1));
  
  return {
    newANP: {
      plan: planNewANP,
      actual: actualNewANP,
      achievementRate: anpAchievementRate
    },
    newContractCount: {
      plan: planContractCount,
      actual: actualContractCount,
      achievementRate: contractAchievementRate
    },
    continuationRate: {
      plan: continuationRatePlan,
      actual: continuationRateActual,
      achievementRate: continuationRateAchievement
    }
  };
};

// 四半期KPIメトリクスを生成
export const generateQuarterlyMetrics = (branch: Branch, quarterOffset: number = 0): KPIMetrics => {
  const { baseNewANP, baseContractCount } = getBranchBaseMetrics(branch);
  
  // 四半期は3ヶ月分
  const planNewANP = Math.floor(baseNewANP * 3 * 1.05);
  const planContractCount = Math.floor(baseContractCount * 3 * 1.05);
  
  const achievementFactor = randomFloat(0.75, 1.15);
  const actualNewANP = Math.floor(planNewANP * achievementFactor);
  const actualContractCount = Math.floor(planContractCount * achievementFactor);
  
  const anpAchievementRate = parseFloat(((actualNewANP / planNewANP) * 100).toFixed(1));
  const contractAchievementRate = parseFloat(((actualContractCount / planContractCount) * 100).toFixed(1));
  
  const continuationRatePlan = randomFloat(95, 98, 1);
  const continuationRateActual = randomFloat(94, 99, 1);
  const continuationRateAchievement = parseFloat(((continuationRateActual / continuationRatePlan) * 100).toFixed(1));
  
  return {
    newANP: {
      plan: planNewANP,
      actual: actualNewANP,
      achievementRate: anpAchievementRate
    },
    newContractCount: {
      plan: planContractCount,
      actual: actualContractCount,
      achievementRate: contractAchievementRate
    },
    continuationRate: {
      plan: continuationRatePlan,
      actual: continuationRateActual,
      achievementRate: continuationRateAchievement
    }
  };
};

// 年次KPIメトリクスを生成
export const generateYearlyMetrics = (branch: Branch, yearOffset: number = 0): KPIMetrics => {
  const { baseNewANP, baseContractCount } = getBranchBaseMetrics(branch);
  
  // 年次は12ヶ月分
  const planNewANP = Math.floor(baseNewANP * 12 * 1.1);
  const planContractCount = Math.floor(baseContractCount * 12 * 1.1);
  
  const achievementFactor = randomFloat(0.8, 1.1);
  const actualNewANP = Math.floor(planNewANP * achievementFactor);
  const actualContractCount = Math.floor(planContractCount * achievementFactor);
  
  const anpAchievementRate = parseFloat(((actualNewANP / planNewANP) * 100).toFixed(1));
  const contractAchievementRate = parseFloat(((actualContractCount / planContractCount) * 100).toFixed(1));
  
  const continuationRatePlan = randomFloat(95, 98, 1);
  const continuationRateActual = randomFloat(95, 99, 1);
  const continuationRateAchievement = parseFloat(((continuationRateActual / continuationRatePlan) * 100).toFixed(1));
  
  return {
    newANP: {
      plan: planNewANP,
      actual: actualNewANP,
      achievementRate: anpAchievementRate
    },
    newContractCount: {
      plan: planContractCount,
      actual: actualContractCount,
      achievementRate: contractAchievementRate
    },
    continuationRate: {
      plan: continuationRatePlan,
      actual: continuationRateActual,
      achievementRate: continuationRateAchievement
    }
  };
};

// 期間データを生成
export const generatePeriodData = (branch: Branch, periodType: PeriodType, periodOffset: number = 0): PeriodData => {
  let metrics: KPIMetrics;
  
  switch (periodType) {
    case 'monthly':
      metrics = generateMonthlyMetrics(branch, periodOffset);
      break;
    case 'quarterly':
      metrics = generateQuarterlyMetrics(branch, periodOffset);
      break;
    case 'yearly':
      metrics = generateYearlyMetrics(branch, periodOffset);
      break;
  }
  
  return {
    period: generatePeriodString(periodType, periodOffset),
    periodType,
    metrics
  };
};

// 履歴データを生成
export const generateHistoricalData = (branch: Branch, periodType: PeriodType, count: number = 6) => {
  return Array.from({ length: count }, (_, i) => {
    const periodData = generatePeriodData(branch, periodType, i);
    return {
      period: periodData.period,
      newANP: periodData.metrics.newANP.actual,
      newContractCount: periodData.metrics.newContractCount.actual,
      continuationRate: periodData.metrics.continuationRate.actual
    };
  }).reverse();
};

// エージェントデータを生成
export const generateAgentPerformance = (branchId: string, agentCount: number): AgentPerformance[] => {
  const agents: AgentPerformance[] = [];
  
  for (let i = 0; i < agentCount; i++) {
    const baseANP = randomInRange(1000000, 5000000); // 100万-500万
    const contractCount = randomInRange(5, 25);
    const achievementRate = randomFloat(70, 130, 1);
    
    agents.push({
      id: `agent-${branchId}-${i + 1}`,
      name: `営業社員 ${i + 1}`,
      anp: baseANP,
      contractCount,
      achievementRate,
      trend: Array.from({ length: 6 }, (_, j) => ({
        month: `${11 - j}月`,
        anp: Math.floor(baseANP * randomFloat(0.8, 1.2))
      })).reverse()
    });
  }
  
  return agents.sort((a, b) => b.anp - a.anp);
};

// 商品構成データを生成
export const generateProductMix = (): ProductMixData[] => {
  const products = ['終身保険', '医療保険', 'がん保険', '個人年金保険', '学資保険'];
  
  return products.map(productName => {
    const anp = randomInRange(5000000, 30000000);
    const contractCount = randomInRange(20, 100);
    const previousMonthAnp = Math.floor(anp * randomFloat(0.9, 1.1));
    
    return {
      productName,
      anp,
      contractCount,
      avgContractValue: Math.floor(anp / contractCount),
      previousMonthAnp,
      trend: Array.from({ length: 6 }, (_, i) => ({
        month: `${11 - i}月`,
        anp: Math.floor(anp * randomFloat(0.8, 1.2)),
        contractCount: Math.floor(contractCount * randomFloat(0.8, 1.2))
      })).reverse()
    };
  });
};

// 契約内訳データを生成
export const generateContractBreakdown = (): ContractBreakdownData => {
  const newContracts = randomInRange(80, 150);
  const prevNewContracts = randomInRange(70, 140);
  const cancellations = randomInRange(5, 20);
  const prevCancellations = randomInRange(5, 18);
  const netIncrease = newContracts - cancellations;
  const prevNetIncrease = prevNewContracts - prevCancellations;
  const cancellationRate = parseFloat(((cancellations / (newContracts + cancellations)) * 100).toFixed(1));
  
  return {
    newContracts,
    prevNewContracts,
    cancellations,
    prevCancellations,
    netIncrease,
    prevNetIncrease,
    cancellationRate,
    monthlyTrend: Array.from({ length: 6 }, (_, i) => ({
      month: `${11 - i}月`,
      new: randomInRange(70, 150),
      cancel: randomInRange(5, 20),
      net: randomInRange(60, 130),
      cancelRate: randomFloat(3, 8, 1)
    })).reverse(),
    acquisitionChannels: [
      { channel: 'Web申込', count: randomInRange(20, 50), percentage: 35 },
      { channel: '対面営業', count: randomInRange(30, 60), percentage: 45 },
      { channel: '紹介', count: randomInRange(10, 30), percentage: 20 }
    ]
  };
};

// 顧客セグメントデータを生成
export const generateCustomerSegments = (): CustomerSegmentData => {
  return {
    ageSegments: [
      { ageRange: '20-29歳', contractCount: randomInRange(10, 30), anp: randomInRange(2000000, 5000000), percentage: 15 },
      { ageRange: '30-39歳', contractCount: randomInRange(30, 60), anp: randomInRange(8000000, 15000000), percentage: 35 },
      { ageRange: '40-49歳', contractCount: randomInRange(25, 50), anp: randomInRange(7000000, 12000000), percentage: 30 },
      { ageRange: '50-59歳', contractCount: randomInRange(15, 35), anp: randomInRange(4000000, 8000000), percentage: 20 }
    ],
    genderSegments: [
      { gender: '男性', contractCount: randomInRange(40, 80), anp: randomInRange(12000000, 20000000), percentage: 55 },
      { gender: '女性', contractCount: randomInRange(30, 70), anp: randomInRange(10000000, 18000000), percentage: 45 }
    ],
    contractDurationSegments: [
      { duration: '1年未満', contractCount: randomInRange(20, 40), anp: randomInRange(5000000, 10000000), percentage: 25 },
      { duration: '1-3年', contractCount: randomInRange(30, 60), anp: randomInRange(8000000, 15000000), percentage: 40 },
      { duration: '3-5年', contractCount: randomInRange(15, 35), anp: randomInRange(4000000, 8000000), percentage: 20 },
      { duration: '5年以上', contractCount: randomInRange(10, 25), anp: randomInRange(3000000, 6000000), percentage: 15 }
    ]
  };
};

// 支社詳細データを生成
export const generateBranchDetailData = (
  branch: Branch,
  periodType: PeriodType
): BranchDetailData => {
  const currentPeriod = generatePeriodData(branch, periodType, 0);
  const historicalData = generateHistoricalData(branch, periodType, 6);
  
  return {
    branchId: branch.id,
    branchName: branch.name,
    kpi: {
      newANP: currentPeriod.metrics.newANP,
      newContractCount: currentPeriod.metrics.newContractCount,
      continuationRate: currentPeriod.metrics.continuationRate,
      activeAgents: branch.agentCount,
      totalAgents: branch.agentCount
    },
    agents: generateAgentPerformance(branch.id, branch.agentCount),
    productMix: generateProductMix(),
    contractBreakdown: generateContractBreakdown(),
    customerSegments: generateCustomerSegments(),
    monthlyData: historicalData.map(h => ({
      month: h.period,
      anp: h.newANP,
      contractCount: h.newContractCount
    }))
  };
};
