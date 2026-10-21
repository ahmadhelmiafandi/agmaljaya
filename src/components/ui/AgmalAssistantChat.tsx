import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  RotateCcw,
  Sparkles,
  Phone,
  ArrowUpRight,
  CheckCircle2,
  Calendar,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import AgmalRobotAvatar from './AgmalRobotAvatar';
import { sendChatMessage, submitConsultationTicket, ChatMessage } from '../../lib/ai/chatService';
import { openWhatsApp } from '../../lib/whatsapp';

interface AgmalAssistantChatProps {
  whatsappPhone?: string;
}

const INITIAL_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  thinking: 'Menyiapkan sesi konsultasi aktif: Menjawab pertanyaan seputar harga per meter, material tahan air & rayap, pengiriman seluruh Indonesia, dan alur survei.',
  content:
    'Halo! Saya **Agmal Assistant**, konsultan virtual resmi Agmal Jaya Interior Jepara.\n\nAda yang bisa saya bantu terkait kebutuhan custom furniture (kitchen set, wardrobe, backdrop TV), spesifikasi bahan, atau estimasi biaya? Anda bisa memilih pertanyaan populer di bawah atau langsung ketik kebutuhan Anda!',
  timestamp: Date.now(),
};

// Pertanyaan yang paling sering ditanyakan oleh rata-rata calon klien (Top FAQs)
const POPULAR_FAQS = [
  'Berapa estimasi biaya kitchen set per meter?',
  'Apakah melayani pengiriman & pasang ke luar kota?',
  'Bagaimana alur survei lokasi dan pemesanan?',
  'Bahan apa yang tahan air dan anti-rayap?',
  'Berapa lama proses pembuatan di workshop?',
  'Punya referensi foto Pinterest, apa bisa dibuatkan?',
];

export default function AgmalAssistantChat({ whatsappPhone = '+62 851 1372 3808' }: AgmalAssistantChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [showBubbleHint, setShowBubbleHint] = useState(false);
  const [hintDismissed, setHintDismissed] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [openThinkingIds, setOpenThinkingIds] = useState<Record<string, boolean>>({ welcome: false });

  // State Formulir Survei
  const [surveyForm, setSurveyForm] = useState({
    name: '',
    phone: '',
    city: '',
    roomType: 'Kitchen Set',
    notes: '',
  });
  const [surveySubmitting, setSurveySubmitting] = useState(false);
  const [surveyDone, setSurveyDone] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Tampilkan balon ajakan setelah 3 detik
  useEffect(() => {
    const hintTimer = setTimeout(() => {
      if (!isOpen && !hintDismissed) setShowBubbleHint(true);
    }, 3000);
    return () => clearTimeout(hintTimer);
  }, [isOpen, hintDismissed]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !showSurveyModal) {
      scrollToBottom();
      setShowBubbleHint(false);
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen, messages, showSurveyModal]);

  // Kirim Pesan
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const historyForApi = newMessages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ role: m.role, content: m.content }));

      const { reply, thinking } = await sendChatMessage({
        userQuery: text,
        chatHistory: historyForApi,
      });

      const assistantMessageId = `assistant-${Date.now()}`;
      const assistantMessage: ChatMessage = {
        id: assistantMessageId,
        role: 'assistant',
        content: reply,
        thinking: thinking,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (thinking) {
        setOpenThinkingIds((prev) => ({ ...prev, [assistantMessageId]: true }));
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-err-${Date.now()}`,
          role: 'assistant',
          content:
            'Layanan chat sedang padat antrean. Anda dapat langsung bertanya ke tim desainer kami via WhatsApp di ' +
            whatsappPhone,
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleThinking = (id: string) => {
    setOpenThinkingIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([INITIAL_MESSAGE]);
    setOpenThinkingIds({ welcome: false });
  };

  // Submit Formulir Survei
  const handleSurveySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!surveyForm.name || !surveyForm.phone) return;

    setSurveySubmitting(true);
    const summary = messages
      .filter((m) => m.id !== 'welcome')
      .map((m) => `${m.role === 'user' ? 'Klien' : 'AI'}: ${m.content}`)
      .slice(-4)
      .join('\n');

    await submitConsultationTicket({
      name: surveyForm.name,
      phone: surveyForm.phone,
      city: surveyForm.city,
      roomType: surveyForm.roomType,
      notes: surveyForm.notes,
      summary: summary,
    });

    setSurveySubmitting(false);
    setSurveyDone(true);

    const waText =
      `*FORM JADWAL SURVEI & KONSULTASI - AGMAL JAYA INTERIOR*\n\n` +
      `• *Nama Klien:* ${surveyForm.name}\n` +
      `• *No. WhatsApp:* ${surveyForm.phone}\n` +
      `• *Kota/Domisili:* ${surveyForm.city || '-'}\n` +
      `• *Rencana Ruangan:* ${surveyForm.roomType}\n` +
      `• *Catatan:* ${surveyForm.notes || 'Konsultasi custom interior'}\n\n` +
      `Halo tim Agmal Jaya Interior, saya ingin mendiskusikan jadwal survei dan estimasi untuk ruangan di atas. Terima kasih!`;

    setTimeout(() => {
      openWhatsApp(whatsappPhone, waText);
    }, 600);
  };

  // Helper render teks markdown
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }

      const parts = line.split(/(\*\*.*?\*\*)/g);
      const renderedLine = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="font-semibold text-slate-900">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (line.startsWith('• ') || line.startsWith('- ')) {
        return (
          <div key={idx} className="flex items-start gap-2 my-1 text-slate-700 text-[13px] leading-relaxed">
            <span className="text-[#b08d57] font-bold leading-5 select-none">•</span>
            <span className="flex-1">{renderedLine.slice(1)}</span>
          </div>
        );
      }

      if (/^\d+\.\s/.test(line)) {
        return (
          <div key={idx} className="flex items-start gap-2 my-1 text-slate-700 text-[13px] leading-relaxed">
            <span className="font-bold text-[#b08d57] text-xs mt-0.5 w-4 shrink-0 select-none">
              {line.match(/^\d+\./)?.[0]}
            </span>
            <span className="flex-1">{line.replace(/^\d+\.\s*/, '')}</span>
          </div>
        );
      }

      return (
        <p key={idx} className="text-[13px] leading-relaxed my-0.5 text-slate-700">
          {renderedLine}
        </p>
      );
    });
  };

  return (
    <>
      {/* 1. FLOATING BUTTON CHATBOT: RAPI, IKONIK, DAN POP-UP TEXT DI SEBELAH KANAN TOMBOL */}
      <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 flex items-center gap-3">
        {/* Tombol Bulat Chatbot (Mascot Robot Warna Emas Khas Agmal Jaya) */}
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-tr from-[#946835] via-[#b08d57] to-[#dfb983] text-white shadow-xl shadow-[#b08d57]/35 hover:shadow-2xl hover:shadow-[#b08d57]/50 border-2 border-white/90 transition-all duration-300 hover:scale-110 active:scale-95 shrink-0 cursor-pointer"
            aria-label="Buka Chatbot Asisten Desain AI"
          >
            {/* Pulsing glow ring */}
            <span className="absolute inset-0 rounded-full bg-[#b08d57] animate-ping opacity-25"></span>
            <span className="absolute inset-0 rounded-full bg-[#dfb983] animate-pulse opacity-20"></span>

            {/* Maskot Robot Chatbot Resmi Agmal Jaya */}
            <div className="relative z-10 flex items-center justify-center">
              <AgmalRobotAvatar
                size={38}
                primaryColor="#1c1917"
                faceColor="#ffffff"
                featureColor="#1c1917"
              />
            </div>

            {/* Online Status Dot Hijau di Pojok Kanan Bawah */}
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full z-20 shadow-sm"></span>
          </button>
        )}

        {/* POP-UP TEXT UNTUK TOMBOL: TERLETAK DI SEBELAH KANAN TOMBOL */}
        {!isOpen && showBubbleHint && !hintDismissed && (
          <div className="animate-fade-in-up relative flex items-center">
            <div
              onClick={() => setIsOpen(true)}
              className="bg-white rounded-2xl shadow-xl shadow-black/10 border border-[#ebd1aa] p-3 pr-8 relative cursor-pointer hover:border-[#b08d57] transition-all max-w-[210px] sm:max-w-[230px]"
            >
              {/* Tombol Silang (x) untuk menutup popup */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setHintDismissed(true);
                  setShowBubbleHint(false);
                }}
                className="absolute top-2 right-2 w-4 h-4 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                aria-label="Tutup pesan ajakan"
              >
                <X size={12} />
              </button>

              <p className="text-xs font-bold text-slate-900 leading-tight">
                Tanya Agmal Assistant 💬
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                Konsultasi estimasi & bahan interior
              </p>

              {/* Segitiga Arrow menunjuk ke KIRI (ke arah tombol robot) */}
              <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-white border-b border-l border-[#ebd1aa] transform rotate-45"></div>
            </div>
          </div>
        )}
      </div>

      {/* 2. CHAT WINDOW PANEL */}
      {isOpen && (
        <div className="fixed inset-x-3 bottom-3 sm:inset-x-auto sm:left-6 sm:bottom-6 w-auto sm:w-[440px] h-[610px] max-h-[90vh] bg-white rounded-2xl shadow-2xl shadow-slate-950/40 border border-slate-200 flex flex-col z-50 overflow-hidden font-sans transition-all duration-300 animate-fade-in-up">
          {/* Header Chatbot dengan Avatar Robot */}
          <div className="bg-[#1c1917] text-white p-3.5 sm:p-4 flex items-center justify-between border-b border-[#36312f]">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#946835] via-[#b08d57] to-[#dfb983] flex items-center justify-center p-0.5 shadow-md">
                <AgmalRobotAvatar
                  size={30}
                  primaryColor="#1c1917"
                  faceColor="#ffffff"
                  featureColor="#1c1917"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-[#1c1917] rounded-full"></span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm tracking-wide text-white">Agmal Assistant</h3>
                  <span className="text-[9px] px-1.5 py-0.5 font-bold uppercase tracking-wider bg-[#b08d57]/30 text-[#dfb983] rounded border border-[#b08d57]/40">
                    AI Interior
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-300 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Workshop Jepara • Respons Cepat</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowSurveyModal(!showSurveyModal)}
                title="Jadwalkan Survei Lokasi"
                className="px-2.5 py-1 text-xs text-[#dfb983] bg-[#b08d57]/20 hover:bg-[#b08d57]/30 border border-[#b08d57]/40 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
              >
                <Calendar size={13} />
                <span className="hidden xs:inline">Survei</span>
              </button>
              <button
                onClick={handleResetChat}
                title="Mulai Sesi Chat Baru"
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw size={15} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Tutup Chat"
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {/* MODAL / FORMULIR SURVEI (JIKA DIBUKA) */}
          {showSurveyModal ? (
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50/80">
              {surveyDone ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-white rounded-2xl border border-slate-200">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                    <CheckCircle2 size={24} />
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">Permintaan Survei Terkirim!</h4>
                  <p className="text-xs text-slate-600 mt-1.5 max-w-xs leading-relaxed">
                    Data Anda telah kami simpan. Tim teknis kami akan segera menghubungi Anda untuk koordinasi jadwal ukur presisi.
                  </p>
                  <button
                    onClick={() => {
                      setSurveyDone(false);
                      setShowSurveyModal(false);
                    }}
                    className="mt-4 px-4 py-2 bg-[#1c1917] hover:bg-black text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Kembali ke Percakapan Chat
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSurveySubmit} className="space-y-3.5">
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Calendar size={14} className="text-[#b08d57]" />
                        <span>Jadwalkan Survei & Ukur Lokasi</span>
                      </h4>
                      <button
                        type="button"
                        onClick={() => setShowSurveyModal(false)}
                        className="text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        Batal
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                      Tim ukur profesional Agmal Jaya Interior melayani pengukuran presisi ke rumah/kantor Anda di seluruh kota.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Nama Lengkap *</label>
                      <input
                        type="text"
                        required
                        value={surveyForm.name}
                        onChange={(e) => setSurveyForm({ ...surveyForm, name: e.target.value })}
                        placeholder="Contoh: Bapak Hendra Gunawan"
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#b08d57]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Nomor WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        value={surveyForm.phone}
                        onChange={(e) => setSurveyForm({ ...surveyForm, phone: e.target.value })}
                        placeholder="Contoh: 081234567890"
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#b08d57]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Kota Domisili</label>
                        <input
                          type="text"
                          value={surveyForm.city}
                          onChange={(e) => setSurveyForm({ ...surveyForm, city: e.target.value })}
                          placeholder="Surabaya / Jakarta"
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#b08d57]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Rencana Ruangan</label>
                        <select
                          value={surveyForm.roomType}
                          onChange={(e) => setSurveyForm({ ...surveyForm, roomType: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#b08d57]"
                        >
                          <option value="Kitchen Set">Kitchen Set</option>
                          <option value="Lemari Wardrobe">Lemari Pakaian</option>
                          <option value="Backdrop TV">Backdrop TV</option>
                          <option value="Set Kamar Tidur">Set Kamar Tidur</option>
                          <option value="Interior Kantor">Interior Kantor</option>
                          <option value="Renovasi 1 Rumah">Full Rumah</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Catatan Kebutuhan / Ukuran</label>
                      <textarea
                        rows={2}
                        value={surveyForm.notes}
                        onChange={(e) => setSurveyForm({ ...surveyForm, notes: e.target.value })}
                        placeholder="Contoh: Dapur 2x1.5m, ingin ada rak piring tarik dan kabinet atas full plafon."
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#b08d57] resize-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={surveySubmitting || !surveyForm.name || !surveyForm.phone}
                    className="w-full py-2.5 bg-[#1c1917] hover:bg-black disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer mt-2"
                  >
                    {surveySubmitting ? (
                      <span>Menyimpan ke antrean tim...</span>
                    ) : (
                      <>
                        <Phone size={14} className="text-emerald-400" />
                        <span>Kirim ke Desainer & Buka WhatsApp</span>
                        <ArrowUpRight size={14} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          ) : (
            <>
              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/70">
                {messages.map((msg) => {
                  const isAssistant = msg.role === 'assistant';
                  const isThinkingOpen = openThinkingIds[msg.id];
                  const mentionsWhatsApp =
                    isAssistant &&
                    (msg.content.toLowerCase().includes('whatsapp') ||
                      msg.content.toLowerCase().includes('survei') ||
                      msg.content.toLowerCase().includes('konsultasi'));

                  return (
                    <div key={msg.id} className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}>
                      {/* Accordion Thinking Process */}
                      {isAssistant && msg.thinking && (
                        <div className="w-full max-w-[92%] sm:max-w-[88%] mb-1.5">
                          <button
                            onClick={() => toggleThinking(msg.id)}
                            className="w-full flex items-center justify-between px-3 py-1.5 bg-[#b08d57]/10 hover:bg-[#b08d57]/20 border border-[#b08d57]/25 rounded-xl text-left text-xs text-[#6d4b2e] transition-colors cursor-pointer"
                          >
                            <span className="flex items-center gap-1.5 font-medium">
                              <Sparkles size={12} className="text-[#b08d57]" />
                              <span>Analisis Rekayasa & Ergonomi Desain</span>
                            </span>
                            {isThinkingOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                          {isThinkingOpen && (
                            <div className="mt-1 p-2.5 bg-[#fdfaf6] border border-[#ebd1aa] rounded-xl text-[12px] text-[#6d4b2e] leading-relaxed font-mono">
                              {msg.thinking}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Bubble Chat */}
                      <div className="flex items-end gap-2 max-w-[94%] sm:max-w-[90%]">
                        {isAssistant && (
                          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#946835] to-[#dfb983] p-0.5 flex items-center justify-center shrink-0 mb-1 border border-white shadow-sm">
                            <AgmalRobotAvatar
                              size={22}
                              primaryColor="#1c1917"
                              faceColor="#ffffff"
                              featureColor="#1c1917"
                            />
                          </div>
                        )}
                        <div
                          className={`rounded-2xl p-4 text-[13px] ${
                            isAssistant
                              ? 'bg-white text-slate-800 border border-slate-200 shadow-sm rounded-tl-sm'
                              : 'bg-[#1c1917] text-white rounded-tr-sm shadow-sm'
                          }`}
                        >
                          {isAssistant ? renderFormattedText(msg.content) : msg.content}

                          {/* Copy Button */}
                          {isAssistant && msg.id !== 'welcome' && (
                            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                              <span className="text-[10px] text-[#a4723c]">Workshop Agmal Jaya Jepara</span>
                              <button
                                onClick={() => copyToClipboard(msg.id, msg.content)}
                                className="inline-flex items-center gap-1 hover:text-slate-700 transition-colors cursor-pointer"
                                title="Salin penjelasan"
                              >
                                {copiedId === msg.id ? (
                                  <>
                                    <Check size={12} className="text-emerald-600" />
                                    <span className="text-emerald-600">Tersalin</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy size={12} />
                                    <span>Salin</span>
                                  </>
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Tombol Aksi Cepat ke WhatsApp */}
                      {mentionsWhatsApp && msg.id !== 'welcome' && (
                        <div className="mt-2 ml-9 flex flex-wrap gap-2">
                          <button
                            onClick={() => {
                              const waText = `Halo tim Agmal Jaya Interior, saya ingin konsultasi denah dan estimasi untuk kebutuhan custom furniture saya.`;
                              openWhatsApp(whatsappPhone, waText);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] hover:bg-[#1fb855] text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                          >
                            <Phone size={12} />
                            <span>Kirim Denah/Ukuran ke WhatsApp</span>
                            <ArrowUpRight size={13} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Loading State */}
                {isLoading && (
                  <div className="flex items-center gap-2.5 p-3.5 bg-white border border-slate-200 rounded-2xl rounded-tl-sm w-fit text-slate-600 text-xs shadow-sm ml-9">
                    <Sparkles size={14} className="text-[#b08d57] animate-spin" />
                    <span>Menganalisis kebutuhan ruang & menyusun solusi...</span>
                    <span className="flex gap-1 ml-1">
                      <span className="w-1.5 h-1.5 bg-[#b08d57] rounded-full animate-pulse"></span>
                      <span className="w-1.5 h-1.5 bg-[#b08d57] rounded-full animate-pulse [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 bg-[#b08d57] rounded-full animate-pulse [animation-delay:0.4s]"></span>
                    </span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompt Chips: PERTANYAAN POPULER RATA-RATA USER */}
              <div className="px-3.5 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                {POPULAR_FAQS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(prompt)}
                    disabled={isLoading}
                    className="shrink-0 px-2.5 py-1 bg-[#fdfaf6] hover:bg-[#fbf3e9] text-[#6d4b2e] hover:text-[#3c2716] rounded-md border border-[#ebd1aa] hover:border-[#b08d57] transition-colors cursor-pointer text-[11px] font-medium"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <div className="p-3 bg-white border-t border-slate-200">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Tanya biaya per meter, bahan anti-air, kirim luar kota..."
                    disabled={isLoading}
                    className="flex-1 bg-slate-50 border border-slate-300 focus:border-[#b08d57] focus:bg-white rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim() || isLoading}
                    className="w-10 h-10 rounded-xl bg-[#1c1917] hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                    aria-label="Kirim pesan"
                  >
                    <Send size={16} />
                  </button>
                </form>
                <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 px-1">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 size={10} className="text-emerald-600" /> Data Resmi Workshop Agmal Jaya Jepara
                  </span>
                  <span>WhatsApp: {whatsappPhone}</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
