import { Assignment } from '@/types/lims';

// Định nghĩa một kiểu dữ liệu cho đối tượng assignment nhận về từ API
// để đảm bảo an toàn kiểu trong hàm mapper
type ApiAssignment = {
  id: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  tester: {
    id: number;
    name: string;
    email: string;
  };
  sample: {
    id: number;
    sampleName: string;
  };
  teamAssignment: {
    id: number;
    teamId: number;
  };
  results: Array<{
    id: number;
    status: string;
  }>;
};

// HÀM PLACEHOLDER: Lấy tên team từ teamId.
// Trong thực tế, bạn có thể cần gọi một API khác hoặc lấy từ một state quản lý team.
const getTeamNameById = (teamId: number): string => {
  const teamMap: Record<number, string> = {
    1: 'Battery Testing Team', // ID giả định
    2: 'IT Equipment Team',     // ID giả định
    // Thêm các team khác ở đây
  };
  return teamMap[teamId] || `Unknown Team (ID: ${teamId})`;
};

/**
 * Chuyển đổi một đối tượng assignment từ API sang định dạng Assignment của Frontend.
 * @param apiAssignment - Đối tượng dữ liệu từ API response.
 * @returns - Một đối tượng có cấu trúc tuân thủ interface Assignment.
 */
export const mapApiToAssignment = (apiAssignment: ApiAssignment): Assignment => {
  return {
    // === Các trường có thể map trực tiếp hoặc qua xử lý nhỏ ===
    id: apiAssignment.id.toString(),
    status: apiAssignment.status as 'Pending' | 'In Progress' | 'Done',
    testSample: apiAssignment.sample.sampleName,
    assignedTeam: getTeamNameById(apiAssignment.teamAssignment.teamId),
    assignedBy: apiAssignment.tester.name, // Map tên của tester vào assignedBy
    receivedTime: apiAssignment.createdAt,
    createdAt: apiAssignment.createdAt,
    updatedAt: apiAssignment.updatedAt,

    // === CÁC TRƯỜNG BỊ THIẾU TỪ API ===
    // Ghi chú: Các trường dưới đây không có trong API response bạn cung cấp.
    // Chúng cần được backend bổ sung để UI hiển thị đầy đủ và chính xác.
    // Hiện tại, chúng ta sẽ dùng các giá trị mặc định (placeholder).
    sampleCode: `SAMPLE-${apiAssignment.sample.id}`, // Dùng tạm sampleId
    sampleType: 'ITAV Desktop', // Giá trị tạm thời
    sampleSubType: undefined, // Giá trị tạm thời
    sampleQuantity: 1, // Giá trị tạm thời
    testingRequirements: ['QCVN-from-API'], // Giá trị tạm thời
    technicalDocumentation: [], // Giá trị tạm thời
  };
};