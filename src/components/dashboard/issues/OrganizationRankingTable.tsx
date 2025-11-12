import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { departments } from "@/data/departments";
import { branches } from "@/data/branches";

interface OrganizationRankingTableProps {
  data: Array<{
    id: string;
    themes: { [theme: string]: number };
    total: number;
  }>;
  type: 'department' | 'branch';
  onDrillDown?: (id: string) => void;
}

export const OrganizationRankingTable = ({
  data,
  type,
  onDrillDown,
}: OrganizationRankingTableProps) => {
  const sortedData = [...data].sort((a, b) => b.total - a.total);

  const getName = (id: string) => {
    if (type === 'department') {
      return departments.find(d => d.id === id)?.name || id;
    }
    return branches.find(b => b.id === id)?.name || id;
  };

  const getTopThemes = (themes: { [theme: string]: number }) => {
    return Object.entries(themes)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([theme]) => theme);
  };

  const getTrendIcon = (index: number) => {
    // Mock trend data - in real implementation, compare with previous period
    if (index < 2) return <TrendingUp className="h-4 w-4 text-destructive" />;
    if (index < 5) return <Minus className="h-4 w-4 text-muted-foreground" />;
    return <TrendingDown className="h-4 w-4 text-green-500" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {type === 'department' ? '統括部' : '支社'}別ランキング
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">順位</TableHead>
              <TableHead>{type === 'department' ? '統括部' : '支社'}名</TableHead>
              <TableHead className="text-right">課題数</TableHead>
              <TableHead>主要課題</TableHead>
              <TableHead className="w-[80px] text-center">トレンド</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">#{index + 1}</TableCell>
                <TableCell className="font-medium">{getName(item.id)}</TableCell>
                <TableCell className="text-right">
                  <Badge variant="secondary">{item.total}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {getTopThemes(item.themes).map(theme => (
                      <Badge key={theme} variant="outline" className="text-xs">
                        {theme}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {getTrendIcon(index)}
                </TableCell>
                <TableCell>
                  {onDrillDown && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDrillDown(item.id)}
                      className="gap-1"
                    >
                      詳細
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
