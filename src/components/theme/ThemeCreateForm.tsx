import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Send } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { ThemeClassificationSelector } from "./ThemeClassificationSelector";
import { OrganizationTargetSelector } from "./OrganizationTargetSelector";
import { DateRangePicker } from "./DateRangePicker";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const ThemeCreateForm = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRequired, setIsRequired] = useState(false);
  const [inputDialogOpen, setInputDialogOpen] = useState(false);
  const [userInput, setUserInput] = useState("");
  
  // Theme classification
  const [majorTheme, setMajorTheme] = useState("");
  const [middleTheme, setMiddleTheme] = useState("");
  const [detailTheme, setDetailTheme] = useState("");
  
  // Date range
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>();
  
  // Organization targeting
  const [selectedTargets, setSelectedTargets] = useState<{
    type: "all" | "departments" | "branches";
    departmentIds: string[];
    branchIds: string[];
  }>({
    type: "all",
    departmentIds: [],
    branchIds: [],
  });

  const handleAIGenerate = () => {
    setUserInput("");
    setInputDialogOpen(true);
  };

  const handleGenerateFromInput = async () => {
    if (!userInput || userInput.trim().length < 10) {
      toast.error("もう少し詳しく情報を入力してください（10文字以上）");
      return;
    }

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-theme-content', {
        body: { userInput: userInput.trim() }
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.title && data.content) {
        setTitle(data.title);
        setContent(data.content);
        setInputDialogOpen(false);
        toast.success("AIがコンテンツを生成しました。内容を確認して必要に応じて編集してください。");
      } else {
        throw new Error("生成されたコンテンツが不正です。");
      }
    } catch (error: any) {
      console.error("AI generation error:", error);
      toast.error(error.message || "コンテンツの生成中にエラーが発生しました。");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePost = async () => {
    if (!startDate || !endDate) {
      toast.error("配信期間を設定してください");
      return;
    }

    if (!majorTheme || !middleTheme || !detailTheme) {
      toast.error("テーマ分類を選択してください");
      return;
    }

    try {
      const targetIds =
        selectedTargets.type === "all"
          ? null
          : {
              departmentIds: selectedTargets.departmentIds,
              branchIds: selectedTargets.branchIds,
            };

      const { error } = await supabase.from("theme_distributions").insert({
        title,
        content,
        major_theme: majorTheme,
        middle_theme: middleTheme,
        detail_theme: detailTheme,
        distribution_start_date: startDate.toISOString().split("T")[0],
        distribution_end_date: endDate.toISOString().split("T")[0],
        is_required: isRequired,
        target_type: selectedTargets.type,
        target_ids: targetIds,
      });

      if (error) throw error;

      toast.success("代理店サポートテーマを配信しました");
      navigate("/topics/new?tab=history");
    } catch (error) {
      console.error("Error posting theme:", error);
      toast.error("配信に失敗しました");
    }
  };

  const isFormValid = title && content && majorTheme && middleTheme && detailTheme && startDate && endDate;

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Step 1: Main Content Card */}
        <Card className="p-6 border-primary/20">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">1</span>
                投稿内容を作成
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                営業担当者に伝えたい内容を入力してください
              </p>
            </div>

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

            <div>
              <Button
                onClick={handleAIGenerate}
                variant="outline"
                disabled={isGenerating}
                className="w-full"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {isGenerating ? "生成中..." : "AIで生成"}
              </Button>
            </div>
          </div>
        </Card>

        {/* Step 2: Theme Classification Card */}
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">2</span>
              テーマ分類を選択
            </h3>
            <p className="text-sm text-muted-foreground">
              作成した内容に適したテーマを選択してください
            </p>
          </div>
          <ThemeClassificationSelector
            majorTheme={majorTheme}
            middleTheme={middleTheme}
            detailTheme={detailTheme}
            onMajorThemeChange={setMajorTheme}
            onMiddleThemeChange={setMiddleTheme}
            onDetailThemeChange={setDetailTheme}
          />
        </Card>
      </div>

      <div className="space-y-6">
        {/* Step 3: Date Range Card */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">3</span>
            配信期間
          </h3>
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
        </Card>

        {/* Step 4: Target Selection Card */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">4</span>
            配信対象
          </h3>
          <OrganizationTargetSelector
            selectedTargets={selectedTargets}
            onChange={setSelectedTargets}
          />
        </Card>

        {/* Step 5: Required Response Toggle */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">5</span>
            必須対応
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                対応状況を追跡します
              </p>
            </div>
            <Switch
              id="required-toggle"
              checked={isRequired}
              onCheckedChange={setIsRequired}
            />
          </div>
        </Card>
      </div>
    </div>

    {/* Prominent Submit Section */}
    <Card className="p-6 border-primary/20 bg-primary/5 mt-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            投稿の準備が完了しました
          </h3>
          <p className="text-sm text-muted-foreground">
            {isFormValid 
              ? "下のボタンをクリックして配信してください" 
              : "全ての必須項目を入力してください"}
          </p>
        </div>
        <Button
          onClick={handlePost}
          disabled={!isFormValid}
          size="lg"
          className="min-w-[160px]"
        >
          <Send className="w-4 h-4 mr-2" />
          投稿する
        </Button>
      </div>
    </Card>

    {/* AI Input Dialog */}
    <Dialog open={inputDialogOpen} onOpenChange={setInputDialogOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AIコンテンツ生成
          </DialogTitle>
          <DialogDescription>
            配信したい情報を入力してください。AIが営業担当者向けの投稿内容を自動生成します。
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="user-input">配信内容</Label>
            <Textarea
              id="user-input"
              placeholder="例: 12月15日に事業承継セミナーを開催します。税理士法人と連携して、承継の基礎知識や税制優遇措置について解説します。場所は本社会議室、時間は14時から16時までです。"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="min-h-[150px]"
              disabled={isGenerating}
            />
            <p className="text-sm text-muted-foreground">
              {userInput.length}文字 {userInput.length < 10 && "（最低10文字必要です）"}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setInputDialogOpen(false)}
            disabled={isGenerating}
          >
            キャンセル
          </Button>
          <Button
            onClick={handleGenerateFromInput}
            disabled={isGenerating || userInput.trim().length < 10}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {isGenerating ? "生成中..." : "生成"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
};
