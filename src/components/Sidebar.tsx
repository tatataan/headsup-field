import { LayoutDashboard, Building2, MessageSquarePlus, Smartphone } from "lucide-react";
import { NavLink } from "./NavLink";

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold text-sidebar-foreground">代理店支援システム</h1>
        <p className="text-sm text-sidebar-foreground/70 mt-1">Agency Support CRM</p>
      </div>
      
      <nav className="flex-1 px-3">
        <NavLink
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sidebar-foreground/80 hover:bg-sidebar-accent transition-colors"
          activeClassName="bg-sidebar-accent text-sidebar-foreground font-medium"
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>ダッシュボード</span>
        </NavLink>
        
        <NavLink
          to="/topics/new"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sidebar-foreground/80 hover:bg-sidebar-accent transition-colors"
          activeClassName="bg-sidebar-accent text-sidebar-foreground font-medium"
        >
          <MessageSquarePlus className="w-5 h-5" />
          <span>会話トピック投稿</span>
        </NavLink>
        
        <NavLink
          to="/mobile"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sidebar-foreground/80 hover:bg-sidebar-accent transition-colors"
          activeClassName="bg-sidebar-accent text-sidebar-foreground font-medium"
        >
          <Smartphone className="w-5 h-5" />
          <span>モバイルビュー</span>
        </NavLink>
      </nav>
      
      <div className="p-4 border-t border-sidebar-border">
        <div className="text-xs text-sidebar-foreground/60">
          ログイン中: 木村本部長
        </div>
      </div>
    </aside>
  );
};
