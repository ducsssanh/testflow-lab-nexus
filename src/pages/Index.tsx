
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/shared/Layout/Header';
import Sidebar from '@/components/shared/Layout/Sidebar';
import OrderManagement from '@/pages/manager/OrderManagement';

const Index = () => {
  const { user, isLoading } = useAuth();
  const [activeModule, setActiveModule] = useState('orders');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  // Move useEffect before any conditional returns to fix hook order violation
  useEffect(() => {
    if (!user && !isLoading) {
      navigate('/');
      return;
    }
    
    if (user?.role === 'TESTER') {
      navigate('/tester/dashboard');
      return;
    } else if (user?.role === 'manager') {
      setActiveModule('dashboard');
    } else {
      setActiveModule('orders');
    }
  }, [user, isLoading, navigate]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login via useEffect
  }

  const renderModule = () => {
    // Set default module based on user role
    if (activeModule === 'orders' && user.role !== 'TESTER') {
      return <OrderManagement />;
    }

    // Placeholder for other modules
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">Module đang phát triển</h3>
          <p className="text-gray-500">Module {activeModule} sẽ sớm được hoàn thiện</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onToggleSidebar={toggleSidebar} />
      <div className="flex">
        <Sidebar 
          activeModule={activeModule} 
          onModuleChange={setActiveModule}
          isCollapsed={sidebarCollapsed}
        />
        <main className="flex-1 p-6">
          {renderModule()}
        </main>
      </div>
    </div>
  );
};

export default Index;
