// Generate consistent colors for themes based on database data
export const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--accent))",
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
];

export const generateThemeColors = (themes: string[]): Record<string, string> => {
  const colorMap: Record<string, string> = {};
  themes.forEach((theme, index) => {
    colorMap[theme] = CHART_COLORS[index % CHART_COLORS.length];
  });
  return colorMap;
};
