
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
import {
  Sidebar as SidebarContainer,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';

interface SidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeModule, onModuleChange }) => {
  const { user } = useAuth();
  const { state } = useSidebar();

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
    <SidebarContainer className="border-r border-gray-200">
      <SidebarHeader className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h2 className={cn(
            "font-semibold text-gray-900",
            state === "collapsed" && "hidden"
          )}>
            Menu
          </h2>
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={cn(
            state === "collapsed" && "hidden"
          )}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onModuleChange(item.id)}
                    isActive={activeModule === item.id}
                    className={cn(
                      "w-full justify-start",
                      activeModule === item.id && "bg-blue-100 text-blue-900"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className={cn(
                      state === "collapsed" && "hidden"
                    )}>
                      {item.label}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </SidebarContainer>
  );
};

export default Sidebar;
