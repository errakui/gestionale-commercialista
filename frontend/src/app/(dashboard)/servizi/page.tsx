'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviziAPI } from '@/lib/api';
import Header from '@/components/Layout/Header';
import { Plus, Edit, Trash2, DollarSign } from 'lucide-react';

export default function ServiziPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingServizio, setEditingServizio] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    nome: '',
    descrizione: '',
    importo: 0,
    categoria: '',
    applicaIva: true,
    aliquotaIva: 22,
    applicaRitenuta: false,
    aliquotaRitenuta: 20,
  });

  const { data: servizi, isLoading } = useQuery({
    queryKey: ['servizi'],
    queryFn: async () => {
      const response = await serviziAPI.getAll(true);
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => serviziAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servizi'] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => serviziAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servizi'] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => serviziAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servizi'] });
    },
  });

  const resetForm = () => {
    setFormData({
      nome: '',
      descrizione: '',
      importo: 0,
      categoria: '',
      applicaIva: true,
      aliquotaIva: 22,
      applicaRitenuta: false,
      aliquotaRitenuta: 20,
    });
    setEditingServizio(null);
    setIsModalOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingServizio) {
      updateMutation.mutate({ id: editingServizio.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (servizio: any) => {
    setEditingServizio(servizio);
    setFormData({
      nome: servizio.nome,
      descrizione: servizio.descrizione || '',
      importo: servizio.importo,
      categoria: servizio.categoria || '',
      applicaIva: servizio.applicaIva,
      aliquotaIva: servizio.aliquotaIva,
      applicaRitenuta: servizio.applicaRitenuta,
      aliquotaRitenuta: servizio.aliquotaRitenuta,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Sei sicuro di voler eliminare questo servizio?')) {
      deleteMutation.mutate(id);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };

  return (
    <>
      <Header title="Servizi Predefiniti" />
      
      <div className="p-8">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Gestione Servizi</h2>
              <p className="text-sm text-gray-600 mt-1">
                Crea servizi predefiniti per generare rapidamente movimenti con calcoli fiscali automatici
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn btn-primary flex items-center gap-2"
            >
              <Plus size={18} />
              Nuovo Servizio
            </button>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Caricamento...</p>
            </div>
          ) : servizi && servizi.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {servizi.map((servizio: any) => (
                <div key={servizio.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{servizio.nome}</h3>
                      {servizio.categoria && (
                        <span className="inline-block mt-1 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                          {servizio.categoria}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(servizio)}
                        className="text-blue-600 hover:text-blue-700 p-1"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(servizio.id)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {servizio.descrizione && (
                    <p className="text-sm text-gray-600 mb-3">{servizio.descrizione}</p>
                  )}

                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <p className="text-2xl font-bold text-blue-600 mb-2">
                      {formatCurrency(servizio.importo)}
                    </p>

                    <div className="space-y-1 text-xs text-gray-600">
                      {servizio.applicaIva && (
                        <div className="flex items-center justify-between">
                          <span>IVA {servizio.aliquotaIva}%</span>
                          <span className="font-medium">
                            {formatCurrency((servizio.importo * servizio.aliquotaIva) / 100)}
                          </span>
                        </div>
                      )}
                      {servizio.applicaRitenuta && (
                        <div className="flex items-center justify-between">
                          <span>Ritenuta {servizio.aliquotaRitenuta}%</span>
                          <span className="font-medium">
                            {formatCurrency((servizio.importo * servizio.aliquotaRitenuta) / 100)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <DollarSign size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 mb-4">Nessun servizio creato</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn btn-primary inline-flex items-center gap-2"
              >
                <Plus size={18} />
                Crea il primo servizio
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal Crea/Modifica */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingServizio ? 'Modifica Servizio' : 'Nuovo Servizio'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome Servizio *</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrizione</label>
                <textarea
                  value={formData.descrizione}
                  onChange={(e) => setFormData({ ...formData, descrizione: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Importo Base (€) *</label>
                  <input
                    type="number"
                    value={formData.importo}
                    onChange={(e) => setFormData({ ...formData, importo: parseFloat(e.target.value) })}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                  <input
                    type="text"
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    placeholder="Es. Visure, Pratiche..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-4 mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.applicaIva}
                      onChange={(e) => setFormData({ ...formData, applicaIva: e.target.checked })}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Applica IVA</span>
                  </label>

                  {formData.applicaIva && (
                    <div className="flex-1">
                      <input
                        type="number"
                        value={formData.aliquotaIva}
                        onChange={(e) => setFormData({ ...formData, aliquotaIva: parseFloat(e.target.value) })}
                        min="0"
                        max="100"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-lg">
                <div className="flex items-center gap-4 mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.applicaRitenuta}
                      onChange={(e) => setFormData({ ...formData, applicaRitenuta: e.target.checked })}
                      className="w-5 h-5 text-amber-600 border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Applica Ritenuta</span>
                  </label>

                  {formData.applicaRitenuta && (
                    <div className="flex-1">
                      <input
                        type="number"
                        value={formData.aliquotaRitenuta}
                        onChange={(e) => setFormData({ ...formData, aliquotaRitenuta: parseFloat(e.target.value) })}
                        min="0"
                        max="100"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn btn-secondary"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="btn btn-primary"
                >
                  {createMutation.isPending || updateMutation.isPending ? 'Salvataggio...' : 'Salva'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

