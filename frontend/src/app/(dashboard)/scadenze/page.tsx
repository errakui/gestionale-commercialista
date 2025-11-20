'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { scadenzeAPI } from '@/lib/api';
import Header from '@/components/Layout/Header';
import { format } from 'date-fns';
import { Calendar, Filter } from 'lucide-react';
import { StatoScadenza } from '@/lib/types';

export default function ScadenzePage() {
  const queryClient = useQueryClient();
  const [stato, setStato] = useState<StatoScadenza | undefined>();
  const [mese, setMese] = useState(new Date().getMonth() + 1);
  const [anno, setAnno] = useState(new Date().getFullYear());

  const { data: scadenze, isLoading } = useQuery({
    queryKey: ['scadenze', { stato, mese, anno }],
    queryFn: async () => {
      const response = await scadenzeAPI.getAll({ stato, mese, anno });
      return response.data;
    },
  });

  const completaMutation = useMutation({
    mutationFn: (id: number) => scadenzeAPI.complete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scadenze'] });
    },
  });

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy');
  };

  const getStatoColor = (stato: StatoScadenza) => {
    switch (stato) {
      case 'FATTO':
        return 'badge-success';
      case 'IN_CORSO':
        return 'badge-warning';
      default:
        return 'badge-danger';
    }
  };

  const getRowColor = (dataScadenza: string, stato: StatoScadenza) => {
    if (stato === 'FATTO') return 'bg-green-50';
    
    const oggi = new Date();
    const scadenza = new Date(dataScadenza);
    const diff = Math.ceil((scadenza.getTime() - oggi.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diff < 0) return 'bg-red-50';
    if (diff <= 7) return 'bg-yellow-50';
    return '';
  };

  return (
    <>
      <Header title="Scadenze" />
      
      <div className="p-8">
        <div className="card">
          {/* Filtri */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-500" />
              <select
                value={stato || ''}
                onChange={(e) => setStato(e.target.value as StatoScadenza || undefined)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Tutti gli stati</option>
                <option value="DA_FARE">Da Fare</option>
                <option value="IN_CORSO">In Corso</option>
                <option value="FATTO">Fatto</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-gray-500" />
              <select
                value={mese}
                onChange={(e) => setMese(parseInt(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(2000, i).toLocaleDateString('it-IT', { month: 'long' })}
                  </option>
                ))}
              </select>

              <select
                value={anno}
                onChange={(e) => setAnno(parseInt(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                {[anno - 1, anno, anno + 1].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tabella */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : scadenze && scadenze.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Data</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Cliente</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Tipo Scadenza</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Stato</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Azioni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {scadenze.map((scadenza: any) => (
                    <tr key={scadenza.id} className={`${getRowColor(scadenza.dataScadenza, scadenza.stato)}`}>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        {formatDate(scadenza.dataScadenza)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {scadenza.cliente 
                          ? (scadenza.cliente.ragioneSociale || `${scadenza.cliente.nome} ${scadenza.cliente.cognome}`)
                          : 'Studio'}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {scadenza.tipoScadenza}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`badge ${getStatoColor(scadenza.stato)}`}>
                          {scadenza.stato.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {scadenza.stato !== 'FATTO' && (
                          <button
                            onClick={() => completaMutation.mutate(scadenza.id)}
                            className="text-sm text-green-600 hover:text-green-700 font-medium"
                          >
                            Completa
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center py-12 text-gray-500">Nessuna scadenza trovata</p>
          )}
        </div>
      </div>
    </>
  );
}

