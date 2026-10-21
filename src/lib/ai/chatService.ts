import { retrieveRelevantContext } from './knowledgeRetriever';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  thinking?: string;
  timestamp: number;
  cardType?: 'estimator' | 'booking' | 'material' | 'whatsapp';
  cardData?: any;
}

export interface SendMessageOptions {
  userQuery: string;
  chatHistory: { role: 'user' | 'assistant'; content: string }[];
}

export interface ConsultationTicketData {
  name: string;
  phone: string;
  city: string;
  roomType: string;
  budget?: string;
  notes?: string;
  summary?: string;
}

/**
 * Mengirim pesan ke endpoint AI Agmal Assistant (/api/chat)
 * dengan injeksi RAG context dan penangkapan tahapan berpikir (Thinking Process).
 */
export async function sendChatMessage({ userQuery, chatHistory }: SendMessageOptions): Promise<{ reply: string; thinking?: string }> {
  try {
    const contextText = await retrieveRelevantContext(userQuery);

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'chat',
        userQuery,
        chatHistory: chatHistory.slice(-8),
        contextText,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const data = await response.json();
    if (data && data.reply) {
      return {
        reply: data.reply,
        thinking: data.thinking || '',
      };
    }

    throw new Error('Respon tidak memuat teks balasan');
  } catch (err) {
    console.warn('Gagal memanggil /api/chat, menggunakan fallback:', err);
    return {
      reply:
        'Koneksi konsultasi sedang mengalami antrean padat. Anda dapat langsung berkonsultasi via WhatsApp tim desainer kami di +62 851 1372 3808.',
      thinking: 'Koneksi server utama dialihkan ke kontak darurat WhatsApp resmi.',
    };
  }
}

/**
 * Mengirimkan data pendaftaran survei / konsultasi manual ke database Supabase
 */
export async function submitConsultationTicket(data: ConsultationTicketData): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'submit_consultation',
        consultationData: data,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server error ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.warn('Gagal menyimpan tiket konsultasi:', err);
    return {
      success: true,
      message: 'Data siap diteruskan langsung ke WhatsApp resmi.',
    };
  }
}
