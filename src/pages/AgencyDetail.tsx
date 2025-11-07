import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, Users, Building2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AgencyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          ダッシュボードに戻る
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">東京中央代理店</h1>
          <p className="text-muted-foreground">代理店ID: {id} | 担当: 佐藤太郎</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">ANP</h3>
            </div>
            <p className="text-3xl font-bold text-foreground mb-2">¥125.5M</p>
            <p className="text-sm text-success">+8.2% vs 前月</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">従業員数</h3>
            </div>
            <p className="text-3xl font-bold text-foreground mb-2">45名</p>
            <p className="text-sm text-muted-foreground">正社員: 32名</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">設立年</h3>
            </div>
            <p className="text-3xl font-bold text-foreground mb-2">1985年</p>
            <p className="text-sm text-muted-foreground">創業39年目</p>
          </Card>
        </div>

        <Tabs defaultValue="issues" className="w-full">
          <TabsList>
            <TabsTrigger value="issues">経営課題</TabsTrigger>
            <TabsTrigger value="history">活動履歴</TabsTrigger>
            <TabsTrigger value="mobile">担当者画面</TabsTrigger>
          </TabsList>

          <TabsContent value="issues" className="mt-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">経営課題ヒアリングメモ</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-foreground mb-2">事業計画</h4>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-foreground mb-2">
                      <strong>状況:</strong> 事業承継が未着手
                    </p>
                    <p className="text-sm text-muted-foreground">
                      現社長（65歳）は後継者問題を認識しているが、具体的な準備には至っていない。
                      長男は別業界で勤務中。税理士との連携も未実施。
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-2">人材・組織</h4>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-foreground mb-2">
                      <strong>状況:</strong> 若手育成に課題
                    </p>
                    <p className="text-sm text-muted-foreground">
                      入社3年目までの離職率が25%と高い。デジタルツール活用のスキル不足が顕著。
                      研修体系の整備が必要。
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-2">業務・財務</h4>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-foreground mb-2">
                      <strong>状況:</strong> システム化が遅れている
                    </p>
                    <p className="text-sm text-muted-foreground">
                      顧客管理が紙ベース中心。業務効率化の余地が大きい。
                      クラウド型CRM導入を検討中だが、コスト面で躊躇。
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">活動履歴</h3>
              <p className="text-muted-foreground">直近の訪問・支援活動の履歴が表示されます。</p>
            </Card>
          </TabsContent>

          <TabsContent value="mobile" className="mt-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">担当者スマホ画面（閲覧）</h3>
              <p className="text-muted-foreground">担当者が見ているスマホ画面をリアルタイムで確認できます。</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AgencyDetail;
