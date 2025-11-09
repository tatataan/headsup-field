import { LayoutDashboard, MessageSquarePlus, Smartphone, Sparkles } from "lucide-react";
import { NavLink } from "./NavLink";

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-accent-foreground" />
          </div>
          <h1 className="text-xl font-bold text-sidebar-foreground">代理店支援</h1>
        </div>
        <p className="text-xs text-muted-foreground mt-1 ml-10">Agency Support CRM</p>
      </div>
      
      <nav className="flex-1 px-3 py-4">
        <NavLink
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl mb-2 text-sidebar-foreground/70 hover:bg-sidebar-accent transition-all duration-200 group"
          activeClassName="bg-sidebar-accent text-sidebar-foreground font-medium border border-accent/30"
        >
          <LayoutDashboard className="w-5 h-5 group-hover:text-accent transition-colors" />
          <span>ダッシュボード</span>
        </NavLink>
        
        <NavLink
          to="/topics/new"
          className="flex items-center gap-3 px-4 py-3 rounded-xl mb-2 text-sidebar-foreground/70 hover:bg-sidebar-accent transition-all duration-200 group"
          activeClassName="bg-sidebar-accent text-sidebar-foreground font-medium border border-accent/30"
        >
          <MessageSquarePlus className="w-5 h-5 group-hover:text-accent transition-colors" />
          <span>会話トピック投稿</span>
        </NavLink>
        
        <NavLink
          to="/mobile"
          className="flex items-center gap-3 px-4 py-3 rounded-xl mb-2 text-sidebar-foreground/70 hover:bg-sidebar-accent transition-all duration-200 group"
          activeClassName="bg-sidebar-accent text-sidebar-foreground font-medium border border-accent/30"
        >
          <Smartphone className="w-5 h-5 group-hover:text-accent transition-colors" />
          <span>モバイルビュー</span>
        </NavLink>
      </nav>
      
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-accent to-chart-2 rounded-full flex items-center justify-center text-xs font-bold text-accent-foreground">
            木
          </div>
          <div>
            <div className="text-xs font-medium text-sidebar-foreground">木村本部長</div>
            <div className="text-[10px] text-muted-foreground">本部管理者</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
