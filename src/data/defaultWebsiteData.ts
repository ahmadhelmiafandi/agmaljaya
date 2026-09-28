import { WebsiteData } from '../lib/api';

export const defaultData: WebsiteData = {
    products: [
        { id: '1', name: 'Kitchen Set', shapes: ['Lurus', 'L-shape', 'U-shape'], basePrice: 2000000, active: true },
        { id: '2', name: 'Lemari Pakaian', shapes: ['Lurus', 'L-shape'], basePrice: 1800000, active: true },
        { id: '3', name: 'Meja Kerja', shapes: ['Lurus', 'L-shape'], basePrice: 1200000, active: true },
        { id: '4', name: 'Rak TV', shapes: ['Lurus'], basePrice: 1500000, active: true }
    ],
    materials: [
        { id: '1', name: 'Multiplek + HPL', priceModifier: 1.0, type: 'core' },
        { id: '2', name: 'PVC', priceModifier: 1.2, type: 'core' },
        { id: '3', name: 'Kayu Solid', priceModifier: 2.0, type: 'core' }
    ],
    accessories: [
        { id: '1', name: 'Engsel Soft Closing', price: 150000, type: 'hardware' },
        { id: '2', name: 'Lampu LED Strip', price: 250000, type: 'lighting' },
        { id: '3', name: 'Rak Piring Tarik', price: 450000, type: 'rack' }
    ],
    settings: {
        site: {
            name: "AGMAL JAYA INTERIOR",
            tagline: "Spesialis Desain & Produksi Interior Custom Seluruh Indonesia",
            logo: "/brand/logo-icon-light.png",
            adminLogo: "/brand/logo-icon-dark.png"
        },
        seo: {
            title: "AGMAL JAYA INTERIOR | Jasa Desain & Produksi Interior Custom Seluruh Indonesia",
            description: "Spesialis jasa desain & pembuatan kitchen set, lemari pakaian, backdrop TV, dan interior custom langsung dari Jepara. Melayani pengiriman & instalasi ke seluruh Indonesia (skala nasional). WhatsApp: +62 851 1372 3808."
        },
        hero: {
            title: "Estetika Modern,\nPresisi Sempurna.",
            subtitle: "Wujudkan interior impian Anda bersama AGMAL JAYA INTERIOR. Spesialis kitchen set, lemari pakaian, backdrop TV, dan furniture custom langsung dari workshop Jepara — melayani konsultasi, pengiriman, dan instalasi ke seluruh wilayah Indonesia."
        },
        about: {
            description: "Workshop AGMAL JAYA INTERIOR berpusat di Jepara, sentra mebel & perkayuan terkemuka Indonesia. Kami adalah eksekutor ahli dengan jam terbang ribuan jam memproduksi furniture custom modern berstandar tinggi. Spesialisasi kami adalah perpaduan desain modern kontemporer dengan durabilitas material grade A (Multiplek/Blockboard) yang dikirim dan dipasang dengan aman ke seluruh pelosok Nusantara.",
            badgeValue: '5+',
            badgeTitle: 'Tahun Pengalaman',
            badgeSub: 'Workshop Jepara — Jangkauan Nasional',
            img: '/images/workshop-jepara.jpg'
        },
        contact: {
            phone: "+62 851 1372 3808",
            email: "hello@agmaljaya-interior.com",
            address: "Bagor, Bumiharjo, Kec. Keling, Jepara Regency, Central Java",
            mapUrl: "https://maps.google.com/maps?q=-6.4725558,110.8376500&t=&z=16&ie=UTF8&iwloc=&output=embed",
            mapDirectUrl: "https://maps.app.goo.gl/yUqCa27DvDex4TTS8?g_st=iw",
            instagram: "https://www.instagram.com/agmal_jaya?stkn=em1kZnZleWx4anV2"
        },
        faqs: [
            { q: 'Apakah AGMAL JAYA INTERIOR melayani pengiriman & proyek ke seluruh Indonesia?', a: 'Ya! AGMAL JAYA INTERIOR melayani pemesanan, pengiriman, dan instalasi interior & furniture custom ke seluruh wilayah Indonesia (skala nasional). Workshop pusat kami berada di Jepara dengan packing kayu standar ekspedisi yang sangat aman, serta tim instalasi ahli siap diberangkatkan untuk perakitan di lokasi Anda (Jabodetabek, Jawa, Bali, Sumatera, Kalimantan, Sulawesi, dll).' },
            { q: 'Bagaimana alur pemesanan dan konsultasi jika berada di luar kota?', a: 'Sangat mudah! Anda cukup mengirimkan ukuran ruangan atau denah melalui WhatsApp. Desainer kami akan membuatkan estimasi biaya dan visualisasi desain. Setelah disepakati, produksi dilakukan di workshop Jepara kami dan dikirim langsung ke alamat Anda.' },
            { q: 'Berapa lama proses pembuatan Kitchen Set & Furniture Custom?', a: 'Setelah desain dan rincian spesifikasi disetujui, waktu pengerjaan di workshop kami rata-rata memakan waktu 2 hingga 3 minggu tergantung kompleksitas, material, dan aksesoris yang dipilih.' },
            { q: 'Saya punya referensi desain dari Pinterest / Instagram, bisakah dibuatkan?', a: 'Tentu bisa! Kirimkan gambar referensi yang Anda inginkan ke WhatsApp kami. Tim kami akan menyesuaikan proporsi, ergonomi, dan pilihan material HPL terbaik sesuai anggaran Anda.' }
        ],
        testimonials: [
            { text: "Pesan kitchen set dari Jakarta, hasilnya sangat presisi dan rapi. Pengiriman dari Jepara aman tanpa lecet sedikitpun, tim instalasinya cepat dan profesional!", name: "Rudi Hartono", loc: "Jakarta Selatan" },
            { text: "Hasil kitchen set L-shape untuk rumah kami di Surabaya sangat memuaskan. Material HPL dan engsel soft-close kualitas top tier!", name: "Sinta Maharani", loc: "Surabaya" },
            { text: "Puas banget custom interior satu rumah di Bandung. Komunikasi lancar via WhatsApp, progress foto dikirim rutin dari workshop Jepara.", name: "Kevin Aprilio", loc: "Bandung" },
            { text: "Awalnya ragu pesan online antar pulau ke Medan, tapi packing kayunya super aman dan presisinya pas dengan layout ruangan.", name: "Budi Santoso", loc: "Medan" },
            { text: "Finishing rapi, material kuat dan anti-rayap. Lemari pakaian custom 3 meter terpasang sempurna di villa kami di Bali.", name: "Wayan Darmawan", loc: "Denpasar, Bali" },
            { text: "Pelayanan sangat ramah dan sabar saat konsultasi desain via WA. Harga transparan langsung dari produsen Jepara tanpa perantara.", name: "Andi Wijaya", loc: "Semarang" },
            { text: "Kualitas pengerjaan kayu khas Jepara memang beda kelas. Kitchen set dan partisi backdrop TV di Balikpapan sangat mewah!", name: "Maya Fitri", loc: "Balikpapan" },
            { text: "Sangat profesional melayani proyek cafe dan rumah tinggal kami di Makassar. Recommended untuk siapa saja di seluruh Indonesia!", name: "Hendra Gunawan", loc: "Makassar" }
        ],
        team: [
            { name: 'Aldo Pratama', role: 'Head of Architecture', img: '/brand/logo-icon-dark.png' },
            { name: 'Diana Risa', role: 'Interior Designer', img: '/brand/logo-icon-dark.png' },
            { name: 'Bimo', role: 'Workshop Supervisor', img: '/brand/logo-icon-dark.png' }
        ],
        services: [
            { title: 'Desain Interior Custom', desc: 'Solusi perancangan tata ruang, mulai dari apartemen kecil hingga rumah mewah dengan arsitek in-house.' },
            { title: 'Pembuatan Kitchen Set', desc: 'Dapur estetik dan fungsional (L-shape, U-shape, dll) dengan perhitungan ergonomi presisi dan aksesoris rak cerdas.' },
            { title: 'Furniture Custom', desc: 'Wardrobe lemari pakaian, rak TV, meja kerja cerdas yang didesain khusus menyesuaikan luas ruangan Anda.' },
            { title: 'Renovasi Interior Lengkap', desc: 'Dari perubahan partisi drywall, plafon, elektrikal hingga instalasi akhir furniture oleh tim ahli.' }
        ],
        howItWorks: [
            { title: 'Konsultasi Online', desc: 'Hubungi kami via WhatsApp untuk konsultasi jenis perabot, ukuran ruangan, dan estimasi harga secara instan.' },
            { title: 'Survey Lokasi', desc: 'Tim ukur profesional AGMAL JAYA INTERIOR akan datang mensurvey ruang Anda untuk sinkronisasi layout.' },
            { title: 'Produksi Workshop', desc: 'Pengerjaan 1-3 minggu di fasilitas mandiri (workshop kami) dengan material custom.' },
            { title: 'Instalasi', desc: 'Pemasangan rapi dan cepat minimal debu. Ruangan baru Anda siap digunakan.' }
        ],
        portfolio: [
            { span: 'col-span-1 row-span-2', img: '/images/portfolio/portfolio-01.jpg', title: 'Kitchen Set Minimalis L-Shape', desc: 'Kitchen set L-Shape serba putih dengan panel WPC fluted vertical, rak display terbuka berpencahayaan LED, dan meja kerja built-in. Material HPL premium anti-gores dengan finishing doff elegan.', category: 'Kitchen Set', price: 'Rp 18.000.000' },
            { span: 'col-span-1 row-span-1', img: '/images/portfolio/portfolio-02.jpg', title: 'Backdrop TV & Living Room Mewah', desc: 'Backdrop TV full ceiling dengan kombinasi panel geometris HPL dan cermin perunggu. Dilengkapi kabinet TV floating kayu walnut, LED strip tersembunyi, dan rak display samping.', category: 'Living Room', price: 'Rp 25.000.000' },
            { span: 'col-span-1 row-span-1', img: '/images/portfolio/portfolio-03.jpg', title: 'Set Kamar Tidur Pink Elegant', desc: 'Interior kamar tidur dengan headboard upholstery pink dusty, lemari wardrobe full ceiling dengan cermin bronze, meja nakas floating, dan LED cove lighting di plafon.', category: 'Bedroom', price: 'Rp 22.000.000' },
            { span: 'col-span-2 row-span-1', img: '/images/portfolio/portfolio-04.jpg', title: 'Kitchen Set dengan Mini Bar', desc: 'Kitchen set straight dengan kabinet atas bermotif wood grain dan fluted panel, backsplash marble, island mini bar dengan top marmer putih. Dilengkapi cooker hood dan rak piring terintegrasi.', category: 'Kitchen Set', price: 'Rp 15.000.000' },
            { span: 'col-span-1 row-span-1', img: '/images/portfolio/portfolio-05.jpg', title: 'Lemari Pakaian Klasik Putih', desc: 'Lemari pakaian 5 pintu gaya klasik dengan finishing cat duco putih, aksen gold list, dan lemari pajangan kaca samping. Nakas klasik dengan handle gold menambah kesan mewah.', category: 'Bedroom', price: 'Rp 16.000.000' },
            { span: 'col-span-1 row-span-2', img: '/images/portfolio/portfolio-06.jpg', title: 'Kitchen Set Premium Full Ceiling', desc: 'Kitchen set I-Shape premium dengan kabinet bawah panel shaker putih, kabinet atas kaca frame gold dengan backlit marble, rak display kayu, dan ceiling fluted panel. Material multiplek Grade A.', category: 'Kitchen Set', price: 'Rp 28.000.000' },
            { span: 'col-span-1 row-span-1', img: '/images/portfolio/portfolio-07.jpg', title: 'Kitchen Set Kabinet Kaca Gold', desc: 'Kitchen set mewah dengan upper cabinet kaca frame gold bermotif marmer backlit, lower cabinet shaker putih, dan middle cabinet kaca hitam. Finishing detail premium.', category: 'Kitchen Set', price: 'Rp 30.000.000' },
            { span: 'col-span-1 row-span-1', img: '/images/portfolio/portfolio-08.jpg', title: 'Kitchen Set Mint Green L-Shape', desc: 'Kitchen set L-Shape dengan HPL hijau mint segar, fluted panel ceiling, rak piring built-in, LED under-cabinet, dan backsplash marble. Sudah termasuk cooker hood dan pemasangan.', category: 'Kitchen Set', price: 'Rp 17.000.000' },
            { span: 'col-span-1 row-span-1', img: '/images/portfolio/portfolio-09.jpg', title: 'Partisi Ruangan & Lemari Display Gold', desc: 'Partisi ruangan mewah dengan cutting laser motif geometris gold, lemari display terbuka berpencahayaan LED, dan kabinet penyimpanan bawah. Plafon drop ceiling melengkungkan desain.', category: 'Partisi & Display', price: 'Rp 20.000.000' },
            { span: 'col-span-2 row-span-1', img: '/images/portfolio/portfolio-10.jpg', title: 'Kitchen Set Island Modern Abu-Abu', desc: 'Desain 3D render kitchen set U-Shape warna abu-abu gelap dengan island marble putih, fluted panel kabinet atas dengan kaca reeded, slot microwave dan dispenser terintegrasi.', category: 'Kitchen Set', price: 'Rp 35.000.000' },
            { span: 'col-span-1 row-span-2', img: '/images/portfolio/portfolio-11.jpg', title: 'Kitchen Set U-Shape Coklat Tua', desc: 'Kitchen set U-Shape dengan backsplash panel fluted kayu coklat gelap, LED strip ambient, skylight alami, dan kabinet bawah HPL abu-abu. Desain luas cocok untuk dapur besar.', category: 'Kitchen Set', price: 'Rp 24.000.000' },
            { span: 'col-span-1 row-span-1', img: '/images/portfolio/portfolio-12.jpg', title: 'Kitchen Set Straight Dark Mocha', desc: 'Kitchen set straight dengan warna dark mocha elegan, backsplash marble hitam, LED strip bawah kabinet, rak terbuka samping, dan finishing HPL premium anti-gores.', category: 'Kitchen Set', price: 'Rp 14.000.000' },
            { span: 'col-span-1 row-span-1', img: '/images/portfolio/portfolio-13.jpg', title: 'Kitchen Set Klasik Biru Navy', desc: 'Kitchen set gaya klasik dengan finishing cat duco biru navy, aksen gold, kabinet atas krem dengan rak display LED, island marmer putih, dan slot kulkas terintegrasi.', category: 'Kitchen Set', price: 'Rp 32.000.000' },
            { span: 'col-span-1 row-span-1', img: '/images/portfolio/portfolio-14.jpg', title: 'Kitchen Set & Meja Kerja Putih', desc: 'Kombinasi kitchen set L-Shape minimalis putih dengan meja kerja built-in dan panel WPC fluted vertical berpencahayaan LED. Desain multifungsi untuk hunian compact.', category: 'Kitchen Set', price: 'Rp 18.000.000' },
            { span: 'col-span-1 row-span-1', img: '/images/portfolio/portfolio-15.jpg', title: 'Meja Meeting Kantor Custom', desc: 'Meja meeting custom dengan top HPL motif kayu oak dan glass insert biru muda, built-in cable management, serta kaki besi powder coating putih. Wall panel akustik biru navy.', category: 'Furniture Kantor', price: 'Rp 8.000.000' },
            { span: 'col-span-2 row-span-1', img: '/images/portfolio/portfolio-16.jpg', title: 'Interior Kantor & Pantry', desc: 'Desain interior kantor lengkap meliputi pantry dengan kabinet kayu dan HPL biru navy, area workstation, serta storage terbuka. Cocok untuk kantor startup dan korporat.', category: 'Furniture Kantor', price: 'Rp 45.000.000' },
            { span: 'col-span-1 row-span-1', img: '/images/portfolio/portfolio-17.jpg', title: 'Ruang Kerja Kantor Modern', desc: 'Meja kerja custom minimalis dengan pedestal samping, wall panel kombinasi kayu dan concrete, rak display industrial, serta partisi perforated metal hitam.', category: 'Furniture Kantor', price: 'Rp 12.000.000' },
            { span: 'col-span-1 row-span-2', img: '/images/portfolio/portfolio-18.jpg', title: 'Ruang Direktur & Lounge', desc: 'Interior ruang direktur dengan meja kerja L-Shape, sofa lounge biru navy, coffee table custom, storage kabinet, dan wall panel kombinasi HPL kayu dan fluted navy.', category: 'Furniture Kantor', price: 'Rp 35.000.000' },
            { span: 'col-span-1 row-span-1', img: '/images/portfolio/portfolio-19.jpg', title: 'Meja Resepsionis Custom', desc: 'Meja resepsionis kantor PT. Inti Power Abadi dengan desain melengkung, kombinasi HPL kayu dan putih, backdrop batu alam berpencahayaan LED, serta area lounge tamu.', category: 'Furniture Kantor', price: 'Rp 15.000.000' },
            { span: 'col-span-1 row-span-1', img: '/images/portfolio/portfolio-20.jpg', title: 'Lobby & Front Office', desc: 'Area lobby kantor dengan meja resepsionis curved custom, sofa abu-abu dengan stool accent, panel dinding fluted navy, cermin dekoratif, dan pencahayaan track light.', category: 'Furniture Kantor', price: 'Rp 18.000.000' },
            { span: 'col-span-1 row-span-1', img: '/images/portfolio/portfolio-21.jpg', title: 'Resepsionis & Waiting Area', desc: 'Sudut pandang luas area resepsionis dengan meja front desk HPL kayu-putih, backdrop logo batu alam backlit, wall panel, dan area waiting room dengan sofa nyaman.', category: 'Furniture Kantor', price: 'Rp 18.000.000' },
            { span: 'col-span-1 row-span-1', img: '/images/portfolio/portfolio-22.jpg', title: 'Wardrobe Walk-in & Meja Rias', desc: 'Walk-in wardrobe open concept dengan rak bertingkat, laci penyimpanan, gantungan pakaian, LED strip per rak, dan meja rias built-in samping. Material multiplek finishing HPL kayu.', category: 'Bedroom', price: 'Rp 16.000.000' },
            { span: 'col-span-1 row-span-1', img: '/images/portfolio/portfolio-23.jpg', title: 'Kamar Tidur Anak Japandi', desc: 'Kamar tidur anak bergaya Japandi dengan bed frame storage rotan anyam, headboard arch motif, meja belajar built-in dengan LED, rak dinding, dan lemari pakaian.', category: 'Bedroom', price: 'Rp 19.000.000' },
            { span: 'col-span-1 row-span-1', img: '/images/portfolio/portfolio-24.jpg', title: 'Lemari & Meja Rias Modern', desc: 'Lemari pakaian full ceiling dengan handle hitam minimalis, meja rias built-in dengan cermin dan rak display LED backlit, serta panel WPC fluted putih sebagai backdrop.', category: 'Bedroom', price: 'Rp 14.000.000' },
        ],
        products: [
            { title: 'Kitchen Set Minimalis', img: '/images/kitchen-set.jpg', features: 'L-Shape / U-Shape, Anti-Rayap, Engsel Soft-close' },
            { title: 'Lemari Pakaian Wardrobe', img: '/images/wardrobe.jpg', features: 'Full Plafon 3 Meter, Cermin Terintegrasi, LED Strip' },
            { title: 'Meja Kerja & Belajar', img: '/images/study-desk.jpg', features: 'Ruang Penyimpanan, Cable Management, Ergonomis' },
            { title: 'Kabinet Rak TV', img: '/images/tv-cabinet.jpg', features: 'Floating Design, Hidden Storage, Back panel HPL' }
        ],
        tech: {
            title: "Konsultasi Desain Langsung via WhatsApp",
            desc: "Ucapkan selamat tinggal pada kesulitan menjelaskan ukuran atau model! Konsultasikan langsung dengan tim desain kami yang berpengalaman."
        },
        articles: [
            { title: '5 Tips Memilih Material HPL', date: '12 Feb 2026', img: '/images/kitchen-set.jpg', desc: 'Pelajari karakter masing-masing pelapis kayu agar awet puluhan tahun...' },
            { title: 'Warna Interior Paling Dicari', date: '08 Feb 2026', img: '/images/living-room.jpg', desc: 'Dari Sage Green hingga warna-warna earth tone yang menenangkan...' },
            { title: 'Perbedaan Multiplek vs Blockboard', date: '24 Jan 2026', img: '/images/workshop-jepara.jpg', desc: 'Sebelum membuat lemari custom, kenali jenis kayu inti terbaik untuk budget Anda.' }
        ]
    }
};
