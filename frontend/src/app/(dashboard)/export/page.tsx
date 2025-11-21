'use client';

import Header from '@/components/Layout/Header';
import { Download, FileSpreadsheet, Users, Calendar, Wallet } from 'lucide-react';
import { useState } from 'react';

export default function ExportPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  const handleExport = async (tipo: string, format: string) => {
    setIsDownloading(`${tipo}-${format}`);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        alert('⚠️ Devi effettuare il login per esportare i dati!');
        return;
      }

      const response = await fetch(`${API_URL}/export/${tipo}?format=${format}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Errore ${response.status}: ${response.statusText}`);
      }

      // Ottieni il nome del file dall'header o usa un default
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `${tipo}_${format}_${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : format}`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Scarica il file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      console.log(`✅ Export ${tipo} (${format}) completato!`);
    } catch (error: any) {
      console.error('❌ Errore export:', error);
      alert(`❌ Errore durante l'export: ${error.message}`);
    } finally {
      setIsDownloading(null);
    }
  };

  return (
    <>
      <Header title="Import / Export" />
      
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Export Clienti */}
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Users size={24} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Clienti</h3>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              Esporta l&apos;anagrafica completa di tutti i clienti
            </p>

            <div className="space-y-2">
              <button
                onClick={() => handleExport('clienti', 'csv')}
                disabled={isDownloading === 'clienti-csv'}
                className="btn btn-secondary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDownloading === 'clienti-csv' ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Scaricamento...
                  </>
                ) : (
                  <>
                    <Download size={18} />
                    Esporta CSV
                  </>
                )}
              </button>
              <button
                onClick={() => handleExport('clienti', 'excel')}
                disabled={isDownloading === 'clienti-excel'}
                className="btn btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDownloading === 'clienti-excel' ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Scaricamento...
                  </>
                ) : (
                  <>
                    <FileSpreadsheet size={18} />
                    Esporta Excel
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Export Movimenti */}
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <Wallet size={24} className="text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Movimenti Cassa</h3>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              Esporta tutti i movimenti di cassa (entrate e uscite)
            </p>

            <div className="space-y-2">
              <button
                onClick={() => handleExport('movimenti', 'csv')}
                disabled={isDownloading === 'movimenti-csv'}
                className="btn btn-secondary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDownloading === 'movimenti-csv' ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Scaricamento...
                  </>
                ) : (
                  <>
                    <Download size={18} />
                    Esporta CSV
                  </>
                )}
              </button>
              <button
                onClick={() => handleExport('movimenti', 'excel')}
                disabled={isDownloading === 'movimenti-excel'}
                className="btn btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDownloading === 'movimenti-excel' ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Scaricamento...
                  </>
                ) : (
                  <>
                    <FileSpreadsheet size={18} />
                    Esporta Excel
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Export Scadenze */}
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-50 rounded-lg">
                <Calendar size={24} className="text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Scadenze</h3>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              Esporta tutte le scadenze fiscali
            </p>

            <div className="space-y-2">
              <button
                onClick={() => handleExport('scadenze', 'csv')}
                disabled={isDownloading === 'scadenze-csv'}
                className="btn btn-secondary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDownloading === 'scadenze-csv' ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Scaricamento...
                  </>
                ) : (
                  <>
                    <Download size={18} />
                    Esporta CSV
                  </>
                )}
              </button>
              <button
                onClick={() => handleExport('scadenze', 'excel')}
                disabled={isDownloading === 'scadenze-excel'}
                className="btn btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDownloading === 'scadenze-excel' ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Scaricamento...
                  </>
                ) : (
                  <>
                    <FileSpreadsheet size={18} />
                    Esporta Excel
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="card mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Note sull&apos;Export</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>I file CSV sono compatibili con Excel, LibreOffice e altri software di gestione</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>I file Excel (.xlsx) mantengono la formattazione e sono più leggibili</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>L&apos;export include tutti i dati visibili nella sezione corrispondente</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Per esportare dati filtrati, utilizzare i filtri nella rispettiva sezione prima dell&apos;export</span>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

