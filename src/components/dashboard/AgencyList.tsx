import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
        return "bg-success/10 text-success";
      case "注意":
        return "bg-warning/10 text-warning";
      case "要対応":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">代理店一覧</h3>
        </div>
      </div>
      
      <div className="space-y-2">
        {agencies.map((agency) => (
          <div
            key={agency.id}
            className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer"
            onClick={() => navigate(`/agency/${agency.id}`)}
          >
            <div className="flex-1">
              <h4 className="font-medium text-foreground">{agency.name}</h4>
              <p className="text-sm text-muted-foreground">{agency.branch}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{agency.anp}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(agency.status)}`}>
                  {agency.status}
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
