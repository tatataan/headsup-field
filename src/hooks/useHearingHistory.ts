import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMemo } from "react";

export interface HearingHistory {
  id: string;
  agency_id: string;
  major_theme: string;
  middle_theme: string;
  detail_theme: string;
  content: string;
  staff_name: string;
  date: string;
  branch_id?: string;
  department_id?: string;
  created_at: string;
  updated_at: string;
}

export interface EnrichedHearingHistory extends HearingHistory {
  enrichedBranchId?: string;
  enrichedDepartmentId?: string;
}

// Fetch agency_branches mapping
export const useAgencyBranches = () => {
  return useQuery({
    queryKey: ["agency-branches"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agency_branches")
        .select("*");

      if (error) throw error;
      return data as { agency_id: string; branch_id: string; department_id: string }[];
    },
  });
};

export const useHearingHistory = () => {
  return useQuery({
    queryKey: ["hearing-history"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hearing_history")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;
      return data as HearingHistory[];
    },
  });
};

// Enrich hearing history with branch/department info from agency mapping
export const useEnrichedHearingHistory = () => {
  const { data: hearingHistory, ...rest } = useHearingHistory();
  const { data: agencyBranches } = useAgencyBranches();

  const enrichedData: EnrichedHearingHistory[] | undefined = useMemo(() => {
    if (!hearingHistory || !agencyBranches) return hearingHistory as EnrichedHearingHistory[] | undefined;

    const agencyMap = new Map(
      agencyBranches.map(ab => [ab.agency_id, { branch_id: ab.branch_id, department_id: ab.department_id }])
    );

    return hearingHistory.map(history => {
      const mapping = agencyMap.get(history.agency_id);
      return {
        ...history,
        enrichedBranchId: mapping?.branch_id || history.branch_id,
        enrichedDepartmentId: mapping?.department_id || history.department_id,
      } as EnrichedHearingHistory;
    });
  }, [hearingHistory, agencyBranches]);

  return { data: enrichedData, ...rest };
};

// Filter by department
export const useHearingHistoryByDepartment = (departmentId: string | null) => {
  const { data: enrichedHistory, ...rest } = useEnrichedHearingHistory();

  const filteredData: EnrichedHearingHistory[] | undefined = useMemo(() => {
    if (!departmentId || !enrichedHistory) return enrichedHistory;
    return enrichedHistory.filter(h => h.enrichedDepartmentId === departmentId);
  }, [enrichedHistory, departmentId]);

  return { data: filteredData, ...rest };
};

// Filter by branch
export const useHearingHistoryByBranch = (branchId: string | null) => {
  const { data: enrichedHistory, ...rest } = useEnrichedHearingHistory();

  const filteredData: EnrichedHearingHistory[] | undefined = useMemo(() => {
    if (!branchId || !enrichedHistory) return enrichedHistory;
    return enrichedHistory.filter(h => h.enrichedBranchId === branchId);
  }, [enrichedHistory, branchId]);

  return { data: filteredData, ...rest };
};

// Department comparison data
export const useDepartmentComparison = () => {
  const { data: enrichedHistory } = useEnrichedHearingHistory();

  return useMemo(() => {
    if (!enrichedHistory) return [];

    const deptMap = new Map<string, { [theme: string]: number }>();

    enrichedHistory.forEach(h => {
      const deptId = h.enrichedDepartmentId;
      if (!deptId) return;

      if (!deptMap.has(deptId)) {
        deptMap.set(deptId, {});
      }

      const themes = deptMap.get(deptId)!;
      themes[h.major_theme] = (themes[h.major_theme] || 0) + 1;
    });

    return Array.from(deptMap.entries()).map(([departmentId, themes]) => ({
      departmentId,
      themes,
      total: Object.values(themes).reduce((sum, count) => sum + count, 0),
    }));
  }, [enrichedHistory]);
};

// Branch comparison data
export const useBranchComparison = (departmentId?: string | null) => {
  const { data: enrichedHistory } = useEnrichedHearingHistory();

  return useMemo(() => {
    if (!enrichedHistory) return [];

    let filtered = enrichedHistory;
    if (departmentId) {
      filtered = enrichedHistory.filter(h => h.enrichedDepartmentId === departmentId);
    }

    const branchMap = new Map<string, { [theme: string]: number }>();

    filtered.forEach(h => {
      const branchId = h.enrichedBranchId;
      if (!branchId) return;

      if (!branchMap.has(branchId)) {
        branchMap.set(branchId, {});
      }

      const themes = branchMap.get(branchId)!;
      themes[h.major_theme] = (themes[h.major_theme] || 0) + 1;
    });

    return Array.from(branchMap.entries()).map(([branchId, themes]) => ({
      branchId,
      themes,
      total: Object.values(themes).reduce((sum, count) => sum + count, 0),
    }));
  }, [enrichedHistory, departmentId]);
};

// Department ranking
export const useDepartmentRanking = () => {
  const comparisonData = useDepartmentComparison();

  return useMemo(() => {
    return [...comparisonData].sort((a, b) => b.total - a.total);
  }, [comparisonData]);
};

// Branch ranking
export const useBranchRanking = (departmentId?: string | null) => {
  const comparisonData = useBranchComparison(departmentId);

  return useMemo(() => {
    return [...comparisonData].sort((a, b) => b.total - a.total);
  }, [comparisonData]);
};

export const useThemeAnalysis = () => {
  return useQuery({
    queryKey: ["theme-analysis"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hearing_history")
        .select("*");

      if (error) throw error;

      const hearingData = data as HearingHistory[];

      // Count themes
      const themeCount: Record<string, number> = {};
      const middleThemeCount: Record<string, Record<string, number>> = {};
      const detailThemeCount: Record<string, Record<string, number>> = {};

      hearingData.forEach((record) => {
        // Major themes
        themeCount[record.major_theme] = (themeCount[record.major_theme] || 0) + 1;

        // Middle themes by major
        if (!middleThemeCount[record.major_theme]) {
          middleThemeCount[record.major_theme] = {};
        }
        middleThemeCount[record.major_theme][record.middle_theme] = 
          (middleThemeCount[record.major_theme][record.middle_theme] || 0) + 1;

        // Detail themes by middle
        if (!detailThemeCount[record.middle_theme]) {
          detailThemeCount[record.middle_theme] = {};
        }
        detailThemeCount[record.middle_theme][record.detail_theme] = 
          (detailThemeCount[record.middle_theme][record.detail_theme] || 0) + 1;
      });

      return {
        themeCount,
        middleThemeCount,
        detailThemeCount,
        totalHearings: hearingData.length,
        uniqueThemes: Object.keys(themeCount).length,
      };
    },
  });
};
