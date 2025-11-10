import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { ProductMixData } from "@/types/branch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useState } from "react";
import { ProductTrendModal } from "./ProductTrendModal";

interface ProductMixAnalysisProps {
  products: ProductMixData[];
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export const ProductMixAnalysis = ({ products }: ProductMixAnalysisProps) => {
  const [selectedProduct, setSelectedProduct] = useState<ProductMixData | null>(null);

  const totalANP = products.reduce((sum, p) => sum + p.anp, 0);
  const chartData = products.map((p) => ({
    name: p.productName,
    value: p.anp,
    percentage: ((p.anp / totalANP) * 100).toFixed(1),
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">商品カテゴリ別ANP構成</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percentage }) => `${name} ${percentage}%`}
              outerRadius={100}
              fill="hsl(var(--primary))"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [`¥${value}M`, "ANP"]}
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
                color: "hsl(var(--popover-foreground))",
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">商品別詳細</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>商品名</TableHead>
              <TableHead className="text-right">ANP</TableHead>
              <TableHead className="text-right">構成比</TableHead>
              <TableHead className="text-right">契約件数</TableHead>
              <TableHead className="text-right">平均契約額</TableHead>
              <TableHead className="text-right">前月比</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const change = ((product.anp - product.previousMonthAnp) / product.previousMonthAnp) * 100;
              const isPositive = change > 0;
              const percentage = ((product.anp / totalANP) * 100).toFixed(1);

              return (
                <TableRow
                  key={product.productName}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedProduct(product)}
                >
                  <TableCell className="font-medium">{product.productName}</TableCell>
                  <TableCell className="text-right">¥{product.anp}M</TableCell>
                  <TableCell className="text-right">{percentage}%</TableCell>
                  <TableCell className="text-right">{product.contractCount.toLocaleString()}件</TableCell>
                  <TableCell className="text-right">¥{product.avgContractValue}M</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {isPositive ? (
                        <TrendingUp className="h-3 w-3 text-success" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-destructive" />
                      )}
                      <span className={isPositive ? "text-success" : "text-destructive"}>
                        {isPositive ? "+" : ""}
                        {change.toFixed(1)}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {selectedProduct && (
        <ProductTrendModal
          open={!!selectedProduct}
          onOpenChange={(open) => !open && setSelectedProduct(null)}
          product={selectedProduct}
        />
      )}
    </div>
  );
};
