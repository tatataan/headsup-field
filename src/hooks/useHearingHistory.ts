import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
