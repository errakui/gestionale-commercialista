'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { impostazioniAPI } from '@/lib/api';
import Header from '@/components/Layout/Header';
import { Settings, Calendar, Tag, Save, Edit } from 'lucide-react';

export default function ImpostazioniPage() {
  const queryClient = useQueryClient();
  const [isEditingGenerali, setIsEditingGenerali] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formGenerali, setFormGenerali] = useState({
    nomeStudio: '',
    timezone: '',
    formatoData: '',
    valuta: '',
    giorniScadenzeImminenti: 7,
  });

  const { data: generali, isLoading: loadingGenerali } = useQuery({
    queryKey: ['impostazioni-generali'],
    queryFn: async () => {
      const response = await impostazioniAPI.getGenerali();
      if (response.data) {
        setFormGenerali({
          nomeStudio: response.data.nomeStudio || '',
          timezone: response.data.timezone || '',
          formatoData: response.data.formatoData || '',
          valuta: response.data.valuta || '',
          giorniScadenzeImminenti: response.data.giorniScadenzeImminenti || 7,
        });
      }
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

  const updateGeneraliMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await impostazioniAPI.updateGenerali(data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['impostazioni-generali'] });
      setIsEditingGenerali(false);
      
      // Mostra messaggio di successo
      setSuccessMessage('✅ Impostazioni salvate con successo nel database!');
      setTimeout(() => setSuccessMessage(''), 3000);
    },
    onError: (error: any) => {
      alert('❌ Errore nel salvataggio: ' + (error.response?.data?.message || error.message));
    },
  });

  const handleSaveGenerali = () => {
    updateGeneraliMutation.mutate(formGenerali);
  };

  return (
    <>
      <Header title="Impostazioni" />
      
      <div className="p-8 space-y-6">
        {/* Messaggio di Successo */}
        {successMessage && (
          <div className="bg-green-50 border-2 border-green-500 text-green-800 px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 animate-slide-up">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-semibold">{successMessage}</span>
          </div>
        )}

        {/* Impostazioni Generali - MODIFICABILI */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Settings size={24} className="text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Impostazioni Generali</h2>
            </div>

            {!isEditingGenerali ? (
              <button
                onClick={() => setIsEditingGenerali(true)}
                className="btn btn-primary flex items-center gap-2"
              >
                <Edit size={18} />
                Modifica
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsEditingGenerali(false);
                    // Ripristina valori originali
                    if (generali) {
                      setFormGenerali({
                        nomeStudio: generali.nomeStudio || '',
                        timezone: generali.timezone || '',
                        formatoData: generali.formatoData || '',
                        valuta: generali.valuta || '',
                        giorniScadenzeImminenti: generali.giorniScadenzeImminenti || 7,
                      });
                    }
                  }}
                  className="btn btn-secondary"
                >
                  Annulla
                </button>
                <button
                  onClick={handleSaveGenerali}
                  disabled={updateGeneraliMutation.isPending}
                  className="btn btn-primary flex items-center gap-2"
                >
                  {updateGeneraliMutation.isPending ? (
                    <>
                      <div className="spinner w-4 h-4"></div>
                      Salvataggio...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Salva
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {loadingGenerali ? (
            <div className="text-center py-8">
              <div className="spinner w-8 h-8 mx-auto"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nome Studio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Studio
                </label>
                {isEditingGenerali ? (
                  <input
                    type="text"
                    value={formGenerali.nomeStudio}
                    onChange={(e) => setFormGenerali({ ...formGenerali, nomeStudio: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Es. Studio Commercialista Rossi"
                  />
                ) : (
                  <p className="font-medium text-gray-900 px-4 py-2 bg-gray-50 rounded-lg">
                    {formGenerali.nomeStudio || 'Studio Commercialista'}
                  </p>
                )}
              </div>

              {/* Timezone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timezone
                </label>
                {isEditingGenerali ? (
                  <select
                    value={formGenerali.timezone}
                    onChange={(e) => setFormGenerali({ ...formGenerali, timezone: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Europe/Rome">Europe/Rome</option>
                    <option value="Europe/London">Europe/London</option>
                    <option value="Europe/Paris">Europe/Paris</option>
                    <option value="America/New_York">America/New_York</option>
                  </select>
                ) : (
                  <p className="font-medium text-gray-900 px-4 py-2 bg-gray-50 rounded-lg">
                    {formGenerali.timezone || 'Europe/Rome'}
                  </p>
                )}
              </div>

              {/* Formato Data */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Formato Data
                </label>
                {isEditingGenerali ? (
                  <select
                    value={formGenerali.formatoData}
                    onChange={(e) => setFormGenerali({ ...formGenerali, formatoData: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                ) : (
                  <p className="font-medium text-gray-900 px-4 py-2 bg-gray-50 rounded-lg">
                    {formGenerali.formatoData || 'DD/MM/YYYY'}
                  </p>
                )}
              </div>

              {/* Valuta */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valuta
                </label>
                {isEditingGenerali ? (
                  <select
                    value={formGenerali.valuta}
                    onChange={(e) => setFormGenerali({ ...formGenerali, valuta: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="EUR">EUR (€)</option>
                    <option value="USD">USD ($)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                ) : (
                  <p className="font-medium text-gray-900 px-4 py-2 bg-gray-50 rounded-lg">
                    {formGenerali.valuta || 'EUR'}
                  </p>
                )}
              </div>

              {/* Giorni Scadenze Imminenti */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giorni Scadenze Imminenti
                </label>
                {isEditingGenerali ? (
                  <input
                    type="number"
                    value={formGenerali.giorniScadenzeImminenti}
                    onChange={(e) => setFormGenerali({ ...formGenerali, giorniScadenzeImminenti: parseInt(e.target.value) })}
                    min="1"
                    max="30"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="font-medium text-gray-900 px-4 py-2 bg-gray-50 rounded-lg">
                    {formGenerali.giorniScadenzeImminenti || 7} giorni
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Numero di giorni per considerare una scadenza "imminente"
                </p>
              </div>
            </div>
          )}
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
                <span key={categoria.id} className="badge badge-info text-sm px-4 py-2">
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
