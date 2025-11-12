import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Theme {
  id: string;
  major_theme: string;
  middle_theme: string;
  detail_theme: string;
  sample_data: string | null;
  manager_script: string | null;
  recruiter_script: string | null;
}

export interface ThemeClassification {
  major_theme: string;
  middle_themes: {
    middle_theme: string;
    detail_themes: string[];
  }[];
}

export const useThemes = () => {
  return useQuery({
    queryKey: ["themes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("themes")
        .select("*")
        .order("major_theme", { ascending: true })
        .order("middle_theme", { ascending: true })
        .order("detail_theme", { ascending: true });

      if (error) throw error;
      return data as Theme[];
    },
  });
};

export const useThemeClassifications = () => {
  return useQuery({
    queryKey: ["theme-classifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("themes")
        .select("major_theme, middle_theme, detail_theme")
        .order("major_theme", { ascending: true })
        .order("middle_theme", { ascending: true })
        .order("detail_theme", { ascending: true });

      if (error) throw error;

      // Group by major_theme, then middle_theme
      const classifications: ThemeClassification[] = [];
      const majorThemeMap = new Map<string, Set<string>>();
      const middleThemeMap = new Map<string, Set<string>>();

      data.forEach((theme) => {
        if (!majorThemeMap.has(theme.major_theme)) {
          majorThemeMap.set(theme.major_theme, new Set());
        }
        majorThemeMap.get(theme.major_theme)!.add(theme.middle_theme);

        const key = `${theme.major_theme}::${theme.middle_theme}`;
        if (!middleThemeMap.has(key)) {
          middleThemeMap.set(key, new Set());
        }
        middleThemeMap.get(key)!.add(theme.detail_theme);
      });

      majorThemeMap.forEach((middleThemes, major) => {
        const middleThemeList = Array.from(middleThemes).map((middle) => ({
          middle_theme: middle,
          detail_themes: Array.from(
            middleThemeMap.get(`${major}::${middle}`) || []
          ),
        }));

        classifications.push({
          major_theme: major,
          middle_themes: middleThemeList,
        });
      });

      return classifications;
    },
  });
};
