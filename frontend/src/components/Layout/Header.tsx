'use client';

import { useQuery } from '@tanstack/react-query';
import { authAPI } from '@/lib/api';
import { User, LogOut, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Header({ title }: { title: string }) {
  const router = useRouter();
  
  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const response = await authAPI.me();
      return response.data.user;
    },
  });

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      localStorage.removeItem('access_token');
      router.push('/login');
    } catch (error) {
      console.error('Errore logout:', error);
      localStorage.removeItem('access_token');
      router.push('/login');
    }
  };

  return (
    <header className="bg-gradient-to-r from-white to-gray-50 border-b-2 border-gray-200 px-8 py-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">{title}</h1>
          <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Info Utente */}
          <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-xl border-2 border-gray-200 shadow-sm">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center">
              <User size={18} className="text-white" />
            </div>
            <div className="text-left">
              <p className="text-xs text-gray-500 font-medium">Benvenuto</p>
              <p className="text-sm font-bold text-gray-900">{user?.username || 'Admin'}</p>
            </div>
          </div>

          {/* Pulsante Profilo */}
          <button
            onClick={() => router.push('/impostazioni')}
            className="p-3 bg-white hover:bg-gray-50 rounded-xl border-2 border-gray-200 transition-all hover:shadow-md"
            title="Impostazioni"
          >
            <Settings size={20} className="text-gray-600" />
          </button>

          {/* Pulsante Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 to-rose-700 text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:from-red-700 hover:to-rose-800 transition-all active:scale-95"
          >
            <LogOut size={18} />
            <span className="hidden md:inline">Esci</span>
          </button>
        </div>
      </div>
    </header>
  );
}

