'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardAPI } from '@/lib/api';
import Header from '@/components/Layout/Header';
import { Euro, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: kpi } = useQuery({
    queryKey: ['dashboard-kpi'],
    queryFn: async () => {
      const response = await dashboardAPI.getKPI();
      return response.data;
    },
  });

  const { data: scadenzeImminenti } = useQuery({
    queryKey: ['scadenze-imminenti'],
    queryFn: async () => {
      const response = await dashboardAPI.getScadenzeImminenti(7);
      return response.data;
    },
  });

  const { data: scadenzeScadute } = useQuery({
    queryKey: ['scadenze-scadute'],
    queryFn: async () => {
      const response = await dashboardAPI.getScadenzeScadute();
      return response.data;
    },
  });

  const { data: flussiCassa } = useQuery({
    queryKey: ['flussi-cassa-12mesi'],
    queryFn: async () => {
      const response = await dashboardAPI.getFlussiCassa();
      return response.data;
    },
  });

  const { data: miglioriClienti } = useQuery({
    queryKey: ['migliori-clienti'],
    queryFn: async () => {
      const response = await dashboardAPI.getMiglioriClienti();
      return response.data;
    },
  });

  const { data: spesePrincipali } = useQuery({
    queryKey: ['spese-principali'],
    queryFn: async () => {
      const response = await dashboardAPI.getSpesePrincipali();
      return response.data;
    },
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: it });
  };

  const getScadenzaColor = (dataScadenza: string, stato: string) => {
    if (stato === 'FATTO') return 'text-green-600';
    
    const oggi = new Date();
    const scadenza = new Date(dataScadenza);
    const diff = Math.ceil((scadenza.getTime() - oggi.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diff < 0) return 'text-red-600';
    if (diff <= 7) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const chartData = flussiCassa?.map((item: any) => ({
    nome: `${item.mese}/${item.anno}`,
    Entrate: item.entrate,
    Uscite: item.uscite,
  })) || [];

  return (
    <>
      <Header title="Dashboard" />
      
      <div className="p-8 space-y-8">
        {/* KPI Cards Principali */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Entrate Mese Corrente</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(kpi?.totaleEntrateMeseCorrente || 0)}
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
                <p className="text-sm text-gray-600 mb-1">Uscite Mese Corrente</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(kpi?.totaleUsciteMeseCorrente || 0)}
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
                <p className="text-sm text-gray-600 mb-1">Saldo Mese Corrente</p>
                <p className={`text-2xl font-bold ${(kpi?.saldoMeseCorrente || 0) >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {formatCurrency(kpi?.saldoMeseCorrente || 0)}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-full">
                <Euro size={24} className="text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* KPI Fiscali */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Analisi Fiscale Mese Corrente</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-xs text-gray-600 mb-1">IVA Incassata</p>
              <p className="text-xl font-bold text-blue-600">
                {formatCurrency(kpi?.totaleIvaIncassata || 0)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Da versare allo Stato</p>
            </div>

            <div>
              <p className="text-xs text-gray-600 mb-1">IVA Versata (Uscite)</p>
              <p className="text-xl font-bold text-purple-600">
                {formatCurrency(kpi?.totaleIvaVersata || 0)}
              </p>
              <p className="text-xs text-gray-500 mt-1">A credito</p>
            </div>

            <div>
              <p className="text-xs text-gray-600 mb-1">IVA Netto</p>
              <p className={`text-xl font-bold ${(kpi?.ivaNettoMeseCorrente || 0) >= 0 ? 'text-orange-600' : 'text-green-600'}`}>
                {formatCurrency(kpi?.ivaNettoMeseCorrente || 0)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {(kpi?.ivaNettoMeseCorrente || 0) >= 0 ? 'Da versare' : 'A credito'}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-600 mb-1">Ritenute Subite</p>
              <p className="text-xl font-bold text-amber-600">
                {formatCurrency(kpi?.totaleRitenuteMeseCorrente || 0)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Da recuperare</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-200">
            <div>
              <p className="text-xs text-gray-600 mb-1">Imponibile Totale Entrate</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(kpi?.totaleImponibileEntrate || 0)}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-600 mb-1">Spese Interne Studio</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(kpi?.totaleSpesaStudio || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Scadenze Imminenti */}
          <div className="lg:col-span-2 card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Scadenze Imminenti (prossimi 7 giorni)
              </h2>
              <Link href="/scadenze" className="text-sm text-blue-600 hover:text-blue-700">
                Vedi tutte
              </Link>
            </div>

            {scadenzeImminenti && scadenzeImminenti.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Data</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Cliente</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Tipo</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Stato</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {scadenzeImminenti.slice(0, 8).map((scadenza: any) => (
                      <tr key={scadenza.id} className="hover:bg-gray-50">
                        <td className={`py-3 px-4 text-sm font-medium ${getScadenzaColor(scadenza.dataScadenza, scadenza.stato)}`}>
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
                          <span className={`badge ${
                            scadenza.stato === 'FATTO' ? 'badge-success' :
                            scadenza.stato === 'IN_CORSO' ? 'badge-warning' :
                            'badge-danger'
                          }`}>
                            {scadenza.stato.replace('_', ' ')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Nessuna scadenza imminente</p>
            )}
          </div>

          {/* Alert Scadenze Arretrate */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Alert</h2>
            
            {scadenzeScadute && scadenzeScadute.numeroScadenzeScadute > 0 ? (
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-900">
                      {scadenzeScadute.numeroScadenzeScadute} scadenze arretrate
                    </p>
                    <p className="text-sm text-red-700 mt-1">
                      Ci sono scadenze non completate oltre la data prevista
                    </p>
                  </div>
                </div>

                {scadenzeScadute.clientiConScadenzeArretrate?.slice(0, 5).map((item: any) => (
                  <div key={item.cliente.id || 'studio'} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900 text-sm">
                      {item.cliente.ragioneSociale || item.cliente.nome || 'Studio'}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {item.scadenze.length} scadenza{item.scadenze.length > 1 ? 'e' : ''} arretrata{item.scadenze.length > 1 ? 'e' : ''}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">Nessuna scadenza arretrata</p>
              </div>
            )}
          </div>
        </div>

        {/* Migliori Clienti + Spese Principali */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Migliori Clienti */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              🏆 Migliori Clienti Anno Corrente
            </h2>
            {miglioriClienti && miglioriClienti.length > 0 ? (
              <div className="space-y-3">
                {miglioriClienti.map((cliente: any, index: number) => (
                  <div key={cliente.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-100">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{cliente.nome}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">
                        {formatCurrency(cliente.totaleEntrate)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Nessun dato disponibile</p>
            )}
          </div>

          {/* Spese Principali */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              💰 Spese Principali Anno Corrente
            </h2>
            {spesePrincipali && spesePrincipali.length > 0 ? (
              <div className="space-y-3">
                {spesePrincipali.slice(0, 5).map((spesa: any) => (
                  <div key={spesa.categoria} className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-white rounded-lg border border-amber-100">
                    <div>
                      <p className="font-semibold text-gray-900">{spesa.categoria}</p>
                      <p className="text-xs text-gray-500">{spesa.numero} movimenti</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-amber-600">
                        {formatCurrency(spesa.totale)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Nessuna spesa registrata</p>
            )}
          </div>
        </div>

        {/* Grafico Flussi di Cassa */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            📈 Flussi di Cassa - Ultimi 12 Mesi
          </h2>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="nome" 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => `€${value}`}
                />
                <Tooltip 
                  formatter={(value: any) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="Entrate" 
                  stroke="#16a34a" 
                  strokeWidth={2}
                  dot={{ fill: '#16a34a', r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Uscite" 
                  stroke="#dc2626" 
                  strokeWidth={2}
                  dot={{ fill: '#dc2626', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}

