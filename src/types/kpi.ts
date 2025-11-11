export type PeriodType = 'monthly' | 'quarterly' | 'yearly';

export interface KPIMetrics {
  newANP: {
    plan: number;
    actual: number;
    achievementRate: number;
  };
  newContractCount: {
    plan: number;
    actual: number;
    achievementRate: number;
  };
  continuationRate: {
    actual: number;
    previousMonth?: number;
  };
}

export interface PeriodData {
  period: string; // "2024年3月", "2024Q1", "2024年度"など
  periodType: PeriodType;
  metrics: KPIMetrics;
  historicalData?: {
    period: string;
    newANP: number;
    newContractCount: number;
    continuationRate: number;
  }[];
}
