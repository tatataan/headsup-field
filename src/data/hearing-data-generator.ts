import { HearingHistory } from "@/hooks/useHearingHistory";
import { departments } from "@/data/departments";
import { branches } from "@/data/branches";

const majorThemes = [
  { major: "人材・育成", weight: 0.30 },
  { major: "販売・市場", weight: 0.25 },
  { major: "経営・戦略", weight: 0.20 },
  { major: "品質・事務", weight: 0.15 },
  { major: "関係性・要望", weight: 0.07 },
  { major: "アイスブレイク", weight: 0.03 },
];

const themeDetails: Record<string, { middle: string[], detail: string[], content: string[] }> = {
  "アイスブレイク": {
    middle: ["パーソナルな関心・価値観", "経営者・組織内話題"],
    detail: ["代理店の将来像", "経営者近況"],
    content: [
      "代理店の将来像について意見交換。5年後のビジョンを共有。",
      "経営者の近況をヒアリング。家族構成や趣味の話題で関係構築。",
    ],
  },
  "人材・育成": {
    middle: ["採用・定着", "研修・スキル"],
    detail: ["新人採用", "採用パイプライン", "定着状況", "モチベーション・評価制度", "研修ニーズ", "スキルレベル"],
    content: [
      "新入社員の採用計画について。今年度は5名の採用を予定。",
      "社員の定着率向上について。離職率が高く対策が必要。",
      "営業スキル研修の実施を検討。外部講師の活用を提案。",
      "採用パイプラインの構築について。リファラル採用を強化。",
      "社員のモチベーション向上策を検討。評価制度の見直しが必要。",
    ],
  },
  "品質・事務": {
    middle: ["事務・IT効率", "募集品質管理"],
    detail: ["事務負荷", "デジタル化", "リスク傾向", "監査・指導"],
    content: [
      "事務作業の負荷軽減について。業務プロセスの見直しが必要。",
      "ペーパーレス化の推進状況を確認。電子化率は現在60%。",
      "募集品質の管理体制について。監査結果を踏まえた改善策を検討。",
      "デジタル化の推進状況をヒアリング。システム刷新を計画中。",
    ],
  },
  "経営・戦略": {
    middle: ["中期経営計画", "収益性・財務", "提携・協業"],
    detail: ["目標数値", "組織戦略", "コスト構造", "収益源の分散", "紹介チャネル"],
    content: [
      "中期経営計画の策定について。3年後の目標数値を設定。",
      "収益性の改善が課題。コスト構造の見直しを実施。",
      "提携先との協業強化について。新規チャネルの開拓を検討。",
      "組織戦略の見直しを実施。営業体制の再構築が必要。",
      "収益源の分散について。新規事業への参入を検討中。",
    ],
  },
  "販売・市場": {
    middle: ["マーケット戦略", "販売実績分析", "顧客管理"],
    detail: ["ターゲット設定", "新商品推進", "量的実績", "質的実績", "見込み客管理", "クロスセル機会"],
    content: [
      "ターゲット顧客の設定について。富裕層向け商品に注力。",
      "新商品の推進状況を確認。医療保険の販売が好調。",
      "顧客データベースの整備について。CRMシステムの導入を検討。",
      "販売実績の分析結果を共有。量的実績は目標達成見込み。",
      "見込み客管理の強化について。リードナーチャリングの実施を提案。",
      "クロスセル機会の創出について。既存顧客へのアプローチ強化。",
    ],
  },
  "関係性・要望": {
    middle: ["人的要因", "本部への評価"],
    detail: ["経営者の姿勢", "支援満足度", "改善提案"],
    content: [
      "経営者の経営姿勢について。積極的な姿勢が見られる。",
      "本部支援の満足度を確認。研修内容の充実を要望。",
      "業務改善の提案をヒアリング。システム改善の要望あり。",
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
      title: "採用・定着に関する取り組み状況調査",
      content: "新入社員の採用計画と定着状況について確認させてください。",
      major_theme: "人材・育成",
      middle_theme: "採用・定着",
      detail_theme: "新人採用",
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
      title: "販売実績の分析と改善施策",
      content: "販売実績の分析結果と今後の改善施策についてご報告ください。",
      major_theme: "販売・市場",
      middle_theme: "販売実績分析",
      detail_theme: "量的実績",
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
      response_note: "新入社員の採用計画を策定中。今年度は5名の採用を予定。",
      responded_at: "2024-11-10T10:00:00Z",
      created_at: "2024-11-10T10:00:00Z",
    },
    {
      id: "resp-2",
      distribution_id: "dist-1",
      agency_id: agencyBranches[18].agency_id,
      branch_id: agencyBranches[18].branch_id,
      department_id: agencyBranches[18].department_id,
      response_note: "社員の定着率向上に向けた施策を実施中。3年計画で進行。",
      responded_at: "2024-11-12T14:30:00Z",
      created_at: "2024-11-12T14:30:00Z",
    },
    {
      id: "resp-3",
      distribution_id: "dist-2",
      agency_id: agencyBranches[1].agency_id,
      branch_id: agencyBranches[1].branch_id,
      department_id: agencyBranches[1].department_id,
      response_note: "販売実績の分析を実施。量的実績は目標達成見込み。",
      responded_at: "2024-10-20T09:00:00Z",
      created_at: "2024-10-20T09:00:00Z",
    },
  ];
};
