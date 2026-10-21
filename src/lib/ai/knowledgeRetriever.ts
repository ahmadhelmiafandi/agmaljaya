import { api, WebsiteData } from '../api';
import { defaultData } from '../../data/defaultWebsiteData';

/**
 * Mengambil dan memfilter knowledge base internal Supabase
 * berdasarkan kata kunci pertanyaan pengguna (RAG - Knowledge Injection).
 */
export async function retrieveRelevantContext(userQuery: string): Promise<string> {
  let websiteData: WebsiteData;
  try {
    websiteData = await api.getWebsiteData();
  } catch (err) {
    console.warn('Gagal memuat data live Supabase, menggunakan defaultData:', err);
    websiteData = defaultData;
  }

  const queryLower = userQuery.toLowerCase();
  const chunks: string[] = [];

  // 1. Core Profile & Contact Info (Always included for grounding)
  const contact = websiteData.settings.contact || defaultData.settings.contact;
  const site = websiteData.settings.site || defaultData.settings.site;
  const about = websiteData.settings.about || defaultData.settings.about;

  chunks.push(
    `[PROFIL PERUSAHAAN & LOKASI]:
Nama: ${site.name || 'AGMAL JAYA INTERIOR'}
Tagline: ${site.tagline || 'Spesialis Desain & Produksi Interior Custom Seluruh Indonesia'}
Pusat Workshop: Jepara, Jawa Tengah (${contact.address || 'Bagor, Bumiharjo, Kec. Keling, Jepara Regency, Central Java'})
Jangkauan Layanan: Melayani pemesanan, pengiriman dengan packing kayu aman, dan instalasi tim ahli ke SELURUH INDONESIA (Skala Nasional: Jabodetabek, Jawa, Bali, Sumatera, Kalimantan, Sulawesi, dll).
WhatsApp Resmi: ${contact.phone || '+62 851 1372 3808'}
Instagram: ${contact.instagram || '@agmal_jaya'}
Tentang: ${about.description || 'Spesialis furniture custom modern berstandar tinggi langsung dari workshop Jepara.'}`
  );

  // 2. Alur Kerja & Survei (How It Works)
  const howItWorks = websiteData.settings.howItWorks || defaultData.settings.howItWorks;
  if (
    queryLower.includes('alur') ||
    queryLower.includes('cara') ||
    queryLower.includes('pesan') ||
    queryLower.includes('order') ||
    queryLower.includes('survey') ||
    queryLower.includes('survei') ||
    queryLower.includes('tahap') ||
    queryLower.includes('lama') ||
    queryLower.includes('minggu') ||
    queryLower.includes('hari') ||
    chunks.length < 3
  ) {
    const steps = howItWorks.map((step, idx) => `${idx + 1}. ${step.title}: ${step.desc}`).join('\n');
    chunks.push(`[ALUR PEMESANAN & SURVEI]:\n${steps}\nEstimasi waktu produksi workshop rata-rata 2 hingga 3 minggu setelah desain dan spesifikasi disetujui.`);
  }

  // 3. Produk & Estimasi Harga Dasar
  const products = websiteData.products || defaultData.products;
  const productMatches = products.filter((p) => {
    const nameLower = p.name.toLowerCase();
    return (
      queryLower.includes(nameLower) ||
      (nameLower.includes('kitchen') && (queryLower.includes('dapur') || queryLower.includes('kitchen'))) ||
      (nameLower.includes('lemari') && (queryLower.includes('wardrobe') || queryLower.includes('pakaian') || queryLower.includes('baju'))) ||
      (nameLower.includes('tv') && (queryLower.includes('backdrop') || queryLower.includes('rak') || queryLower.includes('living'))) ||
      (nameLower.includes('meja') && (queryLower.includes('kerja') || queryLower.includes('kantor') || queryLower.includes('meeting')))
    );
  });

  const productsToShow = productMatches.length > 0 ? productMatches : products;
  const productText = productsToShow
    .map(
      (p) =>
        `- ${p.name}: Bentuk/Varian (${p.shapes.join(', ')}), Estimasi dasar mulai dari Rp ${p.basePrice.toLocaleString('id-ID')}/meter (dapat disesuaikan dengan volume, material, dan aksesoris).`
    )
    .join('\n');
  chunks.push(`[KATALOG PRODUK & STANDAR BIAYA DASAR]:\n${productText}`);

  // 4. Spesifikasi Material & Aksesoris
  const materials = websiteData.materials || defaultData.materials;
  const accessories = websiteData.accessories || defaultData.accessories;
  if (
    queryLower.includes('bahan') ||
    queryLower.includes('material') ||
    queryLower.includes('hpl') ||
    queryLower.includes('multiplek') ||
    queryLower.includes('pvc') ||
    queryLower.includes('kayu') ||
    queryLower.includes('engsel') ||
    queryLower.includes('led') ||
    queryLower.includes('aksesoris') ||
    chunks.length < 4
  ) {
    const matList = materials.map((m) => `- ${m.name} (Tipe: ${m.type})`).join('\n');
    const accList = accessories.map((a) => `- ${a.name}: Rp ${a.price.toLocaleString('id-ID')}`).join('\n');
    chunks.push(
      `[SPESIFIKASI MATERIAL & FINISHING]:\n${matList}\nCatatan Material: Multiplek/Blockboard Grade A dengan laminasi HPL tahan gores & panas, PVC Board anti-air & anti-rayap untuk area basah, serta Kayu Solid Jepara berkelas.`
    );
    chunks.push(`[OPSI AKSESORIS & HARDWARE]:\n${accList}\nAksesoris standar meliputi engsel soft-closing slow-motion, rel laci double track / push-to-open, dan lampu LED strip profil aluminium.`);
  }

  // 5. Frequently Asked Questions (FAQ)
  const faqs = websiteData.settings.faqs || defaultData.settings.faqs;
  const relevantFaqs = faqs.filter(
    (faq) =>
      queryLower.includes('luar kota') ||
      queryLower.includes('kirim') ||
      queryLower.includes('ekspedisi') ||
      queryLower.includes('pinterest') ||
      queryLower.includes('custom') ||
      queryLower.includes('desain') ||
      faq.q.toLowerCase().split(' ').some((word) => word.length > 4 && queryLower.includes(word))
  );

  const faqsToShow = relevantFaqs.length > 0 ? relevantFaqs : faqs.slice(0, 3);
  const faqText = faqsToShow.map((f) => `Q: ${f.q}\nA: ${f.a}`).join('\n\n');
  chunks.push(`[TANYA JAWAB RESMI (FAQ)]:\n${faqText}`);

  // 6. Portofolio Proyek Relevan (Contoh Nyata + Kisaran Nilai Proyek)
  const portfolio = websiteData.settings.portfolio || defaultData.settings.portfolio;
  const relevantPortfolio = portfolio.filter((item) => {
    const t = (item.title + ' ' + (item.desc || '') + ' ' + (item.category || '')).toLowerCase();
    return (
      (queryLower.includes('kitchen') && t.includes('kitchen')) ||
      (queryLower.includes('lemari') && (t.includes('lemari') || t.includes('wardrobe'))) ||
      (queryLower.includes('tv') && t.includes('tv')) ||
      (queryLower.includes('kamar') && (t.includes('kamar') || t.includes('bedroom'))) ||
      (queryLower.includes('kantor') && (t.includes('kantor') || t.includes('office') || t.includes('meeting'))) ||
      (queryLower.includes('partisi') && t.includes('partisi'))
    );
  });

  const portfolioToShow = relevantPortfolio.length > 0 ? relevantPortfolio.slice(0, 3) : portfolio.slice(0, 2);
  const portfolioText = portfolioToShow
    .map((p) => `- ${p.title} (${p.category || 'Custom'}): ${p.desc || ''} - Estimasi Proyek: ${p.price || 'Sesuai Spesifikasi'}`)
    .join('\n');
  chunks.push(`[CONTOH REALISASI PORTOFOLIO]:\n${portfolioText}`);

  return chunks.join('\n\n---\n\n');
}
