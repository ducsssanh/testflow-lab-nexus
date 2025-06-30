// Type definitions for the LIMS system
export interface User {
  id: string;
  username: string;
  fullName: string;
  role: 'reception' | 'tester' | 'manager';
  email: string;
  isActive: boolean;
  teams?: string[]; // Teams the user belongs to
}

export interface Assignment {
  id: string;
  sampleCode: string; // Unique identifier for test sample
  sampleType: 'Lithium Battery' | 'ITAV Adapter' | 'ITAV Desktop' | 'ITAV Laptop+Tablet' | 'ITAV TV';
  sampleSubType?: 'Cell' | 'Pack' | 'Cell+Pack'; // For batteries
  sampleQuantity: number;
  testingRequirements: string[]; // e.g., ['QCVN101:2020+IEC', 'QCVN101:2020']
  receivedTime: string;
  technicalDocumentation?: TechnicalDocument[];
  status: 'Pending' | 'In Progress' | 'Done';
  assignedTeam: string;
  assignedBy: string; // Lab Manager ID
  testSample: string; // Model name
  createdAt: string;
  updatedAt: string;
}

export interface TestingCriterion {
  id: string;
  name: string;
  sectionNumber: string; // e.g., "2.6.1.1/7.2.1"
  parentId?: string; // For hierarchical criteria
  tableStructure: TableStructure;
  tableData?: TableData; // Actual filled data
  result: 'Pass' | 'Fail' | 'N/A' | null;
  children?: TestingCriterion[];
  supplementaryInfo?: SupplementaryInfo;
}

export interface TableStructure {
  columns: TableColumnDefinition[];
  rowTemplate: RowTemplate;
}

export interface TableColumnDefinition {
  id: string;
  header: string;
  type: 'text' | 'number' | 'select' | 'readonly' | 'date' | 'textarea';
  unit?: string;
  placeholder?: string;
  options?: string[]; // For select type columns
  default?: string;
  width?: string;
  required?: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface RowTemplate {
  modelPrefix: string; // e.g., "C#", "P#", "S#"
  modelCount: number; // Number of rows to generate
  customModels?: string[]; // Custom model names if not using prefix pattern
}

export interface TableData {
  rows: TableRowData[];
}

export interface TableRowData {
  id: string;
  model: string; // e.g., "C#01", "P#02", etc.
  values: Record<string, string>; // Column ID -> value mapping
}

export interface SupplementaryInfo {
  defaultNotes?: string[];
  notes: string[];
  testingTime: string;
  tester: string;
  equipment: string;
}

export interface TestingAttempt {
  id: string;
  value: string;
  result: 'Pass' | 'Fail' | 'N/A';
  timestamp: string;
  testerId: string;
}

export interface TestingStandardSection {
  id: string;
  standardName: string; // e.g., "QCVN101:2020"
  sectionTitle: string; // e.g., "Electrical Safety Tests"
  criteria: TestingCriterion[];
  isExpanded?: boolean;
}

export interface InspectionLog {
  id: string;
  assignmentId: string;
  sampleSymbol: string;
  testingStandards: string[];
  testSample: string;
  testingDate: string;
  sampleInfo: Record<string, any>; // Dynamic based on sample type
  testingCriteria: TestingCriterion[];
  standardSections: TestingStandardSection[]; // NEW: Organized by standards
  status: 'Draft' | 'Completed';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportTemplate {
  id: string;
  sampleType: string;
  testingRequirements: string[];
  sections: ReportSection[];
}

export interface ReportSection {
  id: string;
  name: string;
  criteria: TestingCriterion[];
}

export interface Order {
  id: string;
  sampleId: string; // Ký hiệu mẫu - coded ID for objectivity
  sampleName: string; // Tên mẫu
  sampleType: string; // Loại mẫu
  manufacturer: string; // Nhà sản xuất
  dateReceived: string; // Ngày nhận
  quantity: number; // Số lượng mẫu
  notes: string; // Ghi chú
  status: 'pending' | 'in-progress' | 'awaiting-approval' | 'completed';
  assignedTests: string[];
  totalCost?: number;
  customerId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  technicalDocuments?: TechnicalDocument[]; // New field for uploaded documents
}

export interface TechnicalDocument {
  id: string;
  name: string;
  type: string; // 'pdf' | 'doc' | 'docx'
  size: number;
  uploadedAt: string;
  uploadedBy: string;
  url: string; // File URL or path
}

export interface TestTemplate {
  id: string;
  sampleType: string;
  availableTests: TestCriterion[];
}

export interface TestCriterion {
  id: string;
  name: string;
  unit?: string;
  category: string;
  price: number;
}

export interface TestLog {
  id: string;
  orderId: string;
  testId: string;
  result: string;
  testerId: string;
  testerName: string;
  timestamp: string;
  notes?: string;
}

export interface Equipment {
  id: string;
  name: string; // Tên máy
  model: string;
  manufacturer: string; // Nhà sản xuất
  specifications: string; // Specs, thông số
  calibrationNumber: string; // Số GCC Hiệu chuẩn
  calibrationProvider: string; // Đơn vị hiệu chuẩn
  calibrationExpiry: string; // Hạn hiệu chuẩn
  certificates: string[]; // File attachments
  status: 'active' | 'maintenance' | 'expired';
}

export interface Customer {
  id: string;
  name: string;
  discountPercentage: number;
  contactInfo: string;
  orders: string[];
}

export interface Report {
  id: string;
  orderId: string;
  draftContent: string;
  finalContent?: string;
  approvedBy?: string;
  approvedAt?: string;
  attachments: string[];
}
