import { Card } from "@/components/ui/card";
import { Building2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CircleButton } from "@/components/ui/circle-button";

interface Branch {
  id: string;
  name: string;
  area: string;
  status: string;
  anp: string;
}

export const AgencyList = () => {
  const navigate = useNavigate();
  
  const branches: Branch[] = [
    { id: "1", name: "渋谷支店", area: "関東エリア", status: "良好", anp: "¥45.2M" },
    { id: "2", name: "新宿支店", area: "関東エリア", status: "良好", anp: "¥38.7M" },
    { id: "3", name: "池袋支店", area: "関東エリア", status: "良好", anp: "¥35.1M" },
    { id: "4", name: "品川支店", area: "関東エリア", status: "注意", anp: "¥32.8M" },
    { id: "5", name: "上野支店", area: "関東エリア", status: "要対応", anp: "¥28.5M" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "良好":
        return "text-success";
      case "注意":
        return "text-warning";
      case "要対応":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Card className="glass-effect p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-accent/20 rounded-lg">
            <Building2 className="w-5 h-5 text-accent" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">支店一覧</h3>
        </div>
        <span className="text-sm text-muted-foreground px-3 py-1 bg-muted/50 rounded-full">
          {branches.length}店舗
        </span>
      </div>
      
      <div className="space-y-2">
        {branches.map((branch, index) => (
          <div
            key={branch.id}
            className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 border border-transparent hover:border-accent/30 transition-all duration-300 group cursor-pointer"
            onClick={() => navigate(`/agency/${branch.id}`)}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex-1">
              <p className="font-medium text-foreground group-hover:text-accent transition-colors">
                {branch.name}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                <span className={getStatusColor(branch.status)}>
                  ● {branch.status}
                </span>
                {" • "}{branch.area}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-lg font-bold text-foreground">{branch.anp}</span>
              <CircleButton size="sm" onClick={(e) => e.stopPropagation()}>
                <ArrowRight className="w-4 h-4" />
              </CircleButton>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
