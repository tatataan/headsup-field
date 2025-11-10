import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BranchDetailData } from "@/types/branch";
import { BranchKPICards } from "./BranchKPICards";
import { AgentRankingTable } from "./AgentRankingTable";
import { ProductMixAnalysis } from "./ProductMixAnalysis";
import { ContractBreakdownAnalysis } from "./ContractBreakdownAnalysis";
import { CustomerSegmentAnalysis } from "./CustomerSegmentAnalysis";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BranchDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: BranchDetailData;
}

export const BranchDetailModal = ({ open, onOpenChange, data }: BranchDetailModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">{data.branchName} - 詳細分析</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[calc(90vh-100px)] pr-4">
          <div className="space-y-6">
            {/* KPIカード */}
            <BranchKPICards kpi={data.kpi} monthlyData={data.monthlyData} />

            {/* ドリルダウンセクション */}
            <Accordion type="multiple" className="w-full" defaultValue={["agents"]}>
              {/* エージェント別実績ランキング */}
              <AccordionItem value="agents">
                <AccordionTrigger className="text-lg font-semibold">
                  エージェント別実績ランキング
                </AccordionTrigger>
                <AccordionContent>
                  <AgentRankingTable agents={data.agents} />
                </AccordionContent>
              </AccordionItem>

              {/* 商品別構成分析 */}
              <AccordionItem value="products">
                <AccordionTrigger className="text-lg font-semibold">
                  商品別構成分析
                </AccordionTrigger>
                <AccordionContent>
                  <ProductMixAnalysis products={data.productMix} />
                </AccordionContent>
              </AccordionItem>

              {/* 新規・解約・継続の内訳 */}
              <AccordionItem value="breakdown">
                <AccordionTrigger className="text-lg font-semibold">
                  新規・解約・継続の内訳
                </AccordionTrigger>
                <AccordionContent>
                  <ContractBreakdownAnalysis breakdown={data.contractBreakdown} />
                </AccordionContent>
              </AccordionItem>

              {/* 顧客セグメント別分析 */}
              <AccordionItem value="segments">
                <AccordionTrigger className="text-lg font-semibold">
                  顧客セグメント別分析
                </AccordionTrigger>
                <AccordionContent>
                  <CustomerSegmentAnalysis segments={data.customerSegments} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
