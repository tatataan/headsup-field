import { HearingHistory } from "@/hooks/useHearingHistory";
import { departments } from "@/data/departments";
import { branches } from "@/data/branches";

const majorThemes = [
  { major: "事業承継", weight: 0.25 },
  { major: "人材育成", weight: 0.35 },
  { major: "業務効率化", weight: 0.15 },
  { major: "販売力強化", weight: 0.12 },
  { major: "リスク管理", weight: 0.08 },
  { major: "コンプライアンス", weight: 0.05 },
];

const themeDetails: Record<string, { middle: string[], detail: string[], content: string[] }> = {
  "事業承継": {
    middle: ["後継者育成", "株式承継", "組織体制"],
    detail: ["後継者候補の選定", "経営権の移譲", "相続税対策", "組織図の見直し"],
    content: [
      "後継者候補として長男を検討中。経営理念の共有が課題。",
      "株式の承継方法について相談。相続税の試算が必要。",
      "事業承継計画の策定を開始。3年後の代替わりを目標。",
    ],
  },
  "人材育成": {
    middle: ["研修制度", "評価制度", "採用強化"],
    detail: ["新人研修プログラム", "管理職育成", "中途採用の強化", "人事評価の見直し"],
    content: [
      "新入社員の研修体系を見直し。OJTとOFF-JTのバランスが重要。",
      "管理職候補の育成プログラムを検討。外部研修の活用を提案。",
      "中途採用の強化について。即戦力人材の獲得が急務。",
    ],
  },
  "業務効率化": {
    middle: ["DX推進", "業務プロセス改善", "システム導入"],
    detail: ["ペーパーレス化", "RPA導入", "クラウド化", "業務フロー見直し"],
    content: [
      "契約書類のペーパーレス化を推進。電子署名の導入を検討。",
      "定型業務のRPA化について。費用対効果の検証が必要。",
      "業務フローの見直しを実施。ボトルネックの解消を優先。",
    ],
  },
  "販売力強化": {
    middle: ["営業力向上", "商品開発", "マーケティング"],
    detail: ["営業スキル研修", "新商品企画", "SNS活用", "顧客管理強化"],
    content: [
      "営業担当者のスキルアップ研修を実施。ロープレ中心の内容。",
      "新商品の開発について。市場ニーズの分析が必要。",
      "SNSマーケティングの強化。若年層へのアプローチを検討。",
    ],
  },
  "リスク管理": {
    middle: ["コンプライアンス", "情報セキュリティ", "BCP"],
    detail: ["個人情報保護", "サイバーセキュリティ", "災害対策"],
    content: [
      "個人情報保護体制の強化。社内教育を徹底する。",
      "サイバー攻撃への対策。セキュリティソフトの導入を検討。",
      "BCP（事業継続計画）の策定。災害時の対応手順を明確化。",
    ],
  },
  "コンプライアンス": {
    middle: ["法令遵守", "内部統制", "監査対応"],
    detail: ["法令改正対応", "内部監査体制", "外部監査対応"],
    content: [
      "保険業法の改正に伴う対応。社内規程の見直しが必要。",
      "内部監査体制の強化。チェックリストの整備を実施。",
      "外部監査への対応。指摘事項の改善計画を策定。",
    ],
  },
};

const staffNames = [
  "田中一郎", "佐藤花子", "鈴木太郎", "高橋美咲", "渡辺健太",
  "伊藤真理子", "山本大輔", "中村由美", "小林隆史", "加藤さくら",
];

// Mock agency branches mapping using real department and branch IDs
export const generateMockAgencyBranches = () => {
  const agencies: { agency_id: string; branch_id: string; department_id: string }[] = [];
  let agencyCounter = 1;
  
  // Distribute agencies across departments proportionally
  // dept-01: 首都圏統括部 (23 branches) - 18 agencies
  // dept-02: 東日本統括部 (21 branches) - 14 agencies
  // dept-03: 西日本統括部 (22 branches) - 18 agencies
  // dept-04: 中部統括部 (13 branches) - 9 agencies
  // dept-05: 関西統括部 (14 branches) - 11 agencies
  
  const departmentDistribution = [
    { deptId: "dept-01", count: 18 },
    { deptId: "dept-02", count: 14 },
    { deptId: "dept-03", count: 18 },
    { deptId: "dept-04", count: 9 },
    { deptId: "dept-05", count: 11 },
  ];
  
  departmentDistribution.forEach(({ deptId, count }) => {
    const dept = departments.find(d => d.id === deptId);
    if (!dept) return;
    
    const deptBranches = branches.filter(b => dept.branchIds.includes(b.id));
    
    for (let i = 0; i < count; i++) {
      const branch = deptBranches[i % deptBranches.length];
      agencies.push({
        agency_id: `A${String(agencyCounter).padStart(3, '0')}`,
        branch_id: branch.id,
        department_id: dept.id,
      });
      agencyCounter++;
    }
  });

  return agencies.map((a, idx) => ({
    id: `ab-${idx + 1}`,
    ...a,
    created_at: new Date(2024, 0, 1).toISOString(),
    updated_at: new Date(2024, 0, 1).toISOString(),
  }));
};

// Generate mock hearing history
export const generateMockHearingHistory = (): HearingHistory[] => {
  const records: HearingHistory[] = [];
  const agencyBranches = generateMockAgencyBranches();
  const today = new Date();
  
  // Generate 45 records over the past 6 months
  for (let i = 0; i < 45; i++) {
    // Select theme based on weights
    let random = Math.random();
    let selectedTheme = majorThemes[0];
    
    for (const theme of majorThemes) {
      if (random < theme.weight) {
        selectedTheme = theme;
        break;
      }
      random -= theme.weight;
    }

    const themeDetail = themeDetails[selectedTheme.major];
    const middleTheme = themeDetail.middle[Math.floor(Math.random() * themeDetail.middle.length)];
    const detailTheme = themeDetail.detail[Math.floor(Math.random() * themeDetail.detail.length)];
    const content = themeDetail.content[Math.floor(Math.random() * themeDetail.content.length)];
    const staffName = staffNames[Math.floor(Math.random() * staffNames.length)];
    
    // Random date within last 6 months
    const daysAgo = Math.floor(Math.random() * 180);
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    
    // Random agency
    const agency = agencyBranches[Math.floor(Math.random() * agencyBranches.length)];
    
    records.push({
      id: `hearing-${i + 1}`,
      agency_id: agency.agency_id,
      major_theme: selectedTheme.major,
      middle_theme: middleTheme,
      detail_theme: detailTheme,
      content: content,
      staff_name: staffName,
      date: date.toISOString().split('T')[0],
      branch_id: agency.branch_id,
      department_id: agency.department_id,
      created_at: date.toISOString(),
      updated_at: date.toISOString(),
    });
  }
  
  // Sort by date descending
  return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Mock theme distributions using real department and branch IDs
export const generateMockThemeDistributions = () => {
  return [
    {
      id: "dist-1",
      title: "事業承継に関する取り組み状況調査",
      content: "事業承継計画の策定状況と後継者育成の進捗について確認させてください。",
      major_theme: "事業承継",
      middle_theme: "後継者育成",
      detail_theme: "後継者候補の選定",
      target_type: "department",
      target_ids: ["dept-01", "dept-02", "dept-03"],
      distribution_start_date: "2024-11-01",
      distribution_end_date: "2024-11-30",
      is_required: true,
      created_at: "2024-11-01T00:00:00Z",
      updated_at: "2024-11-01T00:00:00Z",
      created_by: null,
    },
    {
      id: "dist-2",
      title: "人材育成研修の実施状況",
      content: "新入社員研修および管理職研修の実施状況についてご報告ください。",
      major_theme: "人材育成",
      middle_theme: "研修制度",
      detail_theme: "新人研修プログラム",
      target_type: "branch",
      target_ids: ["br-022", "br-048", "br-072"],
      distribution_start_date: "2024-10-15",
      distribution_end_date: "2024-11-15",
      is_required: false,
      created_at: "2024-10-15T00:00:00Z",
      updated_at: "2024-10-15T00:00:00Z",
      created_by: null,
    },
  ];
};

// Mock theme responses using real agency, branch, and department IDs
export const generateMockThemeResponses = () => {
  const agencyBranches = generateMockAgencyBranches();
  
  return [
    {
      id: "resp-1",
      distribution_id: "dist-1",
      agency_id: agencyBranches[0].agency_id,
      branch_id: agencyBranches[0].branch_id,
      department_id: agencyBranches[0].department_id,
      response_note: "事業承継計画を策定中。後継者候補として長男を選定済み。",
      responded_at: "2024-11-10T10:00:00Z",
      created_at: "2024-11-10T10:00:00Z",
    },
    {
      id: "resp-2",
      distribution_id: "dist-1",
      agency_id: agencyBranches[18].agency_id,
      branch_id: agencyBranches[18].branch_id,
      department_id: agencyBranches[18].department_id,
      response_note: "後継者育成プログラムを開始。3年計画で進行中。",
      responded_at: "2024-11-12T14:30:00Z",
      created_at: "2024-11-12T14:30:00Z",
    },
    {
      id: "resp-3",
      distribution_id: "dist-2",
      agency_id: agencyBranches[1].agency_id,
      branch_id: agencyBranches[1].branch_id,
      department_id: agencyBranches[1].department_id,
      response_note: "新入社員研修を4月に実施。管理職研修は9月予定。",
      responded_at: "2024-10-20T09:00:00Z",
      created_at: "2024-10-20T09:00:00Z",
    },
  ];
};
