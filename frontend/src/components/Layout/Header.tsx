'use client';

import { useQuery } from '@tanstack/react-query';
import { authAPI } from '@/lib/api';
import { User } from 'lucide-react';

export default function Header({ title }: { title: string }) {
  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const response = await authAPI.me();
      return response.data.user;
    },
  });

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <User size={18} />
            <span>{user?.username || 'Utente'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

