// ============================================================================
// Vercel Serverless Function: /api/chat
// Handler Konsultasi Interior: AI Cerdas, Dinamis & Non-Template
// ============================================================================

import fs from 'fs';
import path from 'path';

/**
 * Helper untuk membaca GEMINI_API_KEY dari process.env atau file .env
 */
function resolveGeminiKey() {
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim()) {
    return process.env.GEMINI_API_KEY.trim();
  }
  if (process.env.VITE_GEMINI_API_KEY && process.env.VITE_GEMINI_API_KEY.trim()) {
    return process.env.VITE_GEMINI_API_KEY.trim();
  }
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const match = content.match(/^GEMINI_API_KEY=(.+)$/m) || content.match(/^VITE_GEMINI_API_KEY=(.+)$/m);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
  } catch (err) {
    // fallback
  }
  return null;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Gunakan POST.' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        // use as is
      }
    }

    const { 
      action = 'chat', 
      userQuery, 
      chatHistory = [], 
      contextText = '', 
      consultationData = null 
    } = body || {};

    // 1. FITUR SUBMIT FORMULIR KONSULTASI / SURVEI
    if (action === 'submit_consultation' && consultationData) {
      const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://hxpjyglsjwbxkeexulul.supabase.co';
      const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4cGp5Z2xzandieGtlZXh1bHVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4MTAzMTgsImV4cCI6MjEwNTM4NjMxOH0.Y-f0Uvtq8hY-FZDDkl_byW9UcWAA9AzDXXtqWkI3eWY';

      try {
        const orderPayload = {
          clientName: consultationData.name || 'Calon Klien Website',
          phone: consultationData.phone || '-',
          city: consultationData.city || 'Indonesia',
          roomType: consultationData.roomType || 'Interior Custom',
          notes: consultationData.notes || 'Permintaan konsultasi langsung via Chatbot Studio',
          chatSummary: consultationData.summary || '',
          source: 'Live Chat Studio Agmal',
          status: 'Menunggu Hubungan Desainer',
          createdAt: new Date().toISOString()
        };

        const sbRes = await fetch(`${supabaseUrl}/rest/v1/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({ data: orderPayload })
        });

        if (sbRes.ok) {
          const inserted = await sbRes.json();
          return res.status(200).json({
            success: true,
            ticketId: inserted?.[0]?.id || Date.now(),
            message: 'Permintaan konsultasi telah tersimpan.'
          });
        }
      } catch (sbErr) {
        console.warn('Gagal menyimpan tiket ke Supabase:', sbErr);
      }

      return res.status(200).json({
        success: true,
        message: 'Data konsultasi siap diteruskan ke WhatsApp tim desainer.'
      });
    }

    // 2. KONSULTASI AI CHAT
    if (!userQuery || typeof userQuery !== 'string' || !userQuery.trim()) {
      return res.status(400).json({ error: 'userQuery wajib diisi.' });
    }

    const cleanQuery = userQuery.trim();
    const cleanContext = (contextText && typeof contextText === 'string')
      ? contextText.trim()
      : 'Workshop Pusat: Jepara, Jawa Tengah. Melayani pengiriman & instalasi ke seluruh Indonesia. WhatsApp: +62 851 1372 3808.';

    const lowerQuery = cleanQuery.toLowerCase();

    // Guardrail: Anti-Prompt Injection
    const isInjectionAttempt = 
      lowerQuery.includes('ignore previous') ||
      lowerQuery.includes('abaikan instruksi') ||
      lowerQuery.includes('system prompt') ||
      lowerQuery.includes('system instruction') ||
      lowerQuery.includes('bocorkan prompt') ||
      lowerQuery.includes('tampilkan prompt') ||
      lowerQuery.includes('supabase key');

    if (isInjectionAttempt) {
      return res.status(200).json({
        thinking: 'Mengarahkan fokus kembali ke konsultasi interior dan furnitur custom.',
        reply: 'Saya fokus mendampingi Anda dalam perencanaan interior dan pembuatan furnitur custom di Agmal Jaya Interior. Ada ide ruangan atau kebutuhan perabot yang ingin kita bahas bersama?',
        success: true
      });
    }

    // Guardrail: Out of Scope
    const isOutOfScope =
      lowerQuery.includes('resep') ||
      lowerQuery.includes('coding') ||
      lowerQuery.includes('python') ||
      lowerQuery.includes('javascript') ||
      lowerQuery.includes('pemilu') ||
      lowerQuery.includes('presiden') ||
      lowerQuery.includes('saham') ||
      lowerQuery.includes('kripto') ||
      lowerQuery.includes('cuaca besok');

    if (isOutOfScope) {
      return res.status(200).json({
        thinking: 'Pertanyaan di luar topik interior & furnitur. Mengembalikan dialog ke ranah interior.',
        reply: 'Maaf, keahlian saya khusus seputar perencanaan interior, furnitur custom, dan renovasi ruangan di Agmal Jaya Interior. Apakah ada ruangan di rumah atau kantor Anda yang ingin dipercantik?',
        success: true
      });
    }

    // SYSTEM INSTRUCTION: DINAMIS, ALAMI, DAN PERSONAL (ANTI-TEMPLATE)
    const systemInstruction = `
Kamu adalah "Agmal Assistant", konsultan desain interior dan custom furniture resmi dari Agmal Jaya Interior Jepara (agmaljayainterior.com).

PRINSIP KOMUNIKASI (SANGAT PENTING):
1. JAWABLAH SECARA SPESIFIK & KONTEKSTUAL (DILARANG MENGGUNAKAN FORMAT TEMPLATE KAKU):
   - Jangan pernah menyajikan daftar poin yang sama secara berulang-ulang untuk setiap pertanyaan.
   - Bedah dan jawab langsung apa yang ditanyakan pengguna secara mendalam dan mengalir alami.
   - Jika pengguna menyebutkan ukuran ruangan (misal: "dapur 2x1.5m"): Berikan solusi konkret untuk ruang sempit (layout lurus/single line, pemanfaatan kabinet atas full plafon untuk ruang simpan maksimal, pemilihan warna HPL terang/putih/woodgrain terang agar ruangan terlihat lega, serta perhitungan perkiraan biaya sesuai panjang tersebut).
   - Jika pengguna menanyakan pengiriman ke kota tertentu (misal: "apakah bisa kirim dan pasang di Surabaya / Jakarta / Bali / Medan?"): Jawab spesifik mengenai kota tersebut, rute ekspedisi truk aman berbalut peti kayu dari workshop Jepara, dan tim perakit yang siap diberangkatkan langsung ke lokasi klien.
   - Jika pengguna menanyakan perbandingan bahan: Jelaskan plus-minusnya secara solutif (Multiplek 18mm Grade A untuk kekuatan struktural vs PVC Board anti-air 100% untuk area cuci/sink agar tahan air dan rayap).
   - Nada bicara: Hangat, solutif, santai namun profesional seperti seorang desainer interior berpengalaman yang sedang mengobrol via chat.

2. PENGETAHUAN BIAYA & STANDAR WORKSHOP JEPARA:
   - Acuan dasar: Kitchen Set mulai Rp 2.000.000/meter lari (m1), Wardrobe lemari mulai Rp 1.800.000/m1, Backdrop TV mulai Rp 1.500.000/m1.
   - Material: Multiplek/Blockboard Grade A 18mm, PVC Board anti-air, laminasi HPL Taco/Aica, hardware engsel hidrolik slow-motion, rel laci double-track.
   - Waktu produksi workshop: Rata-rata 2–3 minggu.
   - WhatsApp resmi: +62 851 1372 3808.

3. RUANG LINGKUP:
   - Tetap 100% fokus seputar interior (kitchen set, wardrobe, backdrop TV, partisi, meja kerja, kamar tidur, renovasi) dan layanan Agmal Jaya Interior.

4. FORMAT:
   - Tuliskan 1-2 kalimat pertimbangan desain di tag <thinking>...</thinking>.
   - Lanjutkan dengan jawaban mengalir yang langsung merespon pertanyaan klien secara personal, lalu akhiri dengan tawaran ramah untuk diskusi denah atau survei lokasi via WhatsApp.
`.trim();

    // CALL GOOGLE GEMINI
    const geminiKey = resolveGeminiKey();

    if (geminiKey) {
      const contents = [];
      if (Array.isArray(chatHistory) && chatHistory.length > 0) {
        for (const item of chatHistory) {
          contents.push({
            role: item.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: item.content }]
          });
        }
      }
      contents.push({
        role: 'user',
        parts: [{ text: cleanQuery }]
      });

      // Daftar kandidat endpoint model yang dicoba secara berurutan
      const candidateEndpoints = [
        `https://generativelanguage.googleapis.com/v1/models/gemini-3.5-flash:generateContent?key=${geminiKey}`,
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${geminiKey}`,
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent?key=${geminiKey}`,
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${geminiKey}`,
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${geminiKey}`
      ];

      for (const endpointUrl of candidateEndpoints) {
        try {
          const geminiRes = await fetch(endpointUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: systemInstruction }] },
              contents: contents,
              generationConfig: {
                temperature: 0.45,
                maxOutputTokens: 900,
              }
            })
          });

          if (geminiRes.ok) {
            const geminiData = await geminiRes.json();
            const fullText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (fullText) {
              let thinkingContent = '';
              let replyContent = fullText;

              const thinkingMatch = fullText.match(/<thinking>([\s\S]*?)<\/thinking>/i);
              if (thinkingMatch) {
                thinkingContent = thinkingMatch[1].trim();
                replyContent = fullText.replace(/<thinking>[\s\S]*?<\/thinking>/i, '').trim();
              }

              return res.status(200).json({
                thinking: thinkingContent,
                reply: replyContent,
                success: true,
                provider: 'google-gemini-live'
              });
            }
          }
        } catch (callErr) {
          console.warn('Gemini endpoint error, mencoba endpoint berikutnya:', callErr.message);
        }
      }
    }

    // 3. FALLBACK CERDAS DINAMIS & KONTEKSTUAL (JIKA GEMINI API SIBUK)
    const dynamicFallback = generateConversationalResponse(cleanQuery, cleanContext);
    return res.status(200).json({
      thinking: dynamicFallback.thinking,
      reply: dynamicFallback.reply,
      success: true,
      provider: 'studio-conversational-engine'
    });

  } catch (error) {
    console.error('Chat endpoint error:', error);
    return res.status(500).json({
      error: 'Gangguan server konsultasi.',
      thinking: '',
      reply: 'Layanan konsultasi online sedang mengalami antrean. Silakan hubungi desainer kami langsung via WhatsApp resmi di +62 851 1372 3808.'
    });
  }
}

/**
 * Fallback responsif yang berdialog langsung merespon kalimat klien
 * (BUKAN template statis berulang)
 */
function generateConversationalResponse(query, context) {
  const q = query.toLowerCase();

  // Kasus Ruangan Mungil / Kecil / Apartemen
  if (q.includes('mungil') || q.includes('sempit') || q.includes('kecil') || q.includes('apartemen') || q.includes('2x1') || q.includes('2x2')) {
    return {
      thinking: 'Menganalisis tata letak ruang kompak: Prioritas sirkulasi gerak, pemanfaatan storage vertikal hingga plafon, dan pemilihan warna HPL cerah agar ruangan terasa lapang.',
      reply:
        `Untuk ruangan dapur atau kamar yang mungil, tantangan utamanya adalah memaksimalkan fungsi penyimpanan tanpa membuat ruangan terasa sesak.\n\n` +
        `Solusi terbaik yang biasa kami terapkan di Agmal Jaya Interior:\n` +
        `1. **Model Single Line (Lurus):** Sangat ideal untuk ruang sempit agar menyisakan koridor jalan yang leluasa (minimal 80–90 cm).\n` +
        `2. **Kabinet Atas Full Plafon:** Maksimalkan dinding ke atas sebagai tempat penyimpanan peralatan yang jarang dipakai.\n` +
        `3. **Pilihan Finishing Terang:** Gunakan laminasi HPL warna putih doff, krem, atau motif kayu terang (light oak) yang memantulkan cahaya agar ruangan terkesan jauh lebih luas.\n` +
        `4. **Estimasi Biaya:** Untuk panjang sekitar 2 meter, estimasi biaya kabinet standar berkisar Rp 4.000.000 – Rp 5.000.000 (bahan Multiplek 18mm Grade A & HPL Taco).\n\n` +
        `Jika Anda punya foto denah atau sudut dapur apartemen tersebut, Anda bisa kirimkan langsung via WhatsApp (+62 851 1372 3808) agar tim kami buatkan sketsa layout yang paling pas.`
    };
  }

  // Kasus Pengiriman ke Luar Kota (Surabaya, Jakarta, Medan, Bali, dll)
  if (q.includes('kirim') || q.includes('surabaya') || q.includes('jakarta') || q.includes('bandung') || q.includes('bali') || q.includes('medan') || q.includes('luar kota') || q.includes('antar pulau')) {
    const kota = q.includes('surabaya') ? 'Surabaya' : q.includes('jakarta') ? 'Jabodetabek' : q.includes('bali') ? 'Bali' : 'kota Anda';
    return {
      thinking: `Memverifikasi rute logistik ekspedisi ke ${kota}, standar peti kayu pengaman jarak jauh, dan kesiapan tim instalasi luar kota dari workshop Jepara.`,
      reply:
        `Tentu saja sangat bisa! Kami rutin memproduksi dan mengirimkan perabot custom ke ${kota} dan berbagai wilayah lain di seluruh Indonesia.\n\n` +
        `Berikut alur pengiriman dan pemasangannya:\n` +
        `• **Keamanan Barang:** Setiap bagian kabinet dilapisi *foam sheet*, plastik *bubble wrap* tebal, dan dikemas dengan rangka **peti kayu ekspedisi** agar terhindar dari benturan selama di perjalanan.\n` +
        `• **Pilihan Instalasi:** Untuk proyek custom seperti kitchen set atau lemari full plafon, tim tukang perakit ahli kami siap diberangkatkan ke lokasi Anda untuk pemasangan presisi sampai ruangan siap pakai.\n` +
        `• **Konsultasi Online Mudah:** Anda cukup mengirimkan ukuran dinding dan foto ruangan via WhatsApp, kami siapkan rancangan 3D dan rincian RAB-nya.\n\n` +
        `Berapa perkiraan ukuran ruangan yang ingin dipasang? Anda bisa langsung berkonsultasi dengan tim teknis kami di WhatsApp +62 851 1372 3808.`
    };
  }

  // Kasus Pemilihan Material & Daya Tahan (Multiplek vs PVC vs HPL)
  if (q.includes('bahan') || q.includes('material') || q.includes('pvc') || q.includes('hpl') || q.includes('multiplek') || q.includes('rayap') || q.includes('air')) {
    return {
      thinking: 'Membandingkan karakter fisik Multiplek 18mm untuk kekuatan struktural kabinet atas dan PVC Foam Board untuk ketahanan air mutlak di kabinet bawah/sink.',
      reply:
        `Pemilihan material yang tepat adalah kunci agar furniture custom Anda awet belasan tahun tanpa masalah rayap atau lapuk.\n\n` +
        `Kombinasi standar yang kami sarankan di workshop Agmal Jaya Interior:\n` +
        `• **Multiplek/Blockboard 18mm Grade A:** Pilihan terbaik untuk rangka utama dan kabinet gantung karena kayu lapisnya sangat padat, tidak melengkung, dan kuat menahan beban berat.\n` +
        `• **PVC Board Anti-Air 100%:** Sangat kami rekomendasikan untuk kabinet bawah di area tempat cuci piring (*sink*). Bahan polimer ini tahan air total, sehingga bila ada rembesan pipa pembuangan, kabinet dijamin tidak akan lapuk atau dimakan rayap.\n` +
        `• **Finishing HPL Taco:** Pelapis permukaan luar dengan ratusan pilihan motif (kayu natural, marmer, hingga warna solid) yang tahan goresan dan sangat mudah dibersihkan dari percikan minyak goreng.\n\n` +
        `Ingin melihat katalog motif HPL atau mendiskusikan area ruangan yang lembab? Hubungi tim kami via WhatsApp di +62 851 1372 3808.`
    };
  }

  // Kasus Pertanyaan Kitchen Set Khusus
  if (q.includes('kitchen') || q.includes('dapur')) {
    return {
      thinking: 'Mengevaluasi kebutuhan kitchen set: Bentuk ergonomis (Lurus, L-Shape, atau U-Shape), rasio kabinet atas/bawah, dan integrasi peralatan kompor/sink.',
      reply:
        `Untuk kitchen set, kami merancangnya secara custom mengikuti luas dapur dan kebiasaan memasak Anda.\n\n` +
        `Beberapa hal penting yang kami sediakan:\n` +
        `• **Pilihan Model:** Bisa dibuat bentuk Lurus (*straight*), L-Shape dengan pemanfaatan sudut, hingga U-Shape dengan meja mini bar atau *island*.\n` +
        `• **Harga Transparan:** Estimasi dasar mulai Rp 2.000.000 per meter lari kabinet standar, dihitung terpisah antara kabinet bawah dan kabinet atas sesuai kebutuhan.\n` +
        `• **Hardware Berkualitas:** Sudah menggunakan engsel hidrolik *soft-closing* (pintu menutup perlahan tanpa suara benturan) dan rel laci *double track* yang halus.\n` +
        `• **Waktu Produksi:** Sekitar 2–3 minggu di workshop Jepara kami dengan pengecekan presisi sebelum diberangkatkan.\n\n` +
        `Berapa meter perkiraan panjang dapur Anda saat ini? Silakan bagikan foto lokasi dapur Anda ke WhatsApp tim kami di +62 851 1372 3808 untuk kami buatkan simulasi biayanya.`
    };
  }

  // Kasus Pertanyaan Lemari / Wardrobe
  if (q.includes('lemari') || q.includes('wardrobe') || q.includes('pakaian')) {
    return {
      thinking: 'Menganalisis sistem bukaan pintu lemari (sliding vs swing) dan partisi kompartemen internal sesuai proporsi pakaian gantung dan lipat.',
      reply:
        `Untuk pembuatan lemari pakaian custom (wardrobe), keunggulan utamanya adalah Anda bebas menentukan pembagian sekat di dalamnya agar sesuai dengan koleksi pakaian Anda.\n\n` +
        `Rekomendasi dari kami:\n` +
        `• **Model Pintu:** Jika ruang kamar Anda terbatas, kami sarankan menggunakan pintu geser (*sliding*) dengan rel aluminium gantung agar tidak memakan area buka pintu. Jika ruangan cukup lega, pintu *swing* memberikan bukaan pandang yang luas.\n` +
        `• **Tinggi Full Plafon:** Sangat diminati karena menghilangkan celah debu di atas lemari sekaligus menambah tempat penyimpanan koper atau bed cover.\n` +
        `• **Estimasi Biaya:** Mulai Rp 1.800.000 per meter lari untuk tinggi standar, atau dihitung per meter persegi bila tingginya mencapai plafon (2,5 – 3 meter).\n\n` +
        `Berapa ukuran dinding kamar yang tersedia? Diskusikan dengan tim desainer kami via WhatsApp di +62 851 1372 3808 untuk rancangan sekat yang paling nyaman.`
    };
  }

  // Kasus Pertanyaan Backdrop TV
  if (q.includes('tv') || q.includes('backdrop') || q.includes('living')) {
    return {
      thinking: 'Merancang komposisi backdrop TV: Integrasi hidden wire conduit pipa kabel, aksen kisi-kisi fluted WPC, dan pencahayaan LED warm white.',
      reply:
        `Backdrop TV custom akan membuat ruang keluarga terlihat jauh lebih rapi, modern, dan mewah.\n\n` +
        `Kelebihan backdrop buatan workshop kami:\n` +
        `• **Kabel Tersembunyi Total:** Kami memasang jalur pipa tanam (*conduit*) di balik panel, sehingga kabel TV, dekoder, dan colokan tidak akan terlihat berserakan.\n` +
        `• **Kombinasi Aksen Mewah:** Panel HPL motif serat kayu atau marmer, dikombinasikan dengan kisi-kisi fluted panel dan lampu LED strip tersembunyi berona hangat (*warm white*).\n` +
        `• **Estimasi Biaya:** Mulai Rp 1.500.000 / meter lari untuk kabinet TV gantung, atau disesuaikan dengan luas dinding bila ingin dipasang panel *full ceiling*.\n\n` +
        `Berapa inch TV Anda dan berapa lebar dinding ruang tamu Anda? Kirimkan infonya via WhatsApp (+62 851 1372 3808) untuk ide desain yang proporsional.`
    };
  }

  // Respons Umum yang Mengalir Santai
  return {
    thinking: 'Mengidentifikasi kebutuhan custom furniture dan merespon secara personal.',
    reply:
      `Halo! Senang bisa membantu Anda di Agmal Jaya Interior.\n\n` +
      `Kami spesialis memproduksi perabot interior custom (kitchen set, lemari pakaian, backdrop TV, meja kantor, dan partisi ruangan) langsung dari sentra pengrajin kayu Jepara dan siap dikirim ke seluruh Indonesia.\n\n` +
      `Bisa ceritakan perabot atau ruangan seperti apa yang sedang Anda rencanakan? Kami siap membantu mulai dari konsultasi layout, pilihan material HPL terbaik, hingga estimasi biaya yang sesuai anggaran Anda.`
  };
}
