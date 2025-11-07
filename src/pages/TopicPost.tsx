import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Sparkles, Send } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

const TopicPost = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAIGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setTitle("【緊急案内】事業承継セミナー開催のお知らせ");
      setContent(
        "代理店経営者の皆様へ\n\n" +
        "この度、税理士法人と連携した「事業承継セミナー」を開催いたします。\n\n" +
        "【内容】\n" +
        "・事業承継の基礎知識\n" +
        "・税制優遇措置の活用方法\n" +
        "・具体的な承継スケジュール作成\n\n" +
        "【日時】2024年12月15日（金）14:00-16:00\n" +
        "【場所】本社会議室 / オンライン同時開催\n\n" +
        "事業承継の準備は早期着手が重要です。ぜひご参加ください。"
      );
      setIsGenerating(false);
      toast.success("AIが投稿内容を生成しました");
    }, 1500);
  };

  const handlePost = () => {
    toast.success("会話トピックを投稿しました");
    navigate("/");
  };

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
          <h1 className="text-3xl font-bold text-foreground mb-2">会話トピック投稿</h1>
          <p className="text-muted-foreground">営業担当者に配信する支援施策を作成</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="title">タイトル</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="例: 事業承継セミナーのご案内"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="content">内容</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="営業担当者が代理店経営者に伝える内容を入力してください..."
                    className="mt-2 min-h-[300px]"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleAIGenerate}
                    variant="outline"
                    disabled={isGenerating}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {isGenerating ? "生成中..." : "AIで生成"}
                  </Button>
                  <Button
                    onClick={handlePost}
                    disabled={!title || !content}
                    className="flex-1"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    投稿する
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          <div>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">配信対象</h3>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-3 block">課題別ターゲティング</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="succession" defaultChecked />
                      <label htmlFor="succession" className="text-sm">
                        事業承継：未着手（2件）
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="training" />
                      <label htmlFor="training" className="text-sm">
                        人材育成：課題あり（3件）
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="system" />
                      <label htmlFor="system" className="text-sm">
                        システム化：未導入（1件）
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Label className="text-sm font-medium mb-3 block">組織別</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="tokyo" />
                      <label htmlFor="tokyo" className="text-sm">
                        東京支社
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="osaka" />
                      <label htmlFor="osaka" className="text-sm">
                        大阪支社
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="all" />
                      <label htmlFor="all" className="text-sm">
                        全社
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="p-3 bg-accent rounded-lg">
                    <p className="text-sm text-accent-foreground">
                      配信予定: <strong>2代理店</strong>の担当者
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicPost;
