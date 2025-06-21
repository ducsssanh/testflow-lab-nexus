
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/Auth/LoginForm';
import Header from '@/components/Layout/Header';
import Sidebar from '@/components/Layout/Sidebar';
import OrderManagement from '@/components/Modules/OrderManagement';
import TesterDashboard from '@/components/Modules/TesterDashboard';
import InspectionChartsView from '@/components/Modules/InspectionChartsView';

const Index = () => {
  const { user, isLoading } = useAuth();
  const [activeModule, setActiveModule] = useState('orders');

  // Move useEffect before any conditional returns to fix hook order violation
  useEffect(() => {
    if (user?.role === 'tester') {
      setActiveModule('testing');
    } else if (user?.role === 'manager') {
      setActiveModule('dashboard');
    } else {
      setActiveModule('orders');
    }
  }, [user?.role]);

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
    return <LoginForm />;
  }

  const renderModule = () => {
    // Set default module based on user role
    if (activeModule === 'orders' && user.role !== 'tester') {
      return <OrderManagement />;
    }
    
    if (activeModule === 'testing' || (activeModule === 'orders' && user.role === 'tester')) {
      return <InspectionChartsView />;
    }

    if (activeModule === 'charts') {
      return <InspectionChartsView />;
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
      <Header />
      <div className="flex">
        <Sidebar activeModule={activeModule} onModuleChange={setActiveModule} />
        <main className="flex-1 p-6">
          {renderModule()}
        </main>
      </div>
    </div>
  );
};

export default Index;
