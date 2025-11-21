'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientiAPI } from '@/lib/api';
import Header from '@/components/Layout/Header';
import Link from 'next/link';
import { Plus, Search, Eye, Trash2, User, Info } from 'lucide-react';
import { PeriodicitaIva } from '@/lib/types';

export default function ClientiPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [attivo, setAttivo] = useState<boolean | undefined>(true);
  const [hasToken, setHasToken] = useState(false);

  // ✅ Verifica token in useEffect per evitare hydration mismatch
  useEffect(() => {
    setHasToken(!!localStorage.getItem('access_token'));
  }, []);

  const { data: clienti, isLoading, error } = useQuery({
    queryKey: ['clienti', { search, attivo }],
    queryFn: async () => {
      console.log('🔍 Fetch clienti...');
      const response = await clientiAPI.getAll({ search, attivo });
      console.log('✅ Clienti ricevuti:', response.data?.length || 0);
      return response.data;
    },
    retry: false,
    enabled: hasToken, // ✅ NON partire se non c'è token!
    staleTime: 3 * 60 * 1000, // 3 minuti
    cacheTime: 10 * 60 * 1000, // 10 minuti
    refetchOnWindowFocus: false, // Non ricaricare quando torni sulla finestra
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => clientiAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clienti'] });
    },
  });

  const handleDelete = (id: number, nome: string) => {
    if (confirm(`Sei sicuro di voler eliminare il cliente "${nome}"? Questa azione è irreversibile.`)) {
      deleteMutation.mutate(id);
    }
  };

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
      
      <div className="p-8 space-y-4">
        {/* Banner Informativo */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <Info className="w-7 h-7 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-blue-900 mb-2 flex items-center gap-2">
                📚 Guida Rapida - Gestione Clienti
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <span className="font-bold text-blue-700">➕ Nuovo Cliente:</span>
                  <p className="text-gray-600 mt-1">Clicca il pulsante verde "Nuovo Cliente" per aggiungere un nuovo cliente al sistema</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <span className="font-bold text-green-700">👁️ Visualizza Dettagli:</span>
                  <p className="text-gray-600 mt-1">Clicca sull'icona occhio per vedere tutti i movimenti e le statistiche del cliente</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <span className="font-bold text-purple-700">🔍 Ricerca:</span>
                  <p className="text-gray-600 mt-1">Usa la barra di ricerca per trovare rapidamente un cliente per nome o codice fiscale</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <span className="font-bold text-red-700">🗑️ Elimina:</span>
                  <p className="text-gray-600 mt-1">Clicca sull'icona del cestino per rimuovere definitivamente un cliente</p>
                </div>
              </div>
            </div>
          </div>
        </div>

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
          {!hasToken ? (
            <div className="text-center py-12">
              <div className="mb-4 text-yellow-600">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <p className="text-lg font-semibold text-gray-700 mb-2">Autenticazione richiesta</p>
              <p className="text-sm text-gray-600 mb-4">
                Devi effettuare il login per visualizzare i clienti
              </p>
              <button
                onClick={() => window.location.href = '/login'}
                className="btn btn-primary"
              >
                Vai al Login
              </button>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="mb-4 text-red-600">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-lg font-semibold text-red-700 mb-2">Errore nel caricamento dei clienti</p>
              <p className="text-sm text-gray-600 mb-4">
                Controlla di aver effettuato il login correttamente
              </p>
              <button
                onClick={() => window.location.reload()}
                className="btn btn-primary"
              >
                Ricarica Pagina
              </button>
            </div>
          ) : isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Caricamento clienti...</p>
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
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/clienti/${cliente.id}`}
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            <Eye size={16} />
                            Dettagli
                          </Link>
                          <button
                            onClick={() => handleDelete(cliente.id, cliente.ragioneSociale || `${cliente.nome} ${cliente.cognome}`)}
                            className="text-red-600 hover:text-red-700 p-1 ml-2"
                            title="Elimina cliente"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
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

