'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';
import { LogIn, User, Lock } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('🔐 Tentativo login...');
      const response = await authAPI.login(formData);
      console.log('✅ Login OK, token ricevuto');
      
      // Verifica che il token sia stato salvato
      const savedToken = localStorage.getItem('access_token');
      if (!savedToken) {
        console.error('❌ Token non salvato nel localStorage!');
        throw new Error('Token non salvato');
      }
      
      console.log('✅ Token salvato nel localStorage');
      
      // Aspetta un attimo prima del redirect per sicurezza
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('🚀 Redirect alla dashboard...');
      window.location.href = '/dashboard'; // Uso window.location invece di router per forzare reload
    } catch (err: any) {
      console.error('❌ Errore login:', err);
      setError(err.response?.data?.message || err.message || 'Credenziali non valide');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 p-4">
      <div className="w-full max-w-md">
        {/* Logo e Titolo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-2xl mb-6 animate-slide-up">
            <LogIn size={40} className="text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Gestionale Commercialista
          </h1>
          <p className="text-blue-200 text-lg">
            Accedi al tuo account
          </p>
        </div>

        {/* Card di Login */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={20} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="admin"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={20} className="text-gray-400" />
                </div>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Errore */}
            {error && (
              <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Pulsante Login */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn btn-primary py-3 text-base font-bold shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="spinner w-5 h-5 border-2 border-white border-t-transparent"></div>
                  Accesso in corso...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <LogIn size={20} />
                  Accedi
                </div>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-blue-200 text-sm">
            Software Gestionale per Studio Commercialista
          </p>
        </div>
      </div>
    </div>
  );
}
