import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HearingHistory } from "@/hooks/useHearingHistory";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface ThemeDrillDownModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  theme: string | null;
  middleTheme?: string;
  hearingHistory: HearingHistory[];
}

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

export const ThemeDrillDownModal = ({ 
  open, 
  onOpenChange, 
  theme, 
  middleTheme,
  hearingHistory 
}: ThemeDrillDownModalProps) => {
  if (!theme) return null;

  const filteredData = hearingHistory.filter(h => {
    if (middleTheme) {
      return h.major_theme === theme && h.middle_theme === middleTheme;
    }
    return h.major_theme === theme;
  });

  // Count middle themes
  const middleThemeCount: Record<string, number> = {};
  filteredData.forEach(h => {
    middleThemeCount[h.middle_theme] = (middleThemeCount[h.middle_theme] || 0) + 1;
  });

  const middleThemeData = Object.entries(middleThemeCount).map(([name, count]) => ({
    name,
    count
  })).sort((a, b) => b.count - a.count);

  // Count detail themes
  const detailThemeCount: Record<string, number> = {};
  filteredData.forEach(h => {
    detailThemeCount[h.detail_theme] = (detailThemeCount[h.detail_theme] || 0) + 1;
  });

  const detailThemeData = Object.entries(detailThemeCount).map(([name, count]) => ({
    name,
    count
  })).sort((a, b) => b.count - a.count);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {theme} {middleTheme && ` > ${middleTheme}`} の詳細分析
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">ヒアリング総数</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{filteredData.length}件</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">中分類数</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{middleThemeData.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">詳細分類数</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{detailThemeData.length}</p>
              </CardContent>
            </Card>
          </div>

          {!middleTheme && (
            <Card>
              <CardHeader>
                <CardTitle>中分類別内訳</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={middleThemeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                    />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                      {middleThemeData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>詳細分類別内訳</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={detailThemeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {detailThemeData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>関連ヒアリング内容（最新5件）</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredData.slice(0, 5).map((record) => (
                  <Card key={record.id} className="border border-border">
                    <CardContent className="pt-4">
                      <div className="flex gap-2 mb-2">
                        <Badge variant="outline">{record.middle_theme}</Badge>
                        <Badge variant="secondary">{record.detail_theme}</Badge>
                      </div>
                      <p className="text-sm text-foreground mb-2">{record.content}</p>
                      <div className="text-xs text-muted-foreground">
                        {new Date(record.date).toLocaleDateString('ja-JP')} - {record.staff_name} - 代理店 {record.agency_id}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
