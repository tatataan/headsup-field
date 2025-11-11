import { PeriodData, KPIMetrics } from './kpi';

export interface Department {
  id: string;
  code: string;
  name: string;
  type: 'sales' | 'corporate' | 'financial';
  region?: string;
  branchIds: string[];
}

export interface BranchSummary {
  branchId: string;
  branchName: string;
  branchCode: string;
  newANP: { plan: number; actual: number; achievementRate: number };
  newContractCount: { plan: number; actual: number; achievementRate: number };
  continuationRate: number;
  agentCount: number;
}

export interface DepartmentDetailData {
  departmentId: string;
  departmentName: string;
  departmentCode: string;
  currentPeriod: PeriodData;
  historicalData: PeriodData[];
  branches: BranchSummary[];
  totalMetrics: KPIMetrics;
}
