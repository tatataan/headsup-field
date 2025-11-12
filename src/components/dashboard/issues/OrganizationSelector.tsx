import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { departments } from "@/data/departments";
import { branches } from "@/data/branches";
import { Building2, Building, Globe } from "lucide-react";

export type ViewMode = 'company' | 'department' | 'branch';

interface OrganizationSelectorProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  selectedDepartmentId: string | null;
  onDepartmentChange: (id: string | null) => void;
  selectedBranchId: string | null;
  onBranchChange: (id: string | null) => void;
}

export const OrganizationSelector = ({
  viewMode,
  onViewModeChange,
  selectedDepartmentId,
  onDepartmentChange,
  selectedBranchId,
  onBranchChange,
}: OrganizationSelectorProps) => {
  const availableBranches = selectedDepartmentId
    ? branches.filter(b => 
        departments.find(d => d.id === selectedDepartmentId)?.branchIds.includes(b.id)
      )
    : branches;

  const handleDepartmentChange = (value: string) => {
    const newValue = value === 'all' ? null : value;
    onDepartmentChange(newValue);
    // Reset branch when department changes
    if (selectedBranchId) {
      onBranchChange(null);
    }
  };

  const handleBranchChange = (value: string) => {
    onBranchChange(value === 'all' ? null : value);
  };

  return (
    <Card className="p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <span className="text-sm font-medium text-muted-foreground">表示範囲:</span>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'company' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                onViewModeChange('company');
                onDepartmentChange(null);
                onBranchChange(null);
              }}
              className="gap-2"
            >
              <Globe className="h-4 w-4" />
              全社
            </Button>
            <Button
              variant={viewMode === 'department' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onViewModeChange('department')}
              className="gap-2"
            >
              <Building2 className="h-4 w-4" />
              統括部別
            </Button>
            <Button
              variant={viewMode === 'branch' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onViewModeChange('branch')}
              className="gap-2"
            >
              <Building className="h-4 w-4" />
              支社別
            </Button>
          </div>
        </div>

        {viewMode !== 'company' && (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            {viewMode === 'department' && (
              <Select
                value={selectedDepartmentId || 'all'}
                onValueChange={handleDepartmentChange}
              >
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="統括部を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全統括部</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {viewMode === 'branch' && (
              <>
                <Select
                  value={selectedDepartmentId || 'all'}
                  onValueChange={handleDepartmentChange}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="統括部" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全統括部</SelectItem>
                    {departments.map(dept => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedBranchId || 'all'}
                  onValueChange={handleBranchChange}
                >
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="支社を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全支社</SelectItem>
                    {availableBranches.map(branch => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
