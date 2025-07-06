/* eslint-disable @typescript-eslint/no-explicit-any */

// Type definitions for the LIMS system
export interface SampleInfo {
  manufacturer: string;
  model: string;
  voltage: string;
  capacity: string;
  temperature: string;
}

export interface User {
  id: number | string; // Unique identifier for the user
  username: string;
  fullName: string;
  role: 'reception' | 'TESTER' | 'manager';
  email: string;
  isActive: boolean;
  teams?: string[]; // Teams the user belongs to
}

export interface Assignment {
  id: number | string;
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
  id: number | string; // Unique identifier for the user
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
  id: number | string; // Unique identifier for the user
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
  id: number | string; // Unique identifier for the user
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
  id: number | string; // Unique identifier for the user
  value: string;
  result: 'Pass' | 'Fail' | 'N/A';
  timestamp: string;
  testerId: number | string;
}


export interface TestingRequirementSection {
  id: string;
  requirementName: string; // e.g., "QCVN101:2020"
  sectionTitle: string; // e.g., "Electrical Safety Tests"
  criteria: TestingCriterion[];
  isExpanded?: boolean;
}

export interface InspectionLog {
  id: number | string;
  assignmentId: number | string;
  sampleSymbol: string;
  testingRequirements: string[];
  testSample: string;
  testingDate: string;
  sampleInfo: SampleInfo;
  testingCriteria: TestingCriterion[];
  requirementSections: TestingRequirementSection[]; // NEW: Organized by requirements
  status: 'Draft' | 'Completed';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  // Additional properties for OrderInformationSection
  orderDate?: string;
  clientName?: string;
  clientAddress?: string;
  notes?: string;
}

export interface ReportTemplate {
  id: number | string;
  sampleType: string;
  testingRequirements: string[];
  sections: ReportSection[];
}

export interface ReportSection {
  id: number | string; // Unique identifier for the report section
  name: string;
  criteria: TestingCriterion[];
}

export interface Order {
  id: number | string; // Unique identifier for the order
  sampleId: number | string; // Ký hiệu mẫu - coded ID for objectivity
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
  id: number | string; // Unique identifier for the technical document
  name: string;
  type: string; // 'pdf' | 'doc' | 'docx'
  size: number;
  uploadedAt: string;
  uploadedBy: string;
  url: string; // File URL or path
}

export interface TestTemplate {
  id: number | string; // Unique identifier for the test template
  sampleType: string;
  availableTests: TestCriterion[];
}

export interface TestCriterion {
  id: number | string; // Unique identifier for the test criterion
  name: string;
  unit?: string;
  category: string;
  price: number;
}

export interface TestLog {
  id: number | string; // Unique identifier for the test log
  orderId: number | string; // Associated order ID
  testId: number | string; // Associated test ID
  result: string;
  testerId: number | string; // Unique identifier for the tester
  testerName: string;
  timestamp: string;
  notes?: string;
}

export interface Equipment {
  id: number | string; // Unique identifier for the equipment
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
  id: number | string; // Unique identifier for the user
  name: string;
  discountPercentage: number;
  contactInfo: string;
  orders: (number | string)[];
}

export interface Report {
  id: number | string; // Unique identifier for the user
  orderId: number | string;
  draftContent: string;
  finalContent?: string;
  approvedBy?: string;
  approvedAt?: string;
  attachments: string[];
}