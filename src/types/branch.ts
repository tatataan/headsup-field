export interface BranchKPI {
  currentANP: number;
  targetANP: number;
  contractCount: number;
  prevContractCount: number;
  contractValue: number;
  prevContractValue: number;
  achievementRate: number;
  activeAgents: number;
  totalAgents: number;
}

export interface AgentPerformance {
  id: string;
  name: string;
  anp: number;
  contractCount: number;
  achievementRate: number;
  trend: { month: string; anp: number }[];
}

export interface ProductMixData {
  productName: string;
  anp: number;
  contractCount: number;
  avgContractValue: number;
  previousMonthAnp: number;
  trend: { month: string; anp: number; contractCount: number }[];
}

export interface ContractBreakdownData {
  newContracts: number;
  prevNewContracts: number;
  cancellations: number;
  prevCancellations: number;
  netIncrease: number;
  prevNetIncrease: number;
  cancellationRate: number;
  monthlyTrend: {
    month: string;
    new: number;
    cancel: number;
    net: number;
    cancelRate: number;
  }[];
  acquisitionChannels: {
    channel: string;
    count: number;
    percentage: number;
  }[];
}

export interface CustomerSegmentData {
  ageSegments: {
    ageRange: string;
    contractCount: number;
    anp: number;
    percentage: number;
  }[];
  genderSegments: {
    gender: string;
    contractCount: number;
    anp: number;
    percentage: number;
  }[];
  contractDurationSegments: {
    duration: string;
    contractCount: number;
    anp: number;
    percentage: number;
  }[];
}

export interface BranchDetailData {
  branchId: string;
  branchName: string;
  kpi: BranchKPI;
  agents: AgentPerformance[];
  productMix: ProductMixData[];
  contractBreakdown: ContractBreakdownData;
  customerSegments: CustomerSegmentData;
  monthlyData: { month: string; anp: number; contractCount: number }[];
}
