'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Wallet,
  Settings,
  FileDown,
  LogOut,
  Briefcase,
  FileText,
} from 'lucide-react';
import { authAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/clienti', label: 'Clienti', icon: Users },
  { href: '/servizi', label: 'Servizi', icon: Briefcase },
  { href: '/cassa', label: 'Flussi di Cassa', icon: Wallet },
  { href: '/mandato', label: 'Mandato', icon: FileText },
  { href: '/export', label: 'Import/Export', icon: FileDown },
  { href: '/impostazioni', label: 'Impostazioni', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      localStorage.removeItem('access_token');
      router.push('/login');
    } catch (error) {
      console.error('Errore durante il logout:', error);
      // Rimuovi il token comunque
      localStorage.removeItem('access_token');
      router.push('/login');
    }
  };

  return (
    <aside className="fixed left-0 top-0 w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r-2 border-slate-700 h-screen flex flex-col shadow-2xl z-40">
      {/* Logo / Header */}
      <div className="p-6 border-b-2 border-slate-700">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <Briefcase size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Gestionale
            </h1>
            <p className="text-xs text-blue-300 font-medium">Commercialista Pro</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 font-semibold'
                      : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon size={20} className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'} />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t-2 border-slate-700">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white w-full transition-all duration-200 font-semibold shadow-lg hover:shadow-xl active:scale-95"
        >
          <LogOut size={20} />
          <span>Esci</span>
        </button>
      </div>
    </aside>
  );
}

