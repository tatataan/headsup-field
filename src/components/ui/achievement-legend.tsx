export const AchievementLegend = () => {
  return (
    <div className="flex items-center gap-4 text-xs text-muted-foreground">
      <div className="flex items-center gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-success"></div>
        <span>目標達成（100%以上）</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-warning"></div>
        <span>ほぼ達成（90-99%）</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-destructive"></div>
        <span>未達成（90%未満）</span>
      </div>
    </div>
  );
};
