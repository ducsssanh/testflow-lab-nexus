
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { 
  ClipboardCheck, 
  FileText, 
  Users, 
  Settings,
  Database,
  Calendar,
  Archive
} from 'lucide-react';

interface SidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeModule, onModuleChange }) => {
  const { user } = useAuth();

  const getMenuItems = () => {
    const baseItems = [];

    if (user?.role === 'reception') {
      baseItems.push(
        { id: 'orders', label: 'Quản lý mẫu', icon: ClipboardCheck },
        { id: 'customers', label: 'Khách hàng', icon: Users },
      );
    }

    if (user?.role === 'tester') {
      baseItems.push(
        { id: 'testing', label: 'Kiểm định', icon: FileText },
        { id: 'equipment', label: 'Thiết bị', icon: Settings },
      );
    }

    if (user?.role === 'manager') {
      baseItems.push(
        { id: 'dashboard', label: 'Tổng quan', icon: Database },
        { id: 'orders', label: 'Quản lý mẫu', icon: ClipboardCheck },
        { id: 'reports', label: 'Báo cáo', icon: FileText },
        { id: 'equipment', label: 'Thiết bị', icon: Settings },
        { id: 'pricing', label: 'Báo giá', icon: Archive },
        { id: 'customers', label: 'Khách hàng', icon: Users },
      );
    }

    return baseItems;
  };

  const menuItems = getMenuItems();

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 h-full">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onModuleChange(item.id)}
            className={cn(
              "w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors",
              activeModule === item.id
                ? "bg-blue-100 text-blue-900 font-medium"
                : "text-gray-700 hover:bg-gray-100"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
