import { Department } from '@/types/department';

export const departments: Department[] = [
  {
    id: 'dept-01',
    code: 'SM',
    name: '首都圏統括部',
    type: 'sales',
    region: '首都圏',
    branchIds: [
      'br-022', 'br-023', 'br-024', 'br-025', 'br-026', // さいたま総合、熊谷、川越、埼玉東部、所沢
      'br-027', 'br-028', 'br-029', 'br-030', 'br-031', // 千葉総合、成田、船橋、柏常総、土浦
      'br-032', 'br-033', // 上野総合、池袋総合
      'br-034', 'br-035', 'br-036', 'br-037', 'br-038', 'br-039', // 渋谷総合、新宿総合、立川、八王子、都心総合、江東
      'br-040', 'br-041', 'br-042', 'br-043', 'br-044' // 横浜総合、神奈川東部、町田、厚木、湘南
    ]
  },
  {
    id: 'dept-02',
    code: 'EM',
    name: '東日本統括部',
    type: 'sales',
    region: '東日本',
    branchIds: [
      'br-001', 'br-002', 'br-003', 'br-004', 'br-005', 'br-006', // 帯広、旭川、札幌総合、道央、苫小牧、函館
      'br-007', 'br-008', 'br-009', 'br-010', 'br-011', 'br-012', // 青森、盛岡、仙台総合、秋田、山形、福島
      'br-013', 'br-014', 'br-015', 'br-016', 'br-017', 'br-018', // 水戸、栃木、群馬、太田、新潟、長岡
      'br-019', 'br-020', 'br-021' // 甲府、長野、松本
    ]
  },
  {
    id: 'dept-03',
    code: 'WM',
    name: '西日本統括部',
    type: 'sales',
    region: '西日本',
    branchIds: [
      'br-072', 'br-073', 'br-074', 'br-075', 'br-076', 'br-077', // 鳥取、島根、岡山、広島総合、福山、山口
      'br-078', 'br-079', 'br-080', 'br-081', // 東四国、徳島、松山、高知
      'br-082', 'br-083', 'br-084', 'br-085', 'br-086', 'br-087', // 北九州総合、北九州西、福岡総合、久留米、佐賀、長崎
      'br-088', 'br-089', 'br-090', 'br-091', 'br-092', 'br-093' // 佐世保、熊本、大分、宮崎、鹿児島、那覇
    ]
  },
  {
    id: 'dept-04',
    code: 'CM',
    name: '中部統括部',
    type: 'sales',
    region: '中部',
    branchIds: [
      'br-045', 'br-046', 'br-047', // 沼津、静岡、浜松
      'br-048', 'br-049', 'br-050', 'br-051', 'br-052', 'br-053', 'br-054', // 名古屋総合、名古屋西、中京総合、名古屋東、岡崎、豊橋、豊田
      'br-055', 'br-056', 'br-057' // 富山、金沢、福井
    ]
  },
  {
    id: 'dept-05',
    code: 'KM',
    name: '関西統括部',
    type: 'sales',
    region: '関西',
    branchIds: [
      'br-070', 'br-071', // 岐阜、三重
      'br-058', 'br-059', 'br-060', 'br-061', // 滋賀、京都総合、奈良、和歌山
      'br-062', 'br-063', // 神戸総合、姫路
      'br-064', 'br-065', 'br-066', 'br-067', 'br-068', 'br-069' // 堺、大阪東、大阪南、大阪北、茨木、布施
    ]
  }
];

export const getDepartmentById = (id: string): Department | undefined => {
  return departments.find(dept => dept.id === id);
};

export const getDepartmentByBranchId = (branchId: string): Department | undefined => {
  return departments.find(dept => dept.branchIds.includes(branchId));
};
