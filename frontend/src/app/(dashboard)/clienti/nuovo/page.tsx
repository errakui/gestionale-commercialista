'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { clientiAPI } from '@/lib/api';
import Header from '@/components/Layout/Header';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { TipoCliente, PeriodicitaIva } from '@/lib/types';

export default function NuovoClientePage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    tipoCliente: TipoCliente.PRIVATO,
    ragioneSociale: '',
    nome: '',
    cognome: '',
    codiceFiscale: '',
    partitaIva: '',
    indirizzo: '',
    cap: '',
    citta: '',
    provincia: '',
    email: '',
    pec: '',
    telefono: '',
    regimeFiscale: '',
    periodicitaIva: PeriodicitaIva.NESSUNA,
    haImmobili: false,
    // Campi fiscali
    esenteIva: false,
    soggettoIva: true,
    aliquotaIva: 22,
    esenteRitenuta: true,
    soggettoRitenuta: false,
    aliquotaRitenuta: 20,
    attivo: true,
    noteInterne: '',
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => clientiAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clienti'] });
      router.push('/clienti');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <Header title="Nuovo Cliente" />
      
      <div className="p-8">
        <div className="mb-6">
          <Link href="/clienti" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 w-fit">
            <ArrowLeft size={18} />
            Torna alla lista
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-8">
          {/* Dati Anagrafici */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Dati Anagrafici</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo Cliente *
                </label>
                <select
                  value={formData.tipoCliente}
                  onChange={(e) => handleChange('tipoCliente', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value={TipoCliente.PRIVATO}>Privato</option>
                  <option value={TipoCliente.DITTA_INDIVIDUALE}>Ditta Individuale</option>
                  <option value={TipoCliente.LIBERO_PROF}>Libero Professionista</option>
                  <option value={TipoCliente.SRL}>SRL</option>
                  <option value={TipoCliente.SNC}>SNC</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ragione Sociale
                </label>
                <input
                  type="text"
                  value={formData.ragioneSociale}
                  onChange={(e) => handleChange('ragioneSociale', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => handleChange('nome', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cognome</label>
                <input
                  type="text"
                  value={formData.cognome}
                  onChange={(e) => handleChange('cognome', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Codice Fiscale</label>
                <input
                  type="text"
                  value={formData.codiceFiscale}
                  onChange={(e) => handleChange('codiceFiscale', e.target.value.toUpperCase())}
                  maxLength={16}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Partita IVA</label>
                <input
                  type="text"
                  value={formData.partitaIva}
                  onChange={(e) => handleChange('partitaIva', e.target.value)}
                  maxLength={11}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">PEC</label>
                <input
                  type="email"
                  value={formData.pec}
                  onChange={(e) => handleChange('pec', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefono</label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => handleChange('telefono', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Indirizzo</label>
                <input
                  type="text"
                  value={formData.indirizzo}
                  onChange={(e) => handleChange('indirizzo', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CAP</label>
                  <input
                    type="text"
                    value={formData.cap}
                    onChange={(e) => handleChange('cap', e.target.value)}
                    maxLength={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Città</label>
                  <input
                    type="text"
                    value={formData.citta}
                    onChange={(e) => handleChange('citta', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Provincia</label>
                <input
                  type="text"
                  value={formData.provincia}
                  onChange={(e) => handleChange('provincia', e.target.value.toUpperCase())}
                  maxLength={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Dati Fiscali */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Dati Fiscali</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Regime Fiscale</label>
                <input
                  type="text"
                  value={formData.regimeFiscale}
                  onChange={(e) => handleChange('regimeFiscale', e.target.value)}
                  placeholder="Es. Regime Forfettario, Regime Ordinario"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Periodicità IVA *
                </label>
                <select
                  value={formData.periodicitaIva}
                  onChange={(e) => handleChange('periodicitaIva', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value={PeriodicitaIva.NESSUNA}>Nessuna</option>
                  <option value={PeriodicitaIva.MENSILE}>Mensile</option>
                  <option value={PeriodicitaIva.TRIMESTRALE}>Trimestrale</option>
                </select>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.haImmobili}
                    onChange={(e) => handleChange('haImmobili', e.target.checked)}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Ha Immobili (IMU)</span>
                </label>
              </div>
            </div>

            {/* Sezione IVA */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-4">Gestione IVA</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.soggettoIva}
                      onChange={(e) => handleChange('soggettoIva', e.target.checked)}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Soggetto a IVA</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.esenteIva}
                      onChange={(e) => handleChange('esenteIva', e.target.checked)}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Esente IVA</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aliquota IVA (%)
                  </label>
                  <input
                    type="number"
                    value={formData.aliquotaIva}
                    onChange={(e) => handleChange('aliquotaIva', parseFloat(e.target.value))}
                    min="0"
                    max="100"
                    step="0.01"
                    disabled={formData.esenteIva || !formData.soggettoIva}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* Sezione Ritenuta d'Acconto */}
            <div className="mt-4 p-4 bg-amber-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-4">Ritenuta d&apos;Acconto</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.soggettoRitenuta}
                      onChange={(e) => handleChange('soggettoRitenuta', e.target.checked)}
                      className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-2 focus:ring-amber-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Soggetto a Ritenuta</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.esenteRitenuta}
                      onChange={(e) => handleChange('esenteRitenuta', e.target.checked)}
                      className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-2 focus:ring-amber-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Esente Ritenuta</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aliquota Ritenuta (%)
                  </label>
                  <input
                    type="number"
                    value={formData.aliquotaRitenuta}
                    onChange={(e) => handleChange('aliquotaRitenuta', parseFloat(e.target.value))}
                    min="0"
                    max="100"
                    step="0.01"
                    disabled={formData.esenteRitenuta || !formData.soggettoRitenuta}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-gray-100"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Note Interne */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Note Interne</h3>
            <textarea
              value={formData.noteInterne}
              onChange={(e) => handleChange('noteInterne', e.target.value)}
              rows={4}
              placeholder="Note riservate allo studio..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Azioni */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t">
            <Link href="/clienti" className="btn btn-secondary">
              Annulla
            </Link>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="btn btn-primary flex items-center gap-2"
            >
              {createMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Salvataggio...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Salva Cliente
                </>
              )}
            </button>
          </div>

          {createMutation.isError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              Errore durante il salvataggio. Riprova.
            </div>
          )}
        </form>
      </div>
    </>
  );
}

