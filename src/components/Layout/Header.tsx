
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Menu } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'reception': return 'Tiếp nhận';
      case 'tester': return 'Kiểm định viên';
      case 'manager': return 'Quản lý';
      default: return role;
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {onToggleSidebar && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleSidebar}
              className="flex items-center"
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}
          <h1 className="text-2xl font-bold text-blue-900">LIMS</h1>
          <span className="text-gray-500">Laboratory Information Management System</span>
        </div>
        
        {user && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-500" />
              <div className="text-sm">
                <div className="font-medium">{user.fullName}</div>
                <div className="text-gray-500">{getRoleDisplay(user.role)}</div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Đăng xuất</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
