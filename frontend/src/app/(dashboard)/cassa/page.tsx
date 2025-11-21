'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { movimentiAPI, clientiAPI, serviziAPI } from '@/lib/api';
import Header from '@/components/Layout/Header';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown, Euro, Download, Plus, Edit, Trash2, Briefcase, Info } from 'lucide-react';
import { TipoMovimento } from '@/lib/types';

export default function CassaPage() {
  const queryClient = useQueryClient();
  const [tipo, setTipo] = useState<TipoMovimento | undefined>();
  const [mese, setMese] = useState(new Date().getMonth() + 1);
  const [anno, setAnno] = useState(new Date().getFullYear());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isServizioModalOpen, setIsServizioModalOpen] = useState(false);
  const [editingMovimento, setEditingMovimento] = useState<any>(null);
  const [selectedCliente, setSelectedCliente] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    dataMovimento: format(new Date(), 'yyyy-MM-dd'),
    tipo: 'ENTRATA' as TipoMovimento,
    importo: 0,
    descrizione: '',
    categoria: '',
    clienteId: null as number | null,
    spesaInterna: false,
    imponibile: 0,
    iva: 0,
    ritenuta: 0,
    totale: 0,
  });

  const { data: movimenti, isLoading } = useQuery({
    queryKey: ['movimenti', { tipo, mese, anno }],
    queryFn: async () => {
      const response = await movimentiAPI.getAll({ tipo, mese, anno });
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minuti - movimenti cambiano più spesso
    cacheTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: summary } = useQuery({
    queryKey: ['movimenti-summary', { tipo, mese, anno }],
    queryFn: async () => {
      const response = await movimentiAPI.getSummary({ tipo, mese, anno });
      return response.data;
    },
    staleTime: 2 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
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

  const { data: servizi } = useQuery({
    queryKey: ['servizi-attivi'],
    queryFn: async () => {
      const response = await serviziAPI.getAll(true);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => movimentiAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movimenti'] });
      queryClient.invalidateQueries({ queryKey: ['movimenti-summary'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-kpi'] });
      resetForm();
    },
    onError: (error: any) => {
      console.error('❌ Errore creazione movimento:', error);
      console.error('❌ Response:', error.response?.data);
      console.error('❌ Status:', error.response?.status);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => movimentiAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movimenti'] });
      queryClient.invalidateQueries({ queryKey: ['movimenti-summary'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-kpi'] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => movimentiAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movimenti'] });
      queryClient.invalidateQueries({ queryKey: ['movimenti-summary'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-kpi'] });
    },
  });

  // CALCOLO AUTOMATICO IVA E RITENUTA QUANDO CAMBIO IMPORTO O CLIENTE
  useEffect(() => {
    if (formData.importo > 0) {
      if (formData.spesaInterna) {
        // Per spese interne: nessun calcolo fiscale
        setFormData(prev => ({
          ...prev,
          imponibile: prev.importo,
          iva: 0,
          ritenuta: 0,
          totale: prev.importo,
        }));
      } else if (selectedCliente) {
        // Per clienti: calcola IVA e Ritenuta
        calcolaFiscale(formData.importo, selectedCliente);
      }
    }
  }, [formData.importo, formData.spesaInterna, selectedCliente]);

  const calcolaFiscale = (importoLordo: number, cliente: any) => {
    // Validazione input
    if (!importoLordo || isNaN(importoLordo) || !cliente) {
      return;
    }

    let imponibile = importoLordo;
    let iva = 0;
    let ritenuta = 0;
    let totale = importoLordo;

    // CALCOLO IVA
    if (cliente.soggettoIva && !cliente.esenteIva && cliente.aliquotaIva) {
      // Se è soggetto a IVA, scorporo l'IVA dall'importo lordo
      const divisore = 1 + (cliente.aliquotaIva / 100);
      imponibile = importoLordo / divisore;
      iva = importoLordo - imponibile;
    } else {
      // Esente IVA - tutto è imponibile
      imponibile = importoLordo;
      iva = 0;
    }

    // CALCOLO RITENUTA (su imponibile)
    if (cliente.soggettoRitenuta && !cliente.esenteRitenuta && cliente.aliquotaRitenuta) {
      ritenuta = imponibile * (cliente.aliquotaRitenuta / 100);
    } else {
      ritenuta = 0;
    }

    // TOTALE NETTO (per entrate: totale - ritenuta)
    if (formData.tipo === 'ENTRATA') {
      totale = importoLordo - ritenuta;
    } else {
      totale = importoLordo;
    }

    // Validazione output: converti solo se sono numeri validi
    const toSafeNumber = (val: any) => {
      const num = parseFloat(val);
      return isNaN(num) || !isFinite(num) ? 0 : parseFloat(num.toFixed(2));
    };

    setFormData(prev => ({
      ...prev,
      imponibile: toSafeNumber(imponibile),
      iva: toSafeNumber(iva),
      ritenuta: toSafeNumber(ritenuta),
      totale: toSafeNumber(totale),
    }));
  };

  const handleClienteChange = (clienteId: string) => {
    const id = clienteId ? parseInt(clienteId) : null;
    setFormData(prev => ({ ...prev, clienteId: id }));
    
    if (id) {
      const cliente = clienti?.find((c: any) => c.id === id);
      setSelectedCliente(cliente);
      
      // Ricalcola se c'è già un importo
      if (formData.importo > 0) {
        calcolaFiscale(formData.importo, cliente);
      }
    } else {
      setSelectedCliente(null);
      setFormData(prev => ({
        ...prev,
        imponibile: prev.importo,
        iva: 0,
        ritenuta: 0,
        totale: prev.importo,
      }));
    }
  };

  const handleServizioSelect = (servizio: any) => {
    if (!selectedCliente) {
      alert('Seleziona prima un cliente!');
      return;
    }

    // Calcola automaticamente con le regole fiscali del cliente
    let importo = servizio.importo;
    
    // Se il servizio ha già IVA inclusa e il cliente è soggetto a IVA
    if (servizio.applicaIva && selectedCliente.soggettoIva && !selectedCliente.esenteIva) {
      const ivaServizio = importo * (servizio.aliquotaIva / 100);
      importo = importo + ivaServizio;
    }

    setFormData(prev => ({
      ...prev,
      descrizione: servizio.nome + (servizio.descrizione ? ` - ${servizio.descrizione}` : ''),
      categoria: servizio.categoria || '',
      importo: importo,
    }));

    calcolaFiscale(importo, selectedCliente);
    setIsServizioModalOpen(false);
  };

  const resetForm = () => {
    setFormData({
      dataMovimento: format(new Date(), 'yyyy-MM-dd'),
      tipo: 'ENTRATA' as TipoMovimento,
      importo: 0,
      descrizione: '',
      categoria: '',
      clienteId: null,
      spesaInterna: false,
      imponibile: 0,
      iva: 0,
      ritenuta: 0,
      totale: 0,
    });
    setSelectedCliente(null);
    setEditingMovimento(null);
    setIsModalOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔍 [CASSA] Form submitted, formData:', formData);
    
    // Validazioni
    if (!formData.spesaInterna && !formData.clienteId) {
      alert('⚠️ Seleziona un cliente o marca come spesa interna!');
      return;
    }
    
    if (!formData.importo || formData.importo <= 0) {
      alert('⚠️ L\'importo deve essere maggiore di zero!');
      return;
    }
    
    if (!formData.descrizione || formData.descrizione.trim() === '') {
      alert('⚠️ Inserisci una descrizione!');
      return;
    }
    
    // Trasforma i dati nel formato atteso dal backend
    const payload: any = {
      dataMovimento: formData.dataMovimento,
      tipo: formData.tipo,
      descrizione: formData.descrizione,
      importo: parseFloat(formData.importo.toString()),
      categoria: formData.categoria || '',
      spesaInterna: formData.spesaInterna || false,
      imponibile: parseFloat(formData.imponibile.toString()) || formData.importo,
      importoIva: parseFloat(formData.iva.toString()) || 0,
      importoRitenuta: parseFloat(formData.ritenuta.toString()) || 0,
    };
    
    // Se non è spesa interna, aggiungi clienteId
    if (!formData.spesaInterna && formData.clienteId) {
      payload.clienteId = formData.clienteId;
    }
    
    console.log('📤 [CASSA] Payload to backend:', payload);
    
    if (editingMovimento) {
      console.log('✏️ [CASSA] Updating movimento:', editingMovimento.id);
      updateMutation.mutate({ id: editingMovimento.id, data: payload });
    } else {
      console.log('➕ [CASSA] Creating new movimento');
      createMutation.mutate(payload);
    }
  };

  const handleEdit = (movimento: any) => {
    setEditingMovimento(movimento);
    const cliente = clienti?.find((c: any) => c.id === movimento.clienteId);
    setSelectedCliente(cliente);
    
    setFormData({
      dataMovimento: format(new Date(movimento.dataMovimento), 'yyyy-MM-dd'),
      tipo: movimento.tipo,
      importo: movimento.importo,
      descrizione: movimento.descrizione,
      categoria: movimento.categoria || '',
      clienteId: movimento.clienteId || null,
      spesaInterna: movimento.spesaInterna || false,
      imponibile: movimento.imponibile || 0,
      iva: movimento.importoIva || 0,  // Backend usa importoIva
      ritenuta: movimento.importoRitenuta || 0,  // Backend usa importoRitenuta
      totale: movimento.totale || movimento.importo,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Sei sicuro di voler eliminare questo movimento?')) {
      deleteMutation.mutate(id);
    }
  };

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
        {/* Banner Informativo */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                <Info className="w-7 h-7 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-green-900 mb-2 flex items-center gap-2">
                💰 Guida Rapida - Flussi di Cassa
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <span className="font-bold text-green-700">➕ Nuovo Movimento:</span>
                  <p className="text-gray-600 mt-1">Clicca "Nuovo Movimento" per registrare un'entrata o uscita. IVA e Ritenuta vengono calcolate automaticamente!</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <span className="font-bold text-purple-700">🏢 Spese Studio:</span>
                  <p className="text-gray-600 mt-1">Seleziona "Studio (spese interne)" per registrare spese dello studio (affitto, software, ecc.)</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <span className="font-bold text-blue-700">📋 Servizi Predefiniti:</span>
                  <p className="text-gray-600 mt-1">Dopo aver scelto un cliente, clicca "Genera da Servizio" per usare un servizio pre-configurato</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <span className="font-bold text-orange-700">🔍 Filtri:</span>
                  <p className="text-gray-600 mt-1">Usa i filtri per Tipo (Entrate/Uscite), Mese e Anno per trovare rapidamente i movimenti</p>
                </div>
              </div>
            </div>
          </div>
        </div>

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

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn btn-primary flex items-center gap-2"
              >
                <Plus size={18} />
                Nuovo Movimento
              </button>

            <a
              href={`${process.env.NEXT_PUBLIC_API_URL}/export/movimenti?format=excel&mese=${mese}&anno=${anno}`}
              className="btn btn-secondary flex items-center gap-2"
            >
              <Download size={18} />
              Esporta Excel
            </a>
            </div>
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
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Descrizione</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Fiscale</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Imponibile</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">IVA</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Totale</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Azioni</th>
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
                        {movimento.spesaInterna ? (
                          <span className="inline-flex items-center gap-1 text-purple-700 font-medium">
                            🏢 Studio (spesa interna)
                          </span>
                        ) : movimento.cliente ? (
                          movimento.cliente.ragioneSociale || `${movimento.cliente.nome} ${movimento.cliente.cognome}`
                        ) : (
                          'Studio'
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        <div>{movimento.descrizione}</div>
                        {movimento.categoria && (
                          <span className="text-xs text-gray-500">{movimento.categoria}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-xs">
                        {movimento.importoIva > 0 && (
                          <span className="badge badge-info mr-1">IVA {formatCurrency(movimento.importoIva)}</span>
                        )}
                        {movimento.importoRitenuta > 0 && (
                          <span className="badge badge-warning">RA {formatCurrency(movimento.importoRitenuta)}</span>
                        )}
                        {(!movimento.importoIva || movimento.importoIva === 0) && (!movimento.importoRitenuta || movimento.importoRitenuta === 0) && (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-right font-medium text-gray-700">
                        {formatCurrency(movimento.imponibile || movimento.importo)}
                      </td>
                      <td className="py-3 px-4 text-sm text-right font-medium text-blue-600">
                        {formatCurrency(movimento.importoIva || 0)}
                      </td>
                      <td className={`py-3 px-4 text-sm text-right font-bold ${
                        movimento.tipo === 'ENTRATA' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {movimento.tipo === 'ENTRATA' ? '+' : '-'} {formatCurrency(movimento.totale || movimento.importo)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(movimento)}
                            className="text-blue-600 hover:text-blue-700 p-1"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(movimento.id)}
                            className="text-red-600 hover:text-red-700 p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Nessun movimento trovato</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn btn-primary inline-flex items-center gap-2"
              >
                <Plus size={18} />
                Crea il primo movimento
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal Crea/Modifica Movimento */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                {editingMovimento ? '✏️ Modifica Movimento' : '➕ Nuovo Movimento'}
              </h2>
              <div className="mt-3 p-3 bg-white rounded-lg border-2 border-blue-200">
                <p className="text-sm font-medium text-blue-900 mb-1">💡 Come funziona:</p>
                <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                  <li><strong>Scegli il cliente:</strong> IVA e Ritenuta verranno calcolate automaticamente</li>
                  <li><strong>Spesa Studio:</strong> Seleziona "Studio (spese interne)" per spese non legate a clienti</li>
                  <li><strong>Servizi Predefiniti:</strong> Dopo aver scelto un cliente, puoi caricare un servizio pre-configurato</li>
                </ul>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data *</label>
                  <input
                    type="date"
                    value={formData.dataMovimento}
                    onChange={(e) => setFormData({ ...formData, dataMovimento: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo *</label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value as TipoMovimento })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="ENTRATA">Entrata</option>
                    <option value="USCITA">Uscita</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cliente {!formData.spesaInterna && '*'}
                </label>
                <select
                  value={formData.spesaInterna ? 'STUDIO' : (formData.clienteId || '')}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === 'STUDIO') {
                      setFormData(prev => ({ ...prev, spesaInterna: true, clienteId: null }));
                      setSelectedCliente(null);
                    } else {
                      handleClienteChange(value);
                      setFormData(prev => ({ ...prev, spesaInterna: false }));
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={!formData.spesaInterna}
                >
                  <option value="">Seleziona cliente...</option>
                  <option value="STUDIO">🏢 Studio (spese interne)</option>
                  {clienti?.map((cliente: any) => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.ragioneSociale || `${cliente.nome} ${cliente.cognome}`}
                      {cliente.soggettoIva && ' • IVA'}
                      {cliente.soggettoRitenuta && ' • RA'}
                    </option>
                  ))}
                </select>
                
                {formData.spesaInterna && (
                  <div className="mt-2 p-3 bg-purple-50 rounded-lg text-sm">
                    <p className="font-medium text-purple-900">💼 Spesa Interna Studio</p>
                    <p className="text-xs text-purple-700 mt-1">
                      Non collegata a nessun cliente (es. affitto, software, carburante, ecc.)
                    </p>
                  </div>
                )}
                
                {selectedCliente && !formData.spesaInterna && (
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg text-sm">
                    <p className="font-medium text-blue-900">Impostazioni fiscali cliente:</p>
                    <div className="mt-1 space-y-1 text-blue-700">
                      {selectedCliente.soggettoIva && !selectedCliente.esenteIva && (
                        <span className="badge badge-info mr-2">IVA {selectedCliente.aliquotaIva}%</span>
                      )}
                      {selectedCliente.esenteIva && (
                        <span className="badge badge-info mr-2">Esente IVA</span>
                      )}
                      {selectedCliente.soggettoRitenuta && !selectedCliente.esenteRitenuta && (
                        <span className="badge badge-warning">Ritenuta {selectedCliente.aliquotaRitenuta}%</span>
                      )}
                      {selectedCliente.esenteRitenuta && (
                        <span className="badge badge-warning">Esente Ritenuta</span>
                      )}
                    </div>
                  </div>
                )}

                {formData.clienteId && !formData.spesaInterna && (
                  <button
                    type="button"
                    onClick={() => setIsServizioModalOpen(true)}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                  >
                    <Briefcase size={14} />
                    Genera da Servizio Predefinito
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                <input
                  type="text"
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  placeholder="Es. Consulenza, Visure, Spese generali..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrizione *</label>
                <textarea
                  value={formData.descrizione}
                  onChange={(e) => setFormData({ ...formData, descrizione: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Euro size={18} className="text-blue-600" />
                  Importo e Calcoli Fiscali Automatici
                </h3>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Importo Lordo (€) *
                    </label>
                    <input
                      type="number"
                      value={formData.importo}
                      onChange={(e) => setFormData({ ...formData, importo: parseFloat(e.target.value) || 0 })}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-lg"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Importo totale della fattura/documento</p>
                  </div>

                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Totale Netto da Ricevere/Pagare</p>
                      <p className="text-3xl font-bold text-green-600">
                        {formatCurrency(formData.totale)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-blue-200">
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1">Imponibile</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(formData.imponibile)}
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1">IVA</p>
                    <p className="text-lg font-semibold text-blue-600">
                      {formatCurrency(formData.iva)}
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1">Ritenuta</p>
                    <p className="text-lg font-semibold text-amber-600">
                      {formatCurrency(formData.ritenuta)}
                    </p>
                  </div>
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
                  {createMutation.isPending || updateMutation.isPending ? 'Salvataggio...' : 'Salva Movimento'}
                </button>
              </div>

              {(createMutation.isError || updateMutation.isError) && (
                <div className="bg-red-50 border-2 border-red-300 text-red-800 px-4 py-3 rounded-lg">
                  <p className="font-bold mb-1">❌ Errore durante il salvataggio</p>
                  <p className="text-sm">
                    {createMutation.error?.message || updateMutation.error?.message || 'Verifica che tutti i campi obbligatori siano compilati'}
                  </p>
                  {(createMutation.error || updateMutation.error) && (
                    <details className="mt-2 text-xs">
                      <summary className="cursor-pointer font-medium">Dettagli tecnici</summary>
                      <pre className="mt-1 p-2 bg-red-100 rounded overflow-auto">
                        {JSON.stringify(createMutation.error || updateMutation.error, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Modal Selezione Servizio */}
      {isServizioModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Seleziona Servizio Predefinito</h2>
              <p className="text-sm text-gray-600 mt-1">
                Il servizio verrà adattato automaticamente alle regole fiscali del cliente selezionato
              </p>
            </div>

            <div className="p-6 space-y-3">
              {servizi && servizi.length > 0 ? (
                servizi.map((servizio: any) => (
                  <div
                    key={servizio.id}
                    onClick={() => handleServizioSelect(servizio)}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{servizio.nome}</h3>
                        {servizio.descrizione && (
                          <p className="text-sm text-gray-600 mt-1">{servizio.descrizione}</p>
                        )}
                        {servizio.categoria && (
                          <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                            {servizio.categoria}
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-blue-600">
                          {formatCurrency(servizio.importo)}
                        </p>
                        <div className="mt-1 text-xs space-x-1">
                          {servizio.applicaIva && (
                            <span className="badge badge-info">IVA {servizio.aliquotaIva}%</span>
                          )}
                          {servizio.applicaRitenuta && (
                            <span className="badge badge-warning">RA {servizio.aliquotaRitenuta}%</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">Nessun servizio disponibile</p>
              )}
            </div>

            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setIsServizioModalOpen(false)}
                className="btn btn-secondary w-full"
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
