import { Department } from '@/types/department';

export const departments: Department[] = [
  {
    id: 'dept-01',
    code: 'HD',
    name: '北海道営業部',
    type: 'sales',
    region: '北海道',
    branchIds: ['br-001', 'br-002', 'br-003', 'br-004', 'br-005', 'br-006']
  },
  {
    id: 'dept-02',
    code: 'TH',
    name: '東北営業部',
    type: 'sales',
    region: '東北',
    branchIds: ['br-007', 'br-008', 'br-009', 'br-010', 'br-011', 'br-012']
  },
  {
    id: 'dept-03',
    code: 'KS',
    name: '関信越営業部',
    type: 'sales',
    region: '関信越',
    branchIds: ['br-013', 'br-014', 'br-015', 'br-016', 'br-017', 'br-018', 'br-019', 'br-020', 'br-021']
  },
  {
    id: 'dept-04',
    code: 'SK1',
    name: '首都圏第一営業部',
    type: 'sales',
    region: '首都圏',
    branchIds: ['br-022', 'br-023', 'br-024', 'br-025', 'br-026']
  },
  {
    id: 'dept-05',
    code: 'SK2',
    name: '首都圏第二営業部',
    type: 'sales',
    region: '首都圏',
    branchIds: ['br-027', 'br-028', 'br-029', 'br-030', 'br-031', 'br-032', 'br-033']
  },
  {
    id: 'dept-06',
    code: 'SK3',
    name: '首都圏第三営業部',
    type: 'sales',
    region: '首都圏',
    branchIds: ['br-034', 'br-035', 'br-036', 'br-037', 'br-038', 'br-039', 'br-040', 'br-041', 'br-042', 'br-043', 'br-044']
  },
  {
    id: 'dept-07',
    code: 'TK',
    name: '東海営業部',
    type: 'sales',
    region: '東海',
    branchIds: ['br-045', 'br-046', 'br-047', 'br-048', 'br-049', 'br-050', 'br-051', 'br-052', 'br-053', 'br-054']
  },
  {
    id: 'dept-08',
    code: 'HR',
    name: '北陸営業部',
    type: 'sales',
    region: '北陸',
    branchIds: ['br-055', 'br-056', 'br-057']
  },
  {
    id: 'dept-09',
    code: 'KN',
    name: '関西営業部',
    type: 'sales',
    region: '関西',
    branchIds: ['br-058', 'br-059', 'br-060', 'br-061', 'br-062', 'br-063', 'br-064', 'br-065', 'br-066', 'br-067', 'br-068', 'br-069', 'br-070', 'br-071']
  },
  {
    id: 'dept-10',
    code: 'CG',
    name: '中国営業部',
    type: 'sales',
    region: '中国',
    branchIds: ['br-072', 'br-073', 'br-074', 'br-075', 'br-076', 'br-077']
  },
  {
    id: 'dept-11',
    code: 'SK',
    name: '四国営業部',
    type: 'sales',
    region: '四国',
    branchIds: ['br-078', 'br-079', 'br-080', 'br-081']
  },
  {
    id: 'dept-12',
    code: 'KS',
    name: '九州営業部',
    type: 'sales',
    region: '九州',
    branchIds: ['br-082', 'br-083', 'br-084', 'br-085', 'br-086', 'br-087', 'br-088', 'br-089', 'br-090', 'br-091', 'br-092', 'br-093']
  },
  {
    id: 'dept-13',
    code: 'CH1',
    name: '法人営業部第一本部',
    type: 'corporate',
    branchIds: ['br-094', 'br-095', 'br-096']
  },
  {
    id: 'dept-14',
    code: 'CH2',
    name: '法人営業部第二本部',
    type: 'corporate',
    branchIds: ['br-097', 'br-098', 'br-099']
  },
  {
    id: 'dept-15',
    code: 'KH',
    name: '金融法人営業局',
    type: 'financial',
    branchIds: ['br-100', 'br-101']
  }
];

export const getDepartmentById = (id: string): Department | undefined => {
  return departments.find(dept => dept.id === id);
};

export const getDepartmentByBranchId = (branchId: string): Department | undefined => {
  return departments.find(dept => dept.branchIds.includes(branchId));
};
