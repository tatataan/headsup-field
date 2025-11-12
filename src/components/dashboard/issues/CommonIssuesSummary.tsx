import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface CommonIssue {
  theme: string;
  middleTheme: string;
  count: number;
  percentage: number;
  trend?: "up" | "down" | "stable";
  sampleContent: string;
}

interface CommonIssuesSummaryProps {
  issues: CommonIssue[];
  onIssueClick?: (theme: string, middleTheme: string) => void;
}

export const CommonIssuesSummary = ({ issues, onIssueClick }: CommonIssuesSummaryProps) => {
  const getTrendIcon = (trend?: "up" | "down" | "stable") => {
    switch (trend) {
      case "up": return <TrendingUp className="h-4 w-4 text-warning" />;
      case "down": return <TrendingDown className="h-4 w-4 text-success" />;
      default: return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>よく見られる課題 Top 10</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {issues.map((issue, index) => (
            <Card 
              key={`${issue.theme}-${issue.middleTheme}`}
              className="border border-border hover:border-primary/50 cursor-pointer transition-colors"
              onClick={() => onIssueClick?.(issue.theme, issue.middleTheme)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Badge variant="outline" className="mb-2">{issue.theme}</Badge>
                    <CardTitle className="text-base">{issue.middleTheme}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(issue.trend)}
                    <span className="text-2xl font-bold text-foreground">{index + 1}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="mb-2">
                  <span className="text-xl font-bold text-primary">{issue.count}</span>
                  <span className="text-sm text-muted-foreground ml-2">
                    件 ({issue.percentage.toFixed(1)}%)
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {issue.sampleContent}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
