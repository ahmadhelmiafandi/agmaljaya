import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// --- BRAND COLORS ---
const colorGold: [number, number, number] = [176, 141, 87]; // #b08d57
const colorEspresso: [number, number, number] = [74, 66, 62]; // #4a423e

// --- Types ---
interface RoomConfig {
  width: number;
  length: number;
  height: number;
  shape?: string;
}

interface ProductSelection {
  productId: string;
  shape?: string;
  name?: string;
}

interface DesignConfig {
  model: string;
  materialId: string;
  accessories: string[];
}

interface FixtureItem {
  id: string;
  type: string;
  [key: string]: unknown;
}

interface Config2D {
  room: RoomConfig;
  productSelection: ProductSelection;
  design: DesignConfig;
  fixtures: FixtureItem[];
}

interface Product {
  id: string;
  name: string;
  [key: string]: unknown;
}

interface Material {
  id: string;
  name: string;
  [key: string]: unknown;
}

interface Accessory {
  id: string;
  name: string;
  price: number;
  [key: string]: unknown;
}

interface Metadata2D {
  products: Product[];
  materials: Material[];
  accessories: Accessory[];
}

interface CustomerInfo {
  name?: string;
  phone?: string;
  address?: string;
}

interface QuotationPDFParams {
  config: Config2D;
  metadata: Metadata2D;
  estimatedPrice: number;
  customer?: CustomerInfo;
}

interface BOMItemMaterial {
  part: string;
  name: string;
  brand: string;
}

interface BOMItemDimensions {
  width: number;
  depth: number;
  height: number;
}

interface BOMItem {
  name: string;
  dimensions: BOMItemDimensions;
  materials: BOMItemMaterial[];
  subtotal: number;
}

interface BOMData {
  items: BOMItem[];
  total: number;
}

interface Quotation3DPDFParams {
  bom: BOMData;
  roomConfig?: RoomConfig;
  customer?: CustomerInfo;
}

export async function generateQuotationPDF({ config, metadata, estimatedPrice, customer }: QuotationPDFParams): Promise<void> {
    const doc = new jsPDF();
    const { room, productSelection, design, fixtures } = config;
    const { products, materials, accessories } = metadata;

    const product = products.find(p => p.id === productSelection.productId);
    const material = materials.find(m => m.id === design.materialId);
    const accs = accessories.filter(a => design.accessories.includes(a.id));

    // --- HEADER ---
    doc.setFillColor(...colorEspresso);
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('AGMAL JAYA INTERIOR', 20, 25);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(200, 200, 200);
    doc.text('Custom Modern Furniture & Interior Specialist', 20, 32);

    // Date & ID
    const dateStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text(`Quotation No: AFN-${Date.now().toString().slice(-6)}`, 150, 20);
    doc.text(`Tanggal: ${dateStr}`, 150, 25);

    // --- CUSTOMER INFO ---
    doc.setTextColor(...colorEspresso);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('DATA PELANGGAN', 20, 55);

    autoTable(doc, {
        startY: 60,
        margin: { left: 20 },
        theme: 'plain',
        body: [
            ['Nama Lengkap', customer?.name || '-'],
            ['Nomor WhatsApp', customer?.phone || '-'],
            ['Alamat Lokasi', customer?.address || '-'],
        ],
        bodyStyles: { fontSize: 10, cellPadding: 2 },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 40 } }
    });

    // --- CONFIGURATION DETAILS ---
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('RINCIAN PESANAN', 20, (doc as any).lastAutoTable.finalY + 15);

    autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 20,
        margin: { left: 20, right: 20 },
        headStyles: { fillColor: colorGold, textColor: 255, fontStyle: 'bold' },
        head: [['Kategori', 'Detail Spesifikasi']],
        body: [
            ['Produk Utama', `${product?.name || '-'} (${productSelection.shape})`],
            ['Gaya Desain', design.model],
            ['Material Utama', material?.name || '-'],
            ['Ukuran Ruangan', `${room.length}cm x ${room.width}cm x ${room.height}cm`],
            ['Bentuk Ruangan', room.shape || '-'],
            ['Pintu & Jendela', `${fixtures.length} item ditemukan`],
        ],
        styles: { fontSize: 10, cellPadding: 5 }
    });

    // --- ADD-ONS / ACCESSORIES ---
    if (accs.length > 0) {
        autoTable(doc, {
            startY: (doc as any).lastAutoTable.finalY + 10,
            margin: { left: 20, right: 20 },
            headStyles: { fillColor: [240, 240, 240], textColor: [50, 50, 50], fontStyle: 'bold' },
            head: [['Aksesori Tambahan', 'Biaya']],
            body: accs.map(a => [a.name, `Rp ${a.price.toLocaleString('id-ID')}`]),
            styles: { fontSize: 9, cellPadding: 4 }
        });
    }

    // --- SUMMARY & PRICE ---
    const finalY: number = (doc as any).lastAutoTable.finalY + 15;
    doc.setFillColor(248, 250, 252); // slate-50
    doc.rect(20, finalY, 170, 30, 'F');
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.rect(20, finalY, 170, 30, 'S');

    doc.setTextColor(...colorEspresso);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL ESTIMASI BIAYA:', 30, finalY + 13);

    doc.setTextColor(...colorGold);
    doc.setFontSize(18);
    doc.text(`Rp ${estimatedPrice.toLocaleString('id-ID')}`, 30, finalY + 23);

    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.text('*Estimasi harga ini belum termasuk diskon promo (jika ada).', 30, finalY + 38);
    doc.text('*Harga final akan ditentukan setelah survey lokasi dan pengecekan material.', 30, finalY + 43);

    // --- FOOTER ---
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text('AGMAL JAYA INTERIOR - Workshop: GRGQ+X38 Bumiharjo, Kec. Keling, Jepara Regency, Central Java 59454', 105, 285, { align: 'center' });
        doc.text(`Halaman ${i} dari ${pageCount}`, 105, 290, { align: 'center' });
    }

    // --- SAVE FILE ---
    doc.save(`AGMAL-JAYA-Interior-Quotation-${customer?.name?.replace(/\s+/g, '-') || 'Draft'}.pdf`);
}

/**
 * generate3DQuotationPDF — Export Quotation PDF dari 3D Configurator
 */
export async function generate3DQuotationPDF({ bom, roomConfig, customer }: Quotation3DPDFParams): Promise<void> {
    const doc = new jsPDF();
    const dateStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const quoteNo = `AFN-3D-${Date.now().toString().slice(-6)}`;

    // --- HEADER ---
    doc.setFillColor(...colorEspresso);
    doc.rect(0, 0, 210, 42, 'F');

    // Decorative Gold Accent Line
    doc.setFillColor(...colorGold);
    doc.rect(0, 42, 210, 3, 'F');

    // Title / Brand
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('AGMAL JAYA INTERIOR', 20, 21);

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(210, 210, 210);
    doc.text('Custom Modern Furniture & Interior Specialist', 20, 28);
    doc.text('Workshop: GRGQ+X38 Bumiharjo, Kec. Keling, Jepara Regency, Central Java 59454', 20, 33);

    // Quote details (Right aligned)
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('SURAT PENAWARAN HARGA (3D)', 190, 18, { align: 'right' });
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(210, 210, 210);
    doc.text(`No: ${quoteNo}`, 190, 24, { align: 'right' });
    doc.text(`Tanggal: ${dateStr}`, 190, 30, { align: 'right' });
    doc.text(`Tipe: Kustom 3D Configurator`, 190, 36, { align: 'right' });

    // --- CUSTOMER & ROOM INFO PANEL ---
    doc.setFillColor(248, 250, 252); // slate-50
    doc.rect(20, 52, 170, 36, 'F');
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.rect(20, 52, 170, 36, 'S');

    doc.setTextColor(...colorEspresso);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('PELANGGAN:', 25, 60);
    doc.text('INFORMASI RUANGAN:', 115, 60);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text(`Nama: ${customer?.name || '-'}`, 25, 67);
    doc.text(`WhatsApp: ${customer?.phone || '-'}`, 25, 73);
    doc.text(`Alamat: ${customer?.address || '-'}`, 25, 79);

    if (roomConfig) {
      doc.text(`Lebar Ruang: ${roomConfig.width} cm`, 115, 67);
      doc.text(`Panjang Ruang: ${roomConfig.length} cm`, 115, 73);
      doc.text(`Tinggi Ruang: ${roomConfig.height} cm`, 115, 79);
    } else {
      doc.text('Spesifikasi Ruangan: -', 115, 67);
    }

    // --- BILL OF MATERIALS TABLE ---
    doc.setTextColor(...colorEspresso);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('BILL OF MATERIALS (BOM) & RINCIAN FURNITUR', 20, 99);

    const tableRows = bom.items.map((item, index) => {
      const matStr = item.materials.map(m => 
        `- ${m.part}: ${m.name} (${m.brand})`
      ).join('\n');
      
      const dims = `${item.dimensions.width}x${item.dimensions.depth}x${item.dimensions.height} cm`;

      return [
        index + 1,
        item.name,
        dims,
        matStr || 'Default Material',
        `Rp ${item.subtotal.toLocaleString('id-ID')}`
      ];
    });

    autoTable(doc, {
        startY: 104,
        margin: { left: 20, right: 20 },
        headStyles: { fillColor: colorEspresso, textColor: 255, fontStyle: 'bold', fontSize: 9 },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        head: [['No', 'Modul Furnitur', 'Dimensi', 'Spesifikasi Material / HPL', 'Subtotal']],
        body: tableRows,
        columnStyles: {
            0: { cellWidth: 10, halign: 'center' },
            1: { cellWidth: 40, fontStyle: 'bold' },
            2: { cellWidth: 35 },
            3: { cellWidth: 55, fontSize: 8.5 },
            4: { cellWidth: 30, halign: 'right', fontStyle: 'bold', textColor: colorGold }
        },
        styles: { 
            fontSize: 9, 
            cellPadding: 5, 
            valign: 'middle',
            lineColor: [226, 232, 240],
            lineWidth: 0.1
        }
    });

    // --- PRICING SUMMARY & SIGNATURES ---
    let currentY = (doc as any).lastAutoTable.finalY + 12;
    
    // Safety check for page break (need at least 95 units height for summary + terms + signatures)
    if (currentY > 180) {
      doc.addPage();
      currentY = 25;
    }

    // Draw total summary card
    doc.setFillColor(...colorEspresso);
    doc.rect(20, currentY, 170, 26, 'F');
    // Accent gold stripe on the left of the total card
    doc.setFillColor(...colorGold);
    doc.rect(20, currentY, 3, 26, 'F');

    doc.setTextColor(230, 230, 230);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL ESTIMASI HARGA PRODUKSI (3D):', 28, currentY + 10);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(15);
    doc.setFont('helvetica', 'bold');
    doc.text(`Rp ${bom.total.toLocaleString('id-ID')}`, 28, currentY + 19);

    // Right-aligned status stamp inside the box
    doc.setTextColor(...colorGold);
    doc.setFontSize(9);
    doc.text('SANDBOX DEMO APPROVED', 185, currentY + 15, { align: 'right' });

    // --- TERMS & CONDITIONS ---
    doc.setTextColor(...colorEspresso);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('SYARAT & KETENTUAN PRODUKSI:', 20, currentY + 36);
    
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    const terms = [
        '1. Nilai penawaran di atas adalah estimasi awal berdasarkan modul 3D yang dipilih.',
        '2. Harga final & spesifikasi detail akan ditentukan setelah survey lapangan oleh tim teknis kami.',
        '3. Produksi akan dimulai setelah pembayaran Down Payment (DP) minimal sebesar 50%.',
        '4. Waktu pengerjaan berkisar antara 14-21 hari kerja setelah desain disetujui (ACC).',
        '5. Pelunasan dilakukan maksimal 3 hari setelah instalasi selesai dilakukan di lokasi.',
    ];
    let termsY = currentY + 42;
    terms.forEach(term => {
        doc.text(term, 20, termsY);
        termsY += 4.5;
    });

    // --- SIGNATURES ---
    let sigY = termsY + 8;
    if (sigY > 255) {
      doc.addPage();
      sigY = 25;
    }
    
    // Draw signature line divider
    doc.setDrawColor(240, 240, 240);
    doc.line(20, sigY - 2, 190, sigY - 2);

    doc.setTextColor(...colorEspresso);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Persetujuan Pelanggan,', 45, sigY + 5, { align: 'center' });
    doc.text('Hormat Kami,', 165, sigY + 5, { align: 'center' });
    
    doc.setTextColor(150, 150, 150);
    doc.setFont('helvetica', 'normal');
    doc.text('(____________________)', 45, sigY + 28, { align: 'center' });
    doc.text('AGMAL JAYA INTERIOR', 165, sigY + 28, { align: 'center' });

    // --- FOOTER ON ALL PAGES ---
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text('AGMAL JAYA INTERIOR - Workshop: GRGQ+X38 Bumiharjo, Kec. Keling, Jepara Regency, Central Java 59454', 105, 285, { align: 'center' });
        doc.text(`Halaman ${i} dari ${pageCount}`, 105, 290, { align: 'center' });
    }

    // --- SAVE ---
    doc.save(`AGMAL-JAYA-Interior-3D-Quotation-${customer?.name?.replace(/\s+/g, '-') || 'Draft'}.pdf`);
}
