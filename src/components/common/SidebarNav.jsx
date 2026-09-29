import React from 'react';
import { useMess } from '../../context/MessContext';
import {
  Utensils,
  Users,
  BookOpen,
  LayoutDashboard,
  UtensilsCrossed,
  Settings,
} from 'lucide-react';

export default function SidebarNav() {
  const { activeTab, setActiveTab } = useMess();

  const navItems = [
    { id: 'daily-entry', label: 'Daily Log Entry', icon: Utensils, highlight: true },
    { id: 'customers', label: 'Customers (3-Digit)', icon: Users },
    { id: 'logbook', label: 'Monthly Log Book', icon: BookOpen },
    { id: 'dashboard', label: 'Dashboard & Dues', icon: LayoutDashboard },
    { id: 'menu', label: 'Meal Rates', icon: UtensilsCrossed },
    { id: 'settings', label: 'Backup & Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 shrink-0 hidden xl:flex flex-col justify-between p-4 min-h-[calc(100vh-65px)] shadow-sm">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
          Mess Operations
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-amber-500/10 text-amber-800 border border-amber-500/30 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-600' : 'text-slate-500'}`} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.highlight && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* Helper Box */}
      <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-xs text-slate-600 shadow-inner">
        <p className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          3-Digit System (UAE)
        </p>
        <p className="text-[11px] leading-relaxed text-slate-500">
          Enter 3-digit code (e.g. <code className="text-amber-700 font-mono font-bold">001</code>) for fast meal logging.
        </p>
      </div>
    </aside>
  );
}
