import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, User } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HearingHistory } from "@/hooks/useHearingHistory";

interface QualitativeInsightsProps {
  hearingHistory: HearingHistory[];
}

export const QualitativeInsights = ({ hearingHistory }: QualitativeInsightsProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTheme, setSelectedTheme] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const uniqueThemes = Array.from(new Set(hearingHistory.map(h => h.major_theme)));

  const filteredData = hearingHistory.filter(item => {
    const matchesSearch = searchQuery === "" || 
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.agency_id.includes(searchQuery);
    const matchesTheme = selectedTheme === "all" || item.major_theme === selectedTheme;
    return matchesSearch && matchesTheme;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Card>
      <CardHeader>
        <CardTitle>ヒアリング内容詳細</CardTitle>
        <div className="flex flex-col md:flex-row gap-3 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="内容または代理店IDで検索..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>
          <Select value={selectedTheme} onValueChange={(value) => {
            setSelectedTheme(value);
            setCurrentPage(1);
          }}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="テーマで絞り込み" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべてのテーマ</SelectItem>
              {uniqueThemes.map(theme => (
                <SelectItem key={theme} value={theme}>{theme}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {paginatedData.map((record) => (
            <Card key={record.id} className="border border-border">
              <CardContent className="pt-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="default">{record.major_theme}</Badge>
                    <Badge variant="outline">{record.middle_theme}</Badge>
                    <Badge variant="secondary">{record.detail_theme}</Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">代理店 {record.agency_id}</span>
                </div>
                <p className="text-foreground mb-3">{record.content}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(record.date).toLocaleDateString('ja-JP')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{record.staff_name}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded border border-border disabled:opacity-50 hover:bg-muted"
            >
              前へ
            </button>
            <span className="text-sm text-muted-foreground">
              {currentPage} / {totalPages} ページ
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded border border-border disabled:opacity-50 hover:bg-muted"
            >
              次へ
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
