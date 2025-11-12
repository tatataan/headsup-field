import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, MessageSquare, TrendingUp, Users, Building2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MobileView = () => {
  const topics = [
    {
      id: 1,
      title: "事業承継セミナーのご案内",
      type: "本社配信",
      date: "2024-11-07",
      priority: "high",
    },
    {
      id: 2,
      title: "次回訪問時の提案事項",
      type: "AI生成",
      date: "2024-11-07",
      priority: "medium",
    },
    {
      id: 3,
      title: "人材育成施策の共有",
      type: "本社配信",
      date: "2024-11-06",
      priority: "low",
    },
  ];

  return (
    <div className="flex-1 overflow-auto bg-background">
      <div className="p-8">
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">モバイルビュー</h1>
            <p className="text-sm text-muted-foreground">営業担当者のスマホ画面プレビュー</p>
          </div>

          <div className="bg-card border-8 border-sidebar rounded-[2.5rem] shadow-2xl overflow-hidden">
            <div className="bg-sidebar p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-sidebar-foreground/70">担当者</p>
                  <p className="text-sm font-medium text-sidebar-foreground">佐藤 太郎</p>
                </div>
                <Button size="icon" variant="ghost" className="text-sidebar-foreground">
                  <Bell className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="p-4 space-y-4 bg-background" style={{ minHeight: "600px" }}>
              <Tabs defaultValue="topics" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="topics">代理店サポートテーマ</TabsTrigger>
                  <TabsTrigger value="overview">代理店概況</TabsTrigger>
                </TabsList>

                <TabsContent value="topics" className="space-y-3 mt-4">
                  {topics.map((topic) => (
                    <Card
                      key={topic.id}
                      className={`p-4 cursor-pointer hover:shadow-md transition-shadow ${
                        topic.priority === "high" ? "border-l-4 border-l-destructive" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <MessageSquare className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm text-foreground mb-1">{topic.title}</h3>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{topic.type}</span>
                            <span>•</span>
                            <span>{topic.date}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="overview" className="space-y-4 mt-4">
                  <Card className="p-4">
                    <h3 className="font-semibold text-sm text-foreground mb-3">東京中央代理店</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground">ANP</p>
                          <p className="text-sm font-semibold text-foreground">¥125.5M</p>
                        </div>
                        <span className="text-xs text-success">+8.2%</span>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                        <Users className="w-4 h-4 text-primary" />
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground">従業員数</p>
                          <p className="text-sm font-semibold text-foreground">45名</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                        <Building2 className="w-4 h-4 text-primary" />
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground">設立</p>
                          <p className="text-sm font-semibold text-foreground">1985年</p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-medium text-sm text-foreground mb-3">経営課題メモ</h4>
                    <div className="space-y-2 text-xs">
                      <div className="p-2 bg-destructive/10 rounded">
                        <p className="text-destructive font-medium">事業承継：未着手</p>
                      </div>
                      <div className="p-2 bg-warning/10 rounded">
                        <p className="text-warning font-medium">人材育成：スキル不足</p>
                      </div>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileView;
