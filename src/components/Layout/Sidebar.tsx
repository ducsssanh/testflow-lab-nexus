
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
  isCollapsed?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeModule, onModuleChange, isCollapsed = false }) => {
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
    <div className={cn(
      "bg-gray-50 border-r border-gray-200 h-full transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onModuleChange(item.id)}
            className={cn(
              "w-full flex items-center text-left rounded-lg transition-colors",
              isCollapsed ? "justify-center p-3" : "space-x-3 px-4 py-3",
              activeModule === item.id
                ? "bg-blue-100 text-blue-900 font-medium"
                : "text-gray-700 hover:bg-gray-100"
            )}
            title={isCollapsed ? item.label : undefined}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
