import React from 'react';
import { MessProvider, useMess } from './context/MessContext';
import Header from './components/common/Header';
import SidebarNav from './components/common/SidebarNav';
import MobileBottomNav from './components/common/MobileBottomNav';
import ToastNotifications from './components/common/ToastNotifications';

// Views
import DailyEntryView from './components/views/DailyEntryView';
import CustomersView from './components/views/CustomersView';
import MonthlyLogBookView from './components/views/MonthlyLogBookView';
import DashboardView from './components/views/DashboardView';
import MenuView from './components/views/MenuView';
import SettingsView from './components/views/SettingsView';

function MainAppShell() {
  const { activeTab } = useMess();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'daily-entry':
        return <DailyEntryView />;
      case 'customers':
        return <CustomersView />;
      case 'logbook':
        return <MonthlyLogBookView />;
      case 'dashboard':
        return <DashboardView />;
      case 'menu':
        return <MenuView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DailyEntryView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-amber-500 selection:text-white">
      {/* Toast Overlay */}
      <ToastNotifications />

      {/* Top App Header */}
      <Header />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex min-h-[calc(100vh-60px)]">
        {/* Desktop Sidebar Navigation (Only visible on >= 1280px) */}
        <SidebarNav />

        {/* Main Content Workspace Area - Fits iPad / Tablet & Mobile with bottom padding for fixed nav */}
        <main className="flex-1 p-3 sm:p-5 md:p-6 lg:p-8 pb-24 xl:pb-8 min-w-0 max-w-7xl mx-auto w-full">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile & Tablet Bottom Navigation Bar (Visible on Mobile & iPad < 1280px) */}
      <MobileBottomNav />
    </div>
  );
}

export default function App() {
  return (
    <MessProvider>
      <MainAppShell />
    </MessProvider>
  );
}
