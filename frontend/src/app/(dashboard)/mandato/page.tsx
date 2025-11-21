'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mandatiAPI } from '@/lib/api';
import Header from '@/components/Layout/Header';
import { FileText, Plus, Download, Eye, Trash2, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useState } from 'react';

export default function MandatoPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [mandatoDaEliminare, setMandatoDaEliminare] = useState<number | null>(null);

  const { data: mandati = [], isLoading } = useQuery({
    queryKey: ['mandati'],
    queryFn: async () => {
      const response = await mandatiAPI.getAll();
      return response.data || [];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => mandatiAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mandati'] });
      toast.success('Mandato eliminato con successo');
      setMandatoDaEliminare(null);
    },
    onError: () => {
      toast.error('Errore durante l\'eliminazione');
    },
  });

  const handleDelete = (id: number) => {
    if (confirm('Sei sicuro di voler eliminare questo mandato?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleDownloadPDF = async (mandato: any) => {
    const token = localStorage.getItem('access_token');
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    try {
      const response = await fetch(`${API_URL}/export/mandato`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          datiStudio: {
            nome: 'Studio Commercialista Circhetta Piero',
            piva: '03759730751',
            sede: 'Via N. Sauro, 37 – 73037 Poggiardo (LE)',
            email: 'studio@circhetta.it',
            pec: 'studio@pec.circhetta.it',
          },
          datiCliente: {
            nome: mandato.nomeCliente,
            cfPiva: mandato.cfPivaCliente,
            indirizzo: mandato.indirizzoCliente,
            email: mandato.emailCliente,
            pec: mandato.pecCliente,
          },
          datiMandato: {
            tipoContabilita: mandato.tipoContabilita,
            compenso: mandato.compenso,
            modalitaPagamento: mandato.modalitaPagamento,
            serviziInclusi: mandato.serviziInclusi,
            serviziExtra: mandato.serviziExtra,
            dataInizio: mandato.dataInizio,
            luogoData: mandato.luogoData,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Errore durante l'export: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mandato_${mandato.nomeCliente.replace(/\s+/g, '_')}_${new Date(mandato.createdAt).toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success('PDF scaricato con successo!');
    } catch (err: any) {
      console.error('Errore export mandato:', err);
      toast.error('Errore durante lo scaricamento del PDF.');
    }
  };

  return (
    <>
      <Header title="Mandati di Incarico" />
      
      <div className="p-8">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <FileText size={24} className="text-blue-600" />
              Lista Mandati
            </h2>
            <button
              onClick={() => router.push('/mandato/nuovo')}
              className="btn btn-primary flex items-center gap-2"
            >
              <Plus size={18} />
              Nuovo Mandato
            </button>
          </div>

          {isLoading ? (
            <div className="text-center py-12 text-gray-400">
              <FileText size={48} className="mx-auto mb-4 opacity-50 animate-pulse" />
              <p>Caricamento mandati...</p>
            </div>
          ) : !mandati || mandati.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <FileText size={48} className="mx-auto mb-4 opacity-50" />
              <p className="mb-4">Nessun mandato presente</p>
              <button
                onClick={() => router.push('/mandato/nuovo')}
                className="btn btn-primary inline-flex items-center gap-2"
              >
                <Plus size={18} />
                Crea il primo mandato
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Cliente</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">CF/P.IVA</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Tipo Contabilità</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Compenso</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Data Creazione</th>
                    <th className="py-3 px-4 text-right text-sm font-semibold text-gray-700">Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {mandati.map((mandato: any) => (
                    <tr key={mandato.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900 font-medium">
                        {mandato.nomeCliente}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {mandato.cfPivaCliente}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {mandato.tipoContabilita}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {mandato.compenso}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500 flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(mandato.createdAt).toLocaleDateString('it-IT')}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleDownloadPDF(mandato)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Scarica PDF"
                          >
                            <Download size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(mandato.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Elimina"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
