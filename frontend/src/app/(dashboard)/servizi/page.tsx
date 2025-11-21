'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviziAPI, clientiAPI, movimentiAPI } from '@/lib/api';
import Header from '@/components/Layout/Header';
import { Plus, Edit, Trash2, DollarSign, Users, CheckSquare, Square } from 'lucide-react';

export default function ServiziPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApplicaModal, setIsApplicaModal] = useState(false);
  const [editingServizio, setEditingServizio] = useState<any>(null);
  const [servizioSelezionato, setServizioSelezionato] = useState<any>(null);
  const [clientiSelezionati, setClientiSelezionati] = useState<number[]>([]);
  const [dataMovimento, setDataMovimento] = useState(new Date().toISOString().split('T')[0]);
  
  // ✅ PAGINAZIONE
  const [currentPage, setCurrentPage] = useState(1);
  const SERVIZI_PER_PAGINA = 10;
  
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
    staleTime: 5 * 60 * 1000, // 5 minuti - dati "freschi" per 5 minuti
    cacheTime: 10 * 60 * 1000, // 10 minuti in cache
    refetchOnWindowFocus: false, // Non ricaricare quando torni sulla finestra
  });

  const { data: clienti } = useQuery({
    queryKey: ['clienti-attivi'],
    queryFn: async () => {
      const response = await clientiAPI.getAll({ attivo: true });
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
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

  const applicaServizioMutation = useMutation({
    mutationFn: async ({ servizio, clientiIds, data }: any) => {
      const promises = clientiIds.map(async (clienteId: number) => {
        const cliente = clienti?.find((c: any) => c.id === clienteId);
        if (!cliente) return null;

        // Calcola importo con IVA se necessario
        let importoTotale = servizio.importo;
        let imponibile = servizio.importo;
        let iva = 0;
        let ritenuta = 0;

        // CALCOLO IVA
        if (cliente.soggettoIva && !cliente.esenteIva) {
          iva = (servizio.importo * cliente.aliquotaIva) / 100;
          importoTotale = servizio.importo + iva;
          imponibile = servizio.importo;
        } else {
          imponibile = servizio.importo;
        }

        // CALCOLO RITENUTA (su imponibile)
        if (cliente.soggettoRitenuta && !cliente.esenteRitenuta) {
          ritenuta = (imponibile * cliente.aliquotaRitenuta) / 100;
        }

        // Totale netto
        const totale = importoTotale - ritenuta;

        return movimentiAPI.create({
          dataMovimento: data,
          tipo: 'ENTRATA',
          importo: importoTotale,
          descrizione: `${servizio.nome}${servizio.descrizione ? ' - ' + servizio.descrizione : ''}`,
          categoria: servizio.categoria || 'Servizi',
          clienteId: clienteId,
          imponibile: parseFloat(imponibile.toFixed(2)),
          iva: parseFloat(iva.toFixed(2)),
          ritenuta: parseFloat(ritenuta.toFixed(2)),
          totale: parseFloat(totale.toFixed(2)),
        });
      });

      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movimenti'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-kpi'] });
      setIsApplicaModal(false);
      setClientiSelezionati([]);
      setServizioSelezionato(null);
      alert('✅ Movimenti creati con successo per tutti i clienti selezionati!');
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

  const handleApplicaServizio = (servizio: any) => {
    setServizioSelezionato(servizio);
    setClientiSelezionati([]);
    setDataMovimento(new Date().toISOString().split('T')[0]);
    setIsApplicaModal(true);
  };

  const toggleCliente = (clienteId: number) => {
    setClientiSelezionati(prev => 
      prev.includes(clienteId) 
        ? prev.filter(id => id !== clienteId)
        : [...prev, clienteId]
    );
  };

  const toggleTuttiClienti = () => {
    if (clientiSelezionati.length === clienti?.length) {
      setClientiSelezionati([]);
    } else {
      setClientiSelezionati(clienti?.map((c: any) => c.id) || []);
    }
  };

  const handleConfermaApplicazione = () => {
    if (clientiSelezionati.length === 0) {
      alert('Seleziona almeno un cliente');
      return;
    }

    applicaServizioMutation.mutate({
      servizio: servizioSelezionato,
      clientiIds: clientiSelezionati,
      data: dataMovimento,
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };

  // ✅ CALCOLO PAGINAZIONE
  const totalServizi = servizi?.length || 0;
  const totalPages = Math.ceil(totalServizi / SERVIZI_PER_PAGINA);
  const startIndex = (currentPage - 1) * SERVIZI_PER_PAGINA;
  const endIndex = startIndex + SERVIZI_PER_PAGINA;
  const serviziPaginati = servizi?.slice(startIndex, endIndex) || [];

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
            <>
              {/* Info Paginazione */}
              <div className="mb-4 text-sm text-gray-600">
                Mostrando <strong>{startIndex + 1}</strong> - <strong>{Math.min(endIndex, totalServizi)}</strong> di <strong>{totalServizi}</strong> servizi
                {totalPages > 1 && <span> • Pagina <strong>{currentPage}</strong> di <strong>{totalPages}</strong></span>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {serviziPaginati.map((servizio: any) => (
                <div key={servizio.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all">
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
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm flex items-center gap-1 transition-all"
                        title="Modifica servizio"
                      >
                        <Edit size={14} />
                        Modifica
                      </button>
                      <button
                        onClick={() => handleDelete(servizio.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Elimina servizio"
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

                    <button
                      onClick={() => handleApplicaServizio(servizio)}
                      className="mt-3 w-full btn btn-primary text-sm py-2 flex items-center justify-center gap-2"
                    >
                      <Users size={16} />
                      Applica a Clienti
                    </button>
                  </div>
                </div>
              ))}
            </div>

              {/* Pulsanti Paginazione */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium"
                  >
                    ← Indietro
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-lg font-medium transition-all ${
                          page === currentPage
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium"
                  >
                    Avanti →
                  </button>
                </div>
              )}
            </>
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

      {/* Modal Applica Servizio a Clienti */}
      {isApplicaModal && servizioSelezionato && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Applica Servizio a Clienti
              </h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-blue-700">{servizioSelezionato.nome}</p>
                  <p className="text-sm text-gray-600">{formatCurrency(servizioSelezionato.importo)} base</p>
                </div>
                <div className="text-right">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data Movimento</label>
                  <input
                    type="date"
                    value={dataMovimento}
                    onChange={(e) => setDataMovimento(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-700">
                  Seleziona i clienti a cui applicare questo servizio. 
                  <br />
                  <strong>Il sistema calcolerà automaticamente IVA e Ritenuta</strong> per ogni cliente in base alle sue impostazioni.
                </p>
                <button
                  onClick={toggleTuttiClienti}
                  className="btn btn-secondary text-sm"
                >
                  {clientiSelezionati.length === clienti?.length ? 'Deseleziona Tutti' : 'Seleziona Tutti'}
                </button>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {clienti && clienti.length > 0 ? (
                  clienti.map((cliente: any) => {
                    const isSelected = clientiSelezionati.includes(cliente.id);
                    
                    // Calcola anteprima per questo cliente
                    let importoTotale = servizioSelezionato.importo;
                    let iva = 0;
                    let ritenuta = 0;
                    
                    if (cliente.soggettoIva && !cliente.esenteIva) {
                      iva = (servizioSelezionato.importo * cliente.aliquotaIva) / 100;
                      importoTotale = servizioSelezionato.importo + iva;
                    }
                    
                    if (cliente.soggettoRitenuta && !cliente.esenteRitenuta) {
                      ritenuta = (servizioSelezionato.importo * cliente.aliquotaRitenuta) / 100;
                    }
                    
                    const totale = importoTotale - ritenuta;

                    return (
                      <div
                        key={cliente.id}
                        onClick={() => toggleCliente(cliente.id)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="mt-1">
                              {isSelected ? (
                                <CheckSquare size={20} className="text-blue-600" />
                              ) : (
                                <Square size={20} className="text-gray-400" />
                              )}
                            </div>
                            
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">
                                {cliente.ragioneSociale || `${cliente.nome} ${cliente.cognome}`}
                              </p>
                              
                              <div className="mt-2 flex flex-wrap gap-1">
                                {cliente.soggettoIva && !cliente.esenteIva && (
                                  <span className="badge badge-info text-xs">IVA {cliente.aliquotaIva}%</span>
                                )}
                                {cliente.esenteIva && (
                                  <span className="badge bg-gray-100 text-gray-600 text-xs">Esente IVA</span>
                                )}
                                {cliente.soggettoRitenuta && !cliente.esenteRitenuta && (
                                  <span className="badge badge-warning text-xs">RA {cliente.aliquotaRitenuta}%</span>
                                )}
                                {cliente.esenteRitenuta && (
                                  <span className="badge bg-gray-100 text-gray-600 text-xs">Esente RA</span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="text-right ml-4">
                            <p className="text-xs text-gray-500 mb-1">Anteprima calcolo:</p>
                            <div className="space-y-0.5 text-xs">
                              <div className="flex justify-between gap-4">
                                <span className="text-gray-600">Imponibile:</span>
                                <span className="font-semibold">{formatCurrency(servizioSelezionato.importo)}</span>
                              </div>
                              {iva > 0 && (
                                <div className="flex justify-between gap-4">
                                  <span className="text-blue-600">+ IVA:</span>
                                  <span className="font-semibold text-blue-600">{formatCurrency(iva)}</span>
                                </div>
                              )}
                              {ritenuta > 0 && (
                                <div className="flex justify-between gap-4">
                                  <span className="text-amber-600">- Ritenuta:</span>
                                  <span className="font-semibold text-amber-600">{formatCurrency(ritenuta)}</span>
                                </div>
                              )}
                              <div className="flex justify-between gap-4 pt-1 border-t border-gray-300">
                                <span className="text-gray-900 font-bold">Totale:</span>
                                <span className="font-bold text-green-600">{formatCurrency(totale)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center text-gray-500 py-8">Nessun cliente disponibile</p>
                )}
              </div>

              {clientiSelezionati.length > 0 && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-semibold">
                    ✅ {clientiSelezionati.length} cliente{clientiSelezionati.length > 1 ? 'i selezionati' : ' selezionato'}
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    Verrà creato un movimento di entrata per ogni cliente con calcoli fiscali automatici
                  </p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-4">
              <button
                onClick={() => {
                  setIsApplicaModal(false);
                  setClientiSelezionati([]);
                  setServizioSelezionato(null);
                }}
                className="btn btn-secondary"
              >
                Annulla
              </button>
              <button
                onClick={handleConfermaApplicazione}
                disabled={applicaServizioMutation.isPending || clientiSelezionati.length === 0}
                className="btn btn-primary flex items-center gap-2"
              >
                {applicaServizioMutation.isPending ? (
                  <>
                    <div className="spinner w-4 h-4 border-2 border-white border-t-transparent"></div>
                    Creazione movimenti...
                  </>
                ) : (
                  <>
                    <Users size={18} />
                    Crea {clientiSelezionati.length} Movimento{clientiSelezionati.length > 1 ? 'i' : ''}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

