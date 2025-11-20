'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { clientiAPI } from '@/lib/api';
import Header from '@/components/Layout/Header';
import Link from 'next/link';
import { Plus, Search, Eye } from 'lucide-react';
import { PeriodicitaIva } from '@/lib/types';

export default function ClientiPage() {
  const [search, setSearch] = useState('');
  const [attivo, setAttivo] = useState<boolean | undefined>(true);

  const { data: clienti, isLoading, error } = useQuery({
    queryKey: ['clienti', { search, attivo }],
    queryFn: async () => {
      const response = await clientiAPI.getAll({ search, attivo });
      return response.data;
    },
    retry: false,
  });

  const getPeriodicitaLabel = (periodicita: PeriodicitaIva) => {
    const labels = {
      MENSILE: 'Mensile',
      TRIMESTRALE: 'Trimestrale',
      NESSUNA: 'Nessuna',
    };
    return labels[periodicita] || periodicita;
  };

  return (
    <>
      <Header title="Clienti" />
      
      <div className="p-8">
        <div className="card">
          {/* Filtri e Azioni */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Cerca clienti..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
                />
              </div>

              <select
                value={attivo === undefined ? 'tutti' : attivo ? 'attivi' : 'cessati'}
                onChange={(e) => {
                  if (e.target.value === 'tutti') setAttivo(undefined);
                  else if (e.target.value === 'attivi') setAttivo(true);
                  else setAttivo(false);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="tutti">Tutti</option>
                <option value="attivi">Attivi</option>
                <option value="cessati">Cessati</option>
              </select>
            </div>

            <Link href="/clienti/nuovo" className="btn btn-primary flex items-center gap-2">
              <Plus size={18} />
              Nuovo Cliente
            </Link>
          </div>

          {/* Tabella */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Caricamento...</p>
            </div>
          ) : clienti && clienti.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Nome / Ragione Sociale</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">CF / P.IVA</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Regime Fiscale</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Periodicità IVA</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Stato</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Azioni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {clienti.map((cliente: any) => (
                    <tr key={cliente.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-900">
                          {cliente.ragioneSociale || `${cliente.nome} ${cliente.cognome}`}
                        </p>
                        {cliente.email && (
                          <p className="text-sm text-gray-500">{cliente.email}</p>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {cliente.codiceFiscale && <div>CF: {cliente.codiceFiscale}</div>}
                        {cliente.partitaIva && <div>P.IVA: {cliente.partitaIva}</div>}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {cliente.regimeFiscale || '-'}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {getPeriodicitaLabel(cliente.periodicitaIva)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`badge ${cliente.attivo ? 'badge-success' : 'badge-danger'}`}>
                          {cliente.attivo ? 'Attivo' : 'Cessato'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Link
                          href={`/clienti/${cliente.id}`}
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          <Eye size={16} />
                          Dettagli
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Nessun cliente trovato</p>
              <Link href="/clienti/nuovo" className="btn btn-primary mt-4 inline-flex items-center gap-2">
                <Plus size={18} />
                Aggiungi il primo cliente
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

