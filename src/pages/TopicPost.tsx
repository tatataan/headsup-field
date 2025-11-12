import { useNavigate, useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeCreateForm } from "@/components/theme/ThemeCreateForm";
import { ThemeHistoryList } from "@/components/theme/ThemeHistoryList";

const TopicPost = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "create";

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            代理店サポートテーマ配信
          </h1>
          <p className="text-muted-foreground">
            営業担当者に配信する支援施策を作成・管理
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setSearchParams({ tab: value })}
          className="w-full"
        >
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="create">作成・配信</TabsTrigger>
            <TabsTrigger value="history">配信履歴</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="mt-6">
            <ThemeCreateForm />
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <ThemeHistoryList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TopicPost;
