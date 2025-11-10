import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

interface KPIDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  currentValue: string;
  monthlyData: { month: string; value: number }[];
}

export const KPIDetailModal = ({
  open,
  onOpenChange,
  title,
  currentValue,
  monthlyData,
}: KPIDetailModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] glass-effect">
        <DialogHeader>
          <DialogTitle className="text-2xl gradient-text">{title}</DialogTitle>
          <DialogDescription>
            現在の値: <span className="text-2xl font-bold text-foreground">{currentValue}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">月次推移</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                  color: 'hsl(var(--popover-foreground))'
                }}
                labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(var(--chart-2))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--chart-2))', r: 5 }}
                activeDot={{ r: 7, fill: 'hsl(var(--chart-2))', stroke: 'hsl(var(--background))', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </DialogContent>
    </Dialog>
  );
};