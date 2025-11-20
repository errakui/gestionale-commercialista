'use client';

import { useQuery } from '@tanstack/react-query';
import { impostazioniAPI } from '@/lib/api';
import Header from '@/components/Layout/Header';
import { Settings, Calendar, Tag } from 'lucide-react';

export default function ImpostazioniPage() {
  const { data: generali } = useQuery({
    queryKey: ['impostazioni-generali'],
    queryFn: async () => {
      const response = await impostazioniAPI.getGenerali();
      return response.data;
    },
  });

  const { data: templates } = useQuery({
    queryKey: ['template-scadenze'],
    queryFn: async () => {
      const response = await impostazioniAPI.getTemplates();
      return response.data;
    },
  });

  const { data: categorie } = useQuery({
    queryKey: ['categorie'],
    queryFn: async () => {
      const response = await impostazioniAPI.getCategorie();
      return response.data;
    },
  });

  return (
    <>
      <Header title="Impostazioni" />
      
      <div className="p-8 space-y-6">
        {/* Impostazioni Generali */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Settings size={24} className="text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Impostazioni Generali</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Nome Studio</p>
              <p className="font-medium text-gray-900">{generali?.nomeStudio}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Timezone</p>
              <p className="font-medium text-gray-900">{generali?.timezone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Formato Data</p>
              <p className="font-medium text-gray-900">{generali?.formatoData}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Valuta</p>
              <p className="font-medium text-gray-900">{generali?.valuta}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Giorni Scadenze Imminenti</p>
              <p className="font-medium text-gray-900">{generali?.giorniScadenzeImminenti}</p>
            </div>
          </div>
        </div>

        {/* Template Scadenze */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Calendar size={24} className="text-purple-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Template Scadenze Fiscali</h2>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Template configurati per la generazione automatica delle scadenze fiscali
          </p>

          {templates && templates.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Codice</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Descrizione</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Ricorrenza</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Applicabile</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Stato</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {templates.map((template: any) => (
                    <tr key={template.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        {template.codiceTemplate}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {template.descrizione}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {template.tipoRicorrenza}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {template.applicabileIvaMensile && <span className="badge badge-info mr-1">IVA Mens.</span>}
                        {template.applicabileIvaTrimestrale && <span className="badge badge-info mr-1">IVA Trim.</span>}
                        {template.applicabileImmobili && <span className="badge badge-info mr-1">Immobili</span>}
                        {template.applicabileTutti && <span className="badge badge-info">Tutti</span>}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`badge ${template.attivo ? 'badge-success' : 'badge-danger'}`}>
                          {template.attivo ? 'Attivo' : 'Disattivo'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Nessun template configurato</p>
          )}
        </div>

        {/* Categorie Movimento */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-50 rounded-lg">
              <Tag size={24} className="text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Categorie Movimento</h2>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Categorie utilizzabili per i movimenti di cassa
          </p>

          {categorie && categorie.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {categorie.map((categoria: any) => (
                <span key={categoria.id} className="badge badge-info">
                  {categoria.nome}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Nessuna categoria configurata</p>
          )}
        </div>
      </div>
    </>
  );
}

