import { Assignment } from "@/types/lims";

// Định nghĩa kiểu dữ liệu cho API response theo schema thực tế
type ApiAssignmentResponse = {
  id: number;
  teamAssignmentId: number;
  sampleId: number;
  testerId: number;
  status: string;
  assignedAt: string;
  startedAt: string | null;
  completedAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  teamAssignment: {
    id: number;
    createdAt: string;
    updatedAt: string;
    assignedByName: string;
  };
  sample: {
    id: number;
    orderId: number;
    customerId: number;
    productTypeId: number;
    sampleName: string;
    barcode: string;
    sampleCode: string | null;
    sampleType: string;
    quantity: number;
    modelName: string;
    testStandards: string;
    technicalDocs: string | null;
    receivedAt: string;
    createdAt: string;
    updatedAt: string;
  };
};

// Map status từ API sang Frontend
const mapStatusFromApi = (apiStatus: string): Assignment["status"] => {
  switch (apiStatus) {
    case "ASSIGNED":
      return "Pending";
    case "IN_PROGRESS":
      return "In Progress";
    case "COMPLETED":
      return "Done";
    default:
      return "Pending";
  }
};

// Map sample type từ API sang Frontend
const mapSampleTypeFromApi = (
  sampleType: string,
  sampleName: string
): Assignment["sampleType"] => {
  // Ưu tiên sampleType từ API trước
  if (sampleType.toLowerCase().includes("lithium")) {
    return "Lithium Battery";
  }

  // Fallback dựa trên sampleName
  const name = sampleName.toLowerCase();
  if (
    name.includes("pin") ||
    name.includes("battery") ||
    name.includes("lithium")
  ) {
    return "Lithium Battery";
  } else if (name.includes("adapter")) {
    return "ITAV Adapter";
  } else if (name.includes("desktop")) {
    return "ITAV Desktop";
  } else if (name.includes("laptop") || name.includes("tablet")) {
    return "ITAV Laptop+Tablet";
  } else if (name.includes("tv")) {
    return "ITAV TV";
  } else {
    return "Lithium Battery"; // Default fallback
  }
};

// Parse testing requirements từ testStandards
const parseTestingRequirements = (testStandards: string): string[] => {
  if (!testStandards) return ["General Testing Standards"];

  // Split by common delimiters
  const requirements = testStandards
    .split(/[,+&;]/)
    .map((req) => req.trim())
    .filter((req) => req);

  return requirements.length > 0 ? requirements : ["General Testing Standards"];
};

// Map sample sub-type cho battery
const mapSampleSubType = (
  sampleType: string,
  sampleName: string
): Assignment["sampleSubType"] => {
  if (
    sampleType.toLowerCase().includes("lithium") ||
    sampleName.toLowerCase().includes("pin")
  ) {
    const name = sampleName.toLowerCase();

    // Kiểm tra cả cell và pack trước
    if (name.includes("cell") && name.includes("pack")) {
      return "Cell+Pack";
    } else if (name.includes("pack")) {
      return "Pack";
    } else if (name.includes("cell")) {
      return "Cell";
    }

    // Default cho battery
    return "Cell";
  }
  return undefined;
};

// HÀM PLACEHOLDER: Lấy tên team từ teamId
const getTeamNameById = (teamId: number): string => {
  const teamMap: Record<number, string> = {
    1: "101",
    2: "102",
    3: "103",
    // Thêm các team khác ở đây
  };
  return teamMap[teamId] || teamId.toString();
};

/**
 * Chuyển đổi một đối tượng assignment từ API sang định dạng Assignment của Frontend.
 * @param apiAssignment - Đối tượng dữ liệu từ API response.
 * @returns - Một đối tượng có cấu trúc tuân thủ interface Assignment.
 */
export const mapApiToAssignment = (
  apiAssignment: ApiAssignmentResponse
): Assignment => {
  const testingRequirements = parseTestingRequirements(
    apiAssignment.sample.testStandards
  );

  return {
    // === Mapping từ API response ===
    id: apiAssignment.id.toString(),
    status: mapStatusFromApi(apiAssignment.status),
    sampleCode:
      apiAssignment.sample.barcode ||
      `SAMPLE-${apiAssignment.sample.id.toString().padStart(3, "0")}`,
    sampleType: mapSampleTypeFromApi(
      apiAssignment.sample.sampleType,
      apiAssignment.sample.sampleName
    ),
    sampleSubType: mapSampleSubType(
      apiAssignment.sample.sampleType,
      apiAssignment.sample.sampleName
    ),
    sampleQuantity: apiAssignment.sample.quantity,
    testingRequirements: testingRequirements,
    testSample:
      apiAssignment.sample.modelName || apiAssignment.sample.sampleName,
    receivedTime: apiAssignment.sample.receivedAt,
    assignedTeam: getTeamNameById(apiAssignment.teamAssignmentId), // Cần điều chỉnh logic này
    assignedBy: apiAssignment.teamAssignment.assignedByName,
    createdAt: apiAssignment.createdAt,
    updatedAt: apiAssignment.updatedAt,

    // === Các trường không có trong API, sử dụng placeholder ===
    technicalDocumentation: [], // Có thể thêm sau nếu cần
  };
};
