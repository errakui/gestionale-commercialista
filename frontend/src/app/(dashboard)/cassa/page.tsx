'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { movimentiAPI } from '@/lib/api';
import Header from '@/components/Layout/Header';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown, Euro, Download } from 'lucide-react';
import { TipoMovimento } from '@/lib/types';

export default function CassaPage() {
  const [tipo, setTipo] = useState<TipoMovimento | undefined>();
  const [mese, setMese] = useState(new Date().getMonth() + 1);
  const [anno, setAnno] = useState(new Date().getFullYear());

  const { data: movimenti, isLoading } = useQuery({
    queryKey: ['movimenti', { tipo, mese, anno }],
    queryFn: async () => {
      const response = await movimentiAPI.getAll({ tipo, mese, anno });
      return response.data;
    },
  });

  const { data: summary } = useQuery({
    queryKey: ['movimenti-summary', { tipo, mese, anno }],
    queryFn: async () => {
      const response = await movimentiAPI.getSummary({ tipo, mese, anno });
      return response.data;
    },
  });

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };

  return (
    <>
      <Header title="Flussi di Cassa" />
      
      <div className="p-8 space-y-6">
        {/* KPI Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Totale Entrate</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(summary?.totaleEntrate || 0)}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-full">
                <TrendingUp size={24} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Totale Uscite</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(summary?.totaleUscite || 0)}
                </p>
              </div>
              <div className="p-3 bg-red-50 rounded-full">
                <TrendingDown size={24} className="text-red-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Saldo</p>
                <p className={`text-2xl font-bold ${(summary?.saldo || 0) >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {formatCurrency(summary?.saldo || 0)}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-full">
                <Euro size={24} className="text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          {/* Filtri */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <select
                value={tipo || ''}
                onChange={(e) => setTipo(e.target.value as TipoMovimento || undefined)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Tutti i tipi</option>
                <option value="ENTRATA">Entrate</option>
                <option value="USCITA">Uscite</option>
              </select>

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

            <a
              href={`${process.env.NEXT_PUBLIC_API_URL}/export/movimenti?format=excel&mese=${mese}&anno=${anno}`}
              className="btn btn-secondary flex items-center gap-2"
            >
              <Download size={18} />
              Esporta Excel
            </a>
          </div>

          {/* Tabella */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : movimenti && movimenti.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Data</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Tipo</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Cliente</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Categoria</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Descrizione</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Importo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {movimenti.map((movimento: any) => (
                    <tr key={movimento.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {formatDate(movimento.dataMovimento)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`badge ${movimento.tipo === 'ENTRATA' ? 'badge-success' : 'badge-danger'}`}>
                          {movimento.tipo}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {movimento.cliente 
                          ? (movimento.cliente.ragioneSociale || `${movimento.cliente.nome} ${movimento.cliente.cognome}`)
                          : 'Studio'}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {movimento.categoria || '-'}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {movimento.descrizione}
                      </td>
                      <td className={`py-3 px-4 text-sm text-right font-semibold ${
                        movimento.tipo === 'ENTRATA' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {movimento.tipo === 'ENTRATA' ? '+' : '-'} {formatCurrency(movimento.importo)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center py-12 text-gray-500">Nessun movimento trovato</p>
          )}
        </div>
      </div>
    </>
  );
}

