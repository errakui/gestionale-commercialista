'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientiAPI, mandatiAPI } from '@/lib/api';
import Header from '@/components/Layout/Header';
import { FileText, User, Building2, ArrowLeft, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

// DATI COMMERCIALISTA FISSI
const DATI_STUDIO = {
  nome: 'Studio Commercialista Circhetta Piero',
  piva: '03759730751',
  sede: 'Via N. Sauro, 37 – 73037 Poggiardo (LE)',
  email: 'studio@circhetta.it',
  pec: 'studio@pec.circhetta.it',
};

export default function NuovoMandatoPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [clienteSelezionato, setClienteSelezionato] = useState<string>('');
  const [datiCliente, setDatiCliente] = useState({
    nome: '',
    cfPiva: '',
    indirizzo: '',
    email: '',
    pec: '',
  });
  const [datiMandato, setDatiMandato] = useState({
    tipoContabilita: '',
    compenso: '',
    modalitaPagamento: '',
    serviziInclusi: '',
    serviziExtra: '',
    dataInizio: new Date().toISOString().split('T')[0],
    luogoData: `Poggiardo, ${new Date().toLocaleDateString('it-IT')}`,
  });
  const [mandatoGenerato, setMandatoGenerato] = useState('');

  const { data: clienti = [] } = useQuery({
    queryKey: ['clienti-attivi'],
    queryFn: async () => {
      const response = await clientiAPI.getAll({ attivo: true });
      return response.data || [];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => mandatiAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mandati'] });
      toast.success('Mandato salvato con successo!');
      router.push('/mandato');
    },
    onError: (error: any) => {
      toast.error('Errore durante il salvataggio: ' + (error.response?.data?.message || 'Errore sconosciuto'));
    },
  });

  const handleClienteChange = (clienteId: string) => {
    setClienteSelezionato(clienteId);
    if (clienteId && clienteId !== 'manuale') {
      const cliente = clienti?.find((c: any) => c.id === parseInt(clienteId));
      if (cliente) {
        setDatiCliente({
          nome: cliente.ragioneSociale || `${cliente.nome} ${cliente.cognome}`,
          cfPiva: cliente.partitaIva || cliente.codiceFiscale || '',
          indirizzo: `${cliente.indirizzo || ''}, ${cliente.cap || ''} ${cliente.citta || ''} (${cliente.provincia || ''})`.trim(),
          email: cliente.email || '',
          pec: cliente.pec || '',
        });
      }
    } else if (clienteId === 'manuale') {
      setDatiCliente({
        nome: '',
        cfPiva: '',
        indirizzo: '',
        email: '',
        pec: '',
      });
    }
  };

  const generaMandato = () => {
    // Validazione
    if (!datiCliente.nome || !datiCliente.cfPiva) {
      toast.error('Compila almeno Nome e Codice Fiscale/P.IVA del cliente');
      return;
    }
    if (!datiMandato.tipoContabilita || !datiMandato.compenso) {
      toast.error('Compila Tipo Contabilità e Compenso');
      return;
    }

    // Genera testo senza ** e con formattazione pulita
    const mandato = `MANDATO DI INCARICO PROFESSIONALE

Tra Commercialista e Cliente

---

Tra:
${DATI_STUDIO.nome}
P.IVA: ${DATI_STUDIO.piva}
Sede legale: ${DATI_STUDIO.sede}
Email: ${DATI_STUDIO.email}
PEC: ${DATI_STUDIO.pec}

E

${datiCliente.nome}
Codice Fiscale / P.IVA: ${datiCliente.cfPiva}
${datiCliente.indirizzo ? `Indirizzo: ${datiCliente.indirizzo}` : ''}
${datiCliente.email ? `Email: ${datiCliente.email}` : ''}
${datiCliente.pec ? `PEC: ${datiCliente.pec}` : ''}

---

1. Oggetto dell'incarico

${datiMandato.serviziInclusi || 'Gestione contabilità e adempimenti fiscali secondo le disposizioni di legge.'}

2. Durata dell'incarico

Annuale, con rinnovo automatico salvo disdetta con 30 giorni di preavviso.

3. Compenso e pagamenti

Tipo contabilità: ${datiMandato.tipoContabilita}
Compenso: ${datiMandato.compenso}
Modalità pagamento: ${datiMandato.modalitaPagamento || 'Da concordare'}
${datiMandato.serviziExtra ? `Servizi extra: ${datiMandato.serviziExtra}` : ''}

4. Obblighi del cliente

– Fornire documenti in modo completo e nei tempi stabiliti
– Comunicare tempestivamente variazioni fiscali, societarie o di attività
– Collaborare correttamente con il professionista
– Pagare puntualmente i compensi pattuiti

5. Responsabilità del Professionista

Il professionista si impegna a svolgere l'incarico con la massima diligenza professionale, escludendo ogni responsabilità per ritardi o conseguenze derivanti da documentazione mancante, incompleta o errata fornita dal cliente.

6. Trattamento dati (GDPR)

Il trattamento dei dati personali è effettuato in conformità al Regolamento UE 2016/679 (GDPR) e alla normativa italiana in materia di privacy.

7. Recesso

Ciascuna parte può recedere dal presente incarico con preavviso di 30 giorni, comunicato per iscritto. Restano comunque dovuti i compensi maturati fino alla data di recesso.

8. Foro competente

Per qualsiasi controversia derivante dal presente mandato, è competente il Foro della sede dello Studio Commercialista Circhetta Piero, salvo diversi accordi scritti tra le parti.

9. Accettazione

Luogo e data: ${datiMandato.luogoData}

---

Firma del Professionista

_________________________
${DATI_STUDIO.nome}

---

Firma del Cliente

_________________________
${datiCliente.nome}

---`;

    setMandatoGenerato(mandato);
    toast.success('Mandato generato con successo!');
  };

  const handleSalva = () => {
    if (!mandatoGenerato) {
      toast.error('Genera prima il mandato!');
      return;
    }

    createMutation.mutate({
      clienteId: clienteSelezionato && clienteSelezionato !== 'manuale' ? parseInt(clienteSelezionato) : null,
      nomeCliente: datiCliente.nome,
      cfPivaCliente: datiCliente.cfPiva,
      indirizzoCliente: datiCliente.indirizzo || null,
      emailCliente: datiCliente.email || null,
      pecCliente: datiCliente.pec || null,
      tipoContabilita: datiMandato.tipoContabilita,
      compenso: datiMandato.compenso,
      modalitaPagamento: datiMandato.modalitaPagamento || null,
      serviziInclusi: datiMandato.serviziInclusi || null,
      serviziExtra: datiMandato.serviziExtra || null,
      dataInizio: datiMandato.dataInizio,
      luogoData: datiMandato.luogoData,
      testoMandato: mandatoGenerato,
    });
  };

  return (
    <>
      <Header title="Nuovo Mandato di Incarico" />
      
      <div className="p-8 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.push('/mandato')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Torna alla lista"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h2 className="text-xl font-semibold text-gray-900">Crea Nuovo Mandato</h2>
        </div>

        <div className="card">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* COLONNA SINISTRA: Form */}
            <div className="space-y-6">
              {/* Selezione Cliente */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cliente <span className="text-red-500">*</span>
                </label>
                <select
                  value={clienteSelezionato}
                  onChange={(e) => handleClienteChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleziona cliente...</option>
                  <option value="manuale">Inserimento manuale</option>
                  {clienti?.map((cliente: any) => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.ragioneSociale || `${cliente.nome} ${cliente.cognome}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dati Cliente */}
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <User size={18} />
                  Dati Cliente
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome / Ragione Sociale <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={datiCliente.nome}
                    onChange={(e) => setDatiCliente({ ...datiCliente, nome: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Es: Mario Rossi o ABC S.r.l."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Codice Fiscale / P.IVA <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={datiCliente.cfPiva}
                    onChange={(e) => setDatiCliente({ ...datiCliente, cfPiva: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Es: RSSMRA80A01H501X o 12345678901"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Indirizzo
                  </label>
                  <input
                    type="text"
                    value={datiCliente.indirizzo}
                    onChange={(e) => setDatiCliente({ ...datiCliente, indirizzo: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Via, CAP, Città, Provincia"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={datiCliente.email}
                      onChange={(e) => setDatiCliente({ ...datiCliente, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PEC
                    </label>
                    <input
                      type="email"
                      value={datiCliente.pec}
                      onChange={(e) => setDatiCliente({ ...datiCliente, pec: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Dati Mandato */}
              <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Building2 size={18} />
                  Dati Mandato
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo Contabilità <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={datiMandato.tipoContabilita}
                    onChange={(e) => setDatiMandato({ ...datiMandato, tipoContabilita: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Es: Semplificata, Ordinaria, Forfettaria"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Compenso <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={datiMandato.compenso}
                    onChange={(e) => setDatiMandato({ ...datiMandato, compenso: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Es: € 1.200,00 annui"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Modalità Pagamento
                  </label>
                  <input
                    type="text"
                    value={datiMandato.modalitaPagamento}
                    onChange={(e) => setDatiMandato({ ...datiMandato, modalitaPagamento: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Es: Trimestrale, Mensile, Unica soluzione"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Servizi Inclusi
                  </label>
                  <textarea
                    value={datiMandato.serviziInclusi}
                    onChange={(e) => setDatiMandato({ ...datiMandato, serviziInclusi: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Elenca i servizi inclusi nel mandato..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Servizi Extra
                  </label>
                  <textarea
                    value={datiMandato.serviziExtra}
                    onChange={(e) => setDatiMandato({ ...datiMandato, serviziExtra: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                    placeholder="Servizi aggiuntivi a parte..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data Inizio
                    </label>
                    <input
                      type="date"
                      value={datiMandato.dataInizio}
                      onChange={(e) => setDatiMandato({ ...datiMandato, dataInizio: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Luogo e Data
                    </label>
                    <input
                      type="text"
                      value={datiMandato.luogoData}
                      onChange={(e) => setDatiMandato({ ...datiMandato, luogoData: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Poggiardo, 21/11/2025"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={generaMandato}
                  className="flex-1 btn btn-primary flex items-center justify-center gap-2"
                >
                  <FileText size={18} />
                  Genera Mandato
                </button>
                {mandatoGenerato && (
                  <button
                    onClick={handleSalva}
                    disabled={createMutation.isPending}
                    className="flex-1 btn bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Save size={18} />
                    {createMutation.isPending ? 'Salvataggio...' : 'Salva'}
                  </button>
                )}
              </div>
            </div>

            {/* COLONNA DESTRA: Anteprima */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Anteprima Mandato</h3>

              <div className="bg-white border-2 border-gray-200 rounded-lg p-6 max-h-[800px] overflow-y-auto">
                {mandatoGenerato ? (
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 leading-relaxed">
                      {mandatoGenerato}
                    </pre>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <FileText size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Compila il form e clicca su "Genera Mandato"</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

