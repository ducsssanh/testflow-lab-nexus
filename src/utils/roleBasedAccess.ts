/* eslint-disable @typescript-eslint/no-explicit-any */


import { Order, User } from '@/types/lims';

// Define which fields each role can access
const ROLE_PERMISSIONS = {
  reception: {
    order: ['id', 'sampleId', 'sampleName', 'sampleType', 'manufacturer', 'dateReceived', 'quantity', 'notes', 'status', 'assignedTests', 'totalCost', 'customerId', 'createdBy', 'createdAt', 'updatedAt'] as (keyof Order)[],
  },
  tester: {
    order: ['id', 'sampleId', 'sampleType', 'assignedTests', 'status'] as (keyof Order)[],
  },
  manager: {
    order: ['id', 'sampleId', 'sampleName', 'sampleType', 'manufacturer', 'dateReceived', 'quantity', 'notes', 'status', 'assignedTests', 'totalCost', 'customerId', 'createdBy', 'createdAt', 'updatedAt'] as (keyof Order)[],
  },
};

export const filterOrderByRole = (order: Order, userRole: User['role']): Partial<Order> => {
  const allowedFields = ROLE_PERMISSIONS[userRole].order;
  const filteredOrder: Partial<Order> = {};
  
  allowedFields.forEach(field => {
    if (field in order) {
      (filteredOrder as any)[field] = order[field];
    }
  });
  
  return filteredOrder;
};

export const filterOrdersByRole = (orders: Order[], userRole: User['role']): Partial<Order>[] => {
  return orders.map(order => filterOrderByRole(order, userRole));
};

export const canUserAccessField = (fieldName: keyof Order, userRole: User['role']): boolean => {
  return ROLE_PERMISSIONS[userRole].order.includes(fieldName);
};

// Helper function to get display-friendly field names
export const getFieldDisplayName = (fieldName: keyof Order): string => {
  const fieldNames: Record<keyof Order, string> = {
    id: 'ID',
    sampleId: 'Mã mẫu',
    sampleName: 'Tên mẫu',
    sampleType: 'Loại mẫu',
    manufacturer: 'Nhà sản xuất',
    dateReceived: 'Ngày nhận',
    quantity: 'Số lượng',
    notes: 'Ghi chú',
    status: 'Trạng thái',
    assignedTests: 'Test được giao',
    totalCost: 'Tổng chi phí',
    customerId: 'ID khách hàng',
    createdBy: 'Tạo bởi',
    createdAt: 'Ngày tạo',
    updatedAt: 'Ngày cập nhật',
    technicalDocuments: 'Tài liệu kỹ thuật',
  };
  
  return fieldNames[fieldName] || fieldName;
};

