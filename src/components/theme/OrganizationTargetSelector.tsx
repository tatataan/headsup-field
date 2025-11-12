import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { departments } from "@/data/departments";
import { branches } from "@/data/branches";
import { useState, useEffect } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

interface OrganizationTargetSelectorProps {
  selectedTargets: {
    type: "all" | "departments" | "branches";
    departmentIds: string[];
    branchIds: string[];
  };
  onChange: (targets: {
    type: "all" | "departments" | "branches";
    departmentIds: string[];
    branchIds: string[];
  }) => void;
}

export const OrganizationTargetSelector = ({
  selectedTargets,
  onChange,
}: OrganizationTargetSelectorProps) => {
  const [isAllSelected, setIsAllSelected] = useState(
    selectedTargets.type === "all"
  );
  const [openDepts, setOpenDepts] = useState<Set<string>>(new Set());

  useEffect(() => {
    setIsAllSelected(selectedTargets.type === "all");
  }, [selectedTargets.type]);

  const handleAllChange = (checked: boolean) => {
    if (checked) {
      onChange({
        type: "all",
        departmentIds: [],
        branchIds: [],
      });
    } else {
      onChange({
        type: "departments",
        departmentIds: [],
        branchIds: [],
      });
    }
  };

  const handleDepartmentChange = (deptId: string, checked: boolean) => {
    const newDepartmentIds = checked
      ? [...selectedTargets.departmentIds, deptId]
      : selectedTargets.departmentIds.filter((id) => id !== deptId);

    // Remove all branches from this department if unchecking department
    const dept = departments.find((d) => d.id === deptId);
    const newBranchIds = checked
      ? selectedTargets.branchIds
      : selectedTargets.branchIds.filter(
          (bid) => !dept?.branchIds.includes(bid)
        );

    onChange({
      type: newDepartmentIds.length > 0 || newBranchIds.length > 0 ? "departments" : "all",
      departmentIds: newDepartmentIds,
      branchIds: newBranchIds,
    });
  };

  const handleBranchChange = (branchId: string, checked: boolean) => {
    const newBranchIds = checked
      ? [...selectedTargets.branchIds, branchId]
      : selectedTargets.branchIds.filter((id) => id !== branchId);

    onChange({
      type: selectedTargets.departmentIds.length > 0 || newBranchIds.length > 0 ? "branches" : "all",
      departmentIds: selectedTargets.departmentIds,
      branchIds: newBranchIds,
    });
  };

  const toggleDepartment = (deptId: string) => {
    setOpenDepts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(deptId)) {
        newSet.delete(deptId);
      } else {
        newSet.add(deptId);
      }
      return newSet;
    });
  };

  const getTotalAgencies = () => {
    if (selectedTargets.type === "all") {
      return branches.reduce((sum, b) => sum + b.agentCount, 0);
    }

    let total = 0;
    
    // Add agencies from selected departments
    selectedTargets.departmentIds.forEach((deptId) => {
      const dept = departments.find((d) => d.id === deptId);
      dept?.branchIds.forEach((branchId) => {
        const branch = branches.find((b) => b.id === branchId);
        if (branch) total += branch.agentCount;
      });
    });

    // Add agencies from individually selected branches (not in selected departments)
    selectedTargets.branchIds.forEach((branchId) => {
      const branch = branches.find((b) => b.id === branchId);
      const isInSelectedDept = selectedTargets.departmentIds.some((deptId) => {
        const dept = departments.find((d) => d.id === deptId);
        return dept?.branchIds.includes(branchId);
      });
      if (branch && !isInSelectedDept) {
        total += branch.agentCount;
      }
    });

    return total;
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium mb-3 block">組織別ターゲティング</Label>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="target-all"
              checked={isAllSelected}
              onCheckedChange={handleAllChange}
            />
            <label htmlFor="target-all" className="text-sm font-medium">
              全社
            </label>
          </div>

          {!isAllSelected && (
            <div className="ml-6 space-y-2">
              {departments.map((dept) => {
                const isDeptSelected = selectedTargets.departmentIds.includes(dept.id);
                const deptBranches = branches.filter((b) =>
                  dept.branchIds.includes(b.id)
                );

                return (
                  <Collapsible
                    key={dept.id}
                    open={openDepts.has(dept.id)}
                    onOpenChange={() => toggleDepartment(dept.id)}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`dept-${dept.id}`}
                          checked={isDeptSelected}
                          onCheckedChange={(checked) =>
                            handleDepartmentChange(dept.id, checked as boolean)
                          }
                        />
                        <CollapsibleTrigger className="flex-1 flex items-center justify-between text-sm hover:text-foreground">
                          <label htmlFor={`dept-${dept.id}`} className="font-medium cursor-pointer">
                            {dept.name}
                          </label>
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                              openDepts.has(dept.id) ? "rotate-180" : ""
                            }`}
                          />
                        </CollapsibleTrigger>
                      </div>

                      <CollapsibleContent className="ml-6 space-y-2">
                        {deptBranches.map((branch) => {
                          const isBranchSelected = selectedTargets.branchIds.includes(branch.id);
                          
                          return (
                            <div key={branch.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`branch-${branch.id}`}
                                checked={isDeptSelected || isBranchSelected}
                                disabled={isDeptSelected}
                                onCheckedChange={(checked) =>
                                  handleBranchChange(branch.id, checked as boolean)
                                }
                              />
                              <label
                                htmlFor={`branch-${branch.id}`}
                                className="text-sm cursor-pointer"
                              >
                                {branch.name}
                              </label>
                            </div>
                          );
                        })}
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 border-t">
        <div className="p-3 bg-accent rounded-lg">
          <p className="text-sm text-accent-foreground">
            配信予定: <strong>{getTotalAgencies()}代理店</strong>の担当者
          </p>
        </div>
      </div>
    </div>
  );
};
