import React from 'react';
import Header from './Header';

interface TesterLayoutProps {
  children: React.ReactNode;
}

const TesterLayout: React.FC<TesterLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header onToggleSidebar={() => {}} />
      <main className="p-6">
        {children}
      </main>
    </div>
  );
};

export default TesterLayout;