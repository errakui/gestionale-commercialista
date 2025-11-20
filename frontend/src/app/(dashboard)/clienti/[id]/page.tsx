'use client';

import { useQuery } from '@tanstack/react-query';
import { clientiAPI, movimentiAPI, noteAPI } from '@/lib/api';
import Header from '@/components/Layout/Header';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Edit, ArrowLeft, Euro } from 'lucide-react';
import { format } from 'date-fns';

export default function ClienteDettaglioPage() {
  const params = useParams();
  const clienteId = parseInt(params.id as string);

  const { data: cliente } = useQuery({
    queryKey: ['cliente', clienteId],
    queryFn: async () => {
      const response = await clientiAPI.getOne(clienteId);
      return response.data;
    },
  });

  const { data: stats } = useQuery({
    queryKey: ['cliente-stats', clienteId],
    queryFn: async () => {
      const response = await clientiAPI.getStatistics(clienteId);
      return response.data;
    },
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };

  if (!cliente) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <Header title={cliente.ragioneSociale || `${cliente.nome} ${cliente.cognome}`} />
      
      <div className="p-8 space-y-6">
        {/* Header con azioni */}
        <div className="flex items-center justify-between">
          <Link href="/clienti" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft size={18} />
            Torna alla lista
          </Link>
          
          <Link href={`/clienti/${clienteId}/modifica`} className="btn btn-primary flex items-center gap-2">
            <Edit size={18} />
            Modifica
          </Link>
        </div>

        {/* KPI Cliente */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Entrate Anno</p>
            <p className="text-xl font-bold text-green-600">
              {formatCurrency(stats?.totaleEntrate || 0)}
            </p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Uscite Anno</p>
            <p className="text-xl font-bold text-red-600">
              {formatCurrency(stats?.totaleUscite || 0)}
            </p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Saldo Anno</p>
            <p className={`text-xl font-bold ${(stats?.saldo || 0) >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              {formatCurrency(stats?.saldo || 0)}
            </p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Scadenze Prossimi 30gg</p>
            <p className="text-xl font-bold text-gray-900">
              {stats?.scadenzeProssimi30Giorni || 0}
            </p>
          </div>
        </div>

        {/* Dati Anagrafici */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Dati Anagrafici</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <p className="text-sm text-gray-600">Tipo Cliente</p>
              <p className="font-medium text-gray-900">{cliente.tipoCliente.replace('_', ' ')}</p>
            </div>

            {cliente.ragioneSociale && (
              <div>
                <p className="text-sm text-gray-600">Ragione Sociale</p>
                <p className="font-medium text-gray-900">{cliente.ragioneSociale}</p>
              </div>
            )}

            {(cliente.nome || cliente.cognome) && (
              <div>
                <p className="text-sm text-gray-600">Nome e Cognome</p>
                <p className="font-medium text-gray-900">{cliente.nome} {cliente.cognome}</p>
              </div>
            )}

            {cliente.codiceFiscale && (
              <div>
                <p className="text-sm text-gray-600">Codice Fiscale</p>
                <p className="font-medium text-gray-900">{cliente.codiceFiscale}</p>
              </div>
            )}

            {cliente.partitaIva && (
              <div>
                <p className="text-sm text-gray-600">Partita IVA</p>
                <p className="font-medium text-gray-900">{cliente.partitaIva}</p>
              </div>
            )}

            {cliente.email && (
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">{cliente.email}</p>
              </div>
            )}

            {cliente.pec && (
              <div>
                <p className="text-sm text-gray-600">PEC</p>
                <p className="font-medium text-gray-900">{cliente.pec}</p>
              </div>
            )}

            {cliente.telefono && (
              <div>
                <p className="text-sm text-gray-600">Telefono</p>
                <p className="font-medium text-gray-900">{cliente.telefono}</p>
              </div>
            )}

            {(cliente.indirizzo || cliente.citta) && (
              <div>
                <p className="text-sm text-gray-600">Indirizzo</p>
                <p className="font-medium text-gray-900">
                  {cliente.indirizzo}
                  {cliente.cap && `, ${cliente.cap}`}
                  {cliente.citta && ` ${cliente.citta}`}
                  {cliente.provincia && ` (${cliente.provincia})`}
                </p>
              </div>
            )}

            <div>
              <p className="text-sm text-gray-600">Regime Fiscale</p>
              <p className="font-medium text-gray-900">{cliente.regimeFiscale || '-'}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Periodicità IVA</p>
              <p className="font-medium text-gray-900">{cliente.periodicitaIva}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Ha Immobili (IMU)</p>
              <p className="font-medium text-gray-900">{cliente.haImmobili ? 'Sì' : 'No'}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Stato</p>
              <span className={`badge ${cliente.attivo ? 'badge-success' : 'badge-danger'}`}>
                {cliente.attivo ? 'Attivo' : 'Cessato'}
              </span>
            </div>
          </div>

          {cliente.noteInterne && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Note Interne</p>
              <p className="text-gray-900 whitespace-pre-wrap">{cliente.noteInterne}</p>
            </div>
          )}
        </div>

        {/* Link rapidi */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href={`/cassa?clienteId=${clienteId}`} className="card hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-gray-900 mb-2">Flussi di Cassa</h3>
            <p className="text-sm text-gray-600">Visualizza tutti i movimenti di questo cliente</p>
          </Link>
          
          <Link href={`/scadenze?clienteId=${clienteId}`} className="card hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-gray-900 mb-2">Scadenze</h3>
            <p className="text-sm text-gray-600">Gestisci le scadenze fiscali del cliente</p>
          </Link>
          
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-2">Note</h3>
            <p className="text-sm text-gray-600">Aggiungi e gestisci note interne</p>
          </div>
        </div>
      </div>
    </>
  );
}

