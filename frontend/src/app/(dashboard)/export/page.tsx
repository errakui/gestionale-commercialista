'use client';

import Header from '@/components/Layout/Header';
import { Download, FileSpreadsheet, Users, Calendar, Wallet } from 'lucide-react';

export default function ExportPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
              Esporta l'anagrafica completa di tutti i clienti
            </p>

            <div className="space-y-2">
              <a
                href={`${API_URL}/export/clienti?format=csv`}
                className="btn btn-secondary w-full flex items-center justify-center gap-2"
              >
                <Download size={18} />
                Esporta CSV
              </a>
              <a
                href={`${API_URL}/export/clienti?format=excel`}
                className="btn btn-primary w-full flex items-center justify-center gap-2"
              >
                <FileSpreadsheet size={18} />
                Esporta Excel
              </a>
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
              <a
                href={`${API_URL}/export/movimenti?format=csv`}
                className="btn btn-secondary w-full flex items-center justify-center gap-2"
              >
                <Download size={18} />
                Esporta CSV
              </a>
              <a
                href={`${API_URL}/export/movimenti?format=excel`}
                className="btn btn-primary w-full flex items-center justify-center gap-2"
              >
                <FileSpreadsheet size={18} />
                Esporta Excel
              </a>
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
              <a
                href={`${API_URL}/export/scadenze?format=csv`}
                className="btn btn-secondary w-full flex items-center justify-center gap-2"
              >
                <Download size={18} />
                Esporta CSV
              </a>
              <a
                href={`${API_URL}/export/scadenze?format=excel`}
                className="btn btn-primary w-full flex items-center justify-center gap-2"
              >
                <FileSpreadsheet size={18} />
                Esporta Excel
              </a>
            </div>
          </div>
        </div>

        <div className="card mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Note sull'Export</h3>
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
              <span>L'export include tutti i dati visibili nella sezione corrispondente</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Per esportare dati filtrati, utilizzare i filtri nella rispettiva sezione prima dell'export</span>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

