// Type definitions for the LIMS system
export interface User {
  id: string;
  username: string;
  fullName: string;
  role: 'reception' | 'tester' | 'manager';
  email: string;
  isActive: boolean;
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
