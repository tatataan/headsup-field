import { Card } from "@/components/ui/card";
import { Building2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CircleButton } from "@/components/ui/circle-button";

interface Agency {
  id: string;
  name: string;
  branch: string;
  status: string;
  anp: string;
}

export const AgencyList = () => {
  const navigate = useNavigate();
  
  const agencies: Agency[] = [
    { id: "1", name: "東京中央代理店", branch: "東京支社", status: "良好", anp: "¥125.5M" },
    { id: "2", name: "横浜西代理店", branch: "東京支社", status: "注意", anp: "¥89.2M" },
    { id: "3", name: "大阪北代理店", branch: "大阪支社", status: "良好", anp: "¥142.8M" },
    { id: "4", name: "名古屋東代理店", branch: "名古屋支社", status: "要対応", anp: "¥67.3M" },
    { id: "5", name: "福岡南代理店", branch: "福岡支社", status: "良好", anp: "¥98.7M" },
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
          <h3 className="text-lg font-semibold text-foreground">代理店一覧</h3>
        </div>
        <span className="text-sm text-muted-foreground px-3 py-1 bg-muted/50 rounded-full">
          {agencies.length}店舗
        </span>
      </div>
      
      <div className="space-y-2">
        {agencies.map((agency, index) => (
          <div
            key={agency.id}
            className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 border border-transparent hover:border-accent/30 transition-all duration-300 group cursor-pointer"
            onClick={() => navigate(`/agency/${agency.id}`)}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex-1">
              <p className="font-medium text-foreground group-hover:text-accent transition-colors">
                {agency.name}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                <span className={getStatusColor(agency.status)}>
                  ● {agency.status}
                </span>
                {" • "}{agency.branch}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-lg font-bold text-foreground">{agency.anp}</span>
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
