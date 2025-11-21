'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { clientiAPI, movimentiAPI } from '@/lib/api';
import Header from '@/components/Layout/Header';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Edit, ArrowLeft, Euro, TrendingUp, TrendingDown, Calendar, FileText, Download, FileSpreadsheet, FileDown } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function ClienteDettaglioPage() {
  const params = useParams();
  const clienteId = parseInt(params.id as string);
  const [anno, setAnno] = useState(new Date().getFullYear());
  const [isExporting, setIsExporting] = useState(false);

  const { data: cliente } = useQuery({
    queryKey: ['cliente', clienteId],
    queryFn: async () => {
      const response = await clientiAPI.getOne(clienteId);
      return response.data;
    },
  });

  const { data: stats } = useQuery({
    queryKey: ['cliente-stats', clienteId, anno],
    queryFn: async () => {
      const response = await clientiAPI.getStatistics(clienteId, anno);
      return response.data;
    },
  });

  const { data: movimenti } = useQuery({
    queryKey: ['movimenti-cliente', clienteId, anno],
    queryFn: async () => {
      const response = await movimentiAPI.getAll({ clienteId, anno });
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
    return format(new Date(dateString), 'dd/MM/yyyy');
  };

  const handleExportCliente = async (format: 'excel' | 'pdf') => {
    setIsExporting(true);
    const token = localStorage.getItem('access_token');
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    if (!token) {
      toast.error('Devi essere loggato per scaricare il file.');
      setIsExporting(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/export/cliente/${clienteId}?format=${format}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Errore durante l'export: ${response.status}`);
      }

      const blob = await response.blob();
      const contentDisposition = response.headers.get('Content-Disposition');
      const ext = format === 'pdf' ? 'pdf' : 'xlsx';
      let filename = `cliente_${clienteId}_${new Date().toISOString().split('T')[0]}.${ext}`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success(`Estratto conto ${format.toUpperCase()} scaricato con successo!`);
    } catch (err: any) {
      console.error('Errore export cliente:', err);
      toast.error('Errore durante lo scaricamento del file.');
    } finally {
      setIsExporting(false);
    }
  };

  // CALCOLI AUTOMATICI dai movimenti
  const totali = movimenti?.reduce((acc: any, mov: any) => {
    // Funzione helper per convertire in numero evitando NaN
    const toNumber = (val: any) => {
      const num = Number(val);
      return isNaN(num) || !isFinite(num) ? 0 : num;
    };

    const importo = toNumber(mov.importo);
    const imponibile = toNumber(mov.imponibile);
    const importoIva = toNumber(mov.importoIva);
    const importoRitenuta = toNumber(mov.importoRitenuta);
    const totale = toNumber(mov.totale);

    if (mov.tipo === 'ENTRATA') {
      acc.totaleEntrate += importo;
      acc.totaleImponibileEntrate += imponibile || importo;
      acc.totaleIvaIncassata += importoIva;
      acc.totaleRitenute += importoRitenuta;
      acc.totaleNettoIncassato += totale || importo;
    } else {
      acc.totaleUscite += importo;
      acc.totaleImponibileUscite += imponibile || importo;
      acc.totaleIvaVersata += importoIva;
    }
    return acc;
  }, {
    totaleEntrate: 0,
    totaleUscite: 0,
    totaleImponibileEntrate: 0,
    totaleImponibileUscite: 0,
    totaleIvaIncassata: 0,
    totaleIvaVersata: 0,
    totaleRitenute: 0,
    totaleNettoIncassato: 0,
  }) || {
    totaleEntrate: 0,
    totaleUscite: 0,
    totaleImponibileEntrate: 0,
    totaleImponibileUscite: 0,
    totaleIvaIncassata: 0,
    totaleIvaVersata: 0,
    totaleRitenute: 0,
    totaleNettoIncassato: 0,
  };

  const saldo = totali.totaleEntrate - totali.totaleUscite;
  const ivaNetto = totali.totaleIvaIncassata - totali.totaleIvaVersata;

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
          
          <div className="flex items-center gap-2">
            <select
              value={anno}
              onChange={(e) => setAnno(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              {[anno - 2, anno - 1, anno, anno + 1].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>

            <button
              onClick={() => handleExportCliente('excel')}
              disabled={isExporting}
              className="btn btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Scaricamento...
                </>
              ) : (
                <>
                  <FileSpreadsheet size={18} />
                  Excel
                </>
              )}
            </button>

            <button
              onClick={() => handleExportCliente('pdf')}
              disabled={isExporting}
              className="btn btn-danger flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Scaricamento...
                </>
              ) : (
                <>
                  <FileText size={18} />
                  PDF
                </>
              )}
            </button>

            <Link href={`/clienti/${clienteId}/modifica`} className="btn btn-primary flex items-center gap-2">
              <Edit size={18} />
              Modifica
            </Link>
          </div>
        </div>

        {/* KPI Cliente - TOTALI AUTOMATICI */}
        <div className="card bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Euro size={20} className="text-blue-600" />
            Analisi Economica Anno {anno}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Totale Entrate</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(totali.totaleEntrate)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Imponibile: {formatCurrency(totali.totaleImponibileEntrate)}</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Totale Uscite</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(totali.totaleUscite)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Imponibile: {formatCurrency(totali.totaleImponibileUscite)}</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Saldo</p>
              <p className={`text-2xl font-bold ${saldo >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {formatCurrency(saldo)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Entrate - Uscite</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Netto Incassato</p>
              <p className="text-2xl font-bold text-indigo-600">
                {formatCurrency(totali.totaleNettoIncassato)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Dopo ritenute</p>
            </div>
          </div>

          {/* Dettaglio Fiscale */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-blue-200">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-xs text-gray-600 mb-1">IVA Incassata</p>
              <p className="text-lg font-bold text-blue-600">
                {formatCurrency(totali.totaleIvaIncassata)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Da versare allo Stato</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-xs text-gray-600 mb-1">IVA Versata (Uscite)</p>
              <p className="text-lg font-bold text-purple-600">
                {formatCurrency(totali.totaleIvaVersata)}
              </p>
              <p className="text-xs text-gray-500 mt-1">A credito</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-xs text-gray-600 mb-1">Ritenute Subite</p>
              <p className="text-lg font-bold text-amber-600">
                {formatCurrency(totali.totaleRitenute)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Da recuperare</p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-white rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">IVA Netto da Versare</p>
            <p className={`text-xl font-bold ${ivaNetto >= 0 ? 'text-orange-600' : 'text-green-600'}`}>
              {formatCurrency(ivaNetto)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {ivaNetto >= 0 ? 'Da versare allo Stato' : 'A credito'}
            </p>
          </div>
        </div>

        {/* Dati Anagrafici e Fiscali */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Dati Anagrafici */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Dati Anagrafici</h2>
            
            <div className="space-y-3">
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
            </div>
          </div>

          {/* Impostazioni Fiscali */}
          <div className="card bg-gradient-to-br from-blue-50 to-indigo-50">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">⚙️ Impostazioni Fiscali</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Regime Fiscale</p>
                <p className="font-medium text-gray-900">{cliente.regimeFiscale || 'Non specificato'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Periodicità IVA</p>
                <p className="font-medium text-gray-900">{cliente.periodicitaIva}</p>
              </div>

              {/* Sezione IVA */}
              <div className="p-3 bg-white rounded-lg border border-blue-200">
                <p className="font-semibold text-gray-900 mb-2">Gestione IVA</p>
                <div className="space-y-2">
                  {cliente.soggettoIva && !cliente.esenteIva ? (
                    <>
                      <span className="badge badge-info">Soggetto a IVA</span>
                      <p className="text-sm text-gray-700">Aliquota: <span className="font-bold">{cliente.aliquotaIva}%</span></p>
                    </>
                  ) : (
                    <span className="badge bg-gray-100 text-gray-700">Esente IVA</span>
                  )}
                </div>
              </div>

              {/* Sezione Ritenuta */}
              <div className="p-3 bg-white rounded-lg border border-amber-200">
                <p className="font-semibold text-gray-900 mb-2">Ritenuta d'Acconto</p>
                <div className="space-y-2">
                  {cliente.soggettoRitenuta && !cliente.esenteRitenuta ? (
                    <>
                      <span className="badge badge-warning">Soggetto a Ritenuta</span>
                      <p className="text-sm text-gray-700">Aliquota: <span className="font-bold">{cliente.aliquotaRitenuta}%</span></p>
                    </>
                  ) : (
                    <span className="badge bg-gray-100 text-gray-700">Esente Ritenuta</span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600">Ha Immobili (IMU)</p>
                <span className={`badge ${cliente.haImmobili ? 'badge-success' : 'bg-gray-100 text-gray-700'}`}>
                  {cliente.haImmobili ? 'Sì' : 'No'}
                </span>
              </div>

              <div>
                <p className="text-sm text-gray-600">Stato</p>
                <span className={`badge ${cliente.attivo ? 'badge-success' : 'badge-danger'}`}>
                  {cliente.attivo ? 'Attivo' : 'Cessato'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* STORICO MOVIMENTI COMPLETO */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FileText size={20} />
              Storico Movimenti {anno}
            </h2>
            <Link 
              href={`/cassa?clienteId=${clienteId}&anno=${anno}`}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Vedi tutti i movimenti →
            </Link>
          </div>

          {movimenti && movimenti.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Data</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Tipo</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Descrizione</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Imponibile</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">IVA</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Ritenuta</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Totale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {movimenti.slice(0, 10).map((movimento: any) => (
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
                        <div>{movimento.descrizione}</div>
                        {movimento.categoria && (
                          <span className="text-xs text-gray-500">{movimento.categoria}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-right font-medium text-gray-700">
                        {formatCurrency(Number(movimento.imponibile) || Number(movimento.importo) || 0)}
                      </td>
                      <td className="py-3 px-4 text-sm text-right font-medium text-blue-600">
                        {formatCurrency(Number(movimento.importoIva) || 0)}
                      </td>
                      <td className="py-3 px-4 text-sm text-right font-medium text-amber-600">
                        {formatCurrency(Number(movimento.importoRitenuta) || 0)}
                      </td>
                      <td className={`py-3 px-4 text-sm text-right font-bold ${
                        movimento.tipo === 'ENTRATA' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {movimento.tipo === 'ENTRATA' ? '+' : '-'} {formatCurrency(Number(movimento.totale) || Number(movimento.importo) || 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t-2 border-gray-300 bg-gray-50">
                  <tr>
                    <td colSpan={3} className="py-3 px-4 text-sm font-bold text-gray-900">
                      TOTALI
                    </td>
                    <td className="py-3 px-4 text-sm text-right font-bold text-gray-900">
                      {formatCurrency(totali.totaleImponibileEntrate)}
                    </td>
                    <td className="py-3 px-4 text-sm text-right font-bold text-blue-600">
                      {formatCurrency(totali.totaleIvaIncassata)}
                    </td>
                    <td className="py-3 px-4 text-sm text-right font-bold text-amber-600">
                      {formatCurrency(totali.totaleRitenute)}
                    </td>
                    <td className={`py-3 px-4 text-sm text-right font-bold ${saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(saldo)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Nessun movimento per questo anno</p>
          )}
        </div>

        {/* Note Interne */}
        {cliente.noteInterne && (
          <div className="card bg-yellow-50 border border-yellow-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">📝 Note Interne</h2>
            <p className="text-gray-900 whitespace-pre-wrap">{cliente.noteInterne}</p>
          </div>
        )}

        {/* Link rapidi */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href={`/cassa?clienteId=${clienteId}`} className="card hover:shadow-lg transition-shadow bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="text-green-600" size={24} />
              <h3 className="font-semibold text-gray-900">Flussi di Cassa</h3>
            </div>
            <p className="text-sm text-gray-600">Visualizza e crea movimenti per questo cliente</p>
          </Link>
          
          <Link href={`/scadenze?clienteId=${clienteId}`} className="card hover:shadow-lg transition-shadow bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="text-purple-600" size={24} />
              <h3 className="font-semibold text-gray-900">Scadenze Fiscali</h3>
            </div>
            <p className="text-sm text-gray-600">Gestisci le scadenze di questo cliente</p>
          </Link>
          
          <a 
            href={`${process.env.NEXT_PUBLIC_API_URL}/export/movimenti?clienteId=${clienteId}&anno=${anno}&format=excel`}
            className="card hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200"
          >
            <div className="flex items-center gap-3 mb-2">
              <FileText className="text-blue-600" size={24} />
              <h3 className="font-semibold text-gray-900">Estratto Conto</h3>
            </div>
            <p className="text-sm text-gray-600">Esporta report completo Excel</p>
          </a>
        </div>
      </div>
    </>
  );
}
