import React from 'react';
import { useMess } from '../../context/MessContext';
import { Utensils, Users, BookOpen, LayoutDashboard, UtensilsCrossed, Settings } from 'lucide-react';

export default function MobileBottomNav() {
  const { activeTab, setActiveTab } = useMess();

  const navItems = [
    { id: 'daily-entry', label: 'Daily Log', icon: Utensils },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'logbook', label: 'Log Book', icon: BookOpen },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'menu', label: 'Meal Rates', icon: UtensilsCrossed },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="xl:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-2 flex items-center justify-around z-50 shadow-2xl backdrop-blur-md touch-manipulation">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center gap-1 min-w-[50px] sm:min-w-[70px] py-1.5 px-2 rounded-xl transition-all touch-manipulation ${
              isActive ? 'text-amber-700 bg-amber-100/80 font-bold shadow-xs' : 'text-slate-500 font-medium hover:text-slate-900'
            }`}
          >
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
            <span className="text-[10px] sm:text-xs tracking-tight text-center leading-none">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
