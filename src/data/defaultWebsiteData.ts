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
            mapDirectUrl: "https://maps.app.goo.gl/yUqCa27DvDex4TTS8?g_st=iw"
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
            { img: '/images/kitchen-set.jpg', title: 'Modern Minimalist Kitchen' },
            { img: '/images/living-room.jpg', title: 'Cozy Living Area' },
            { img: '/images/wardrobe.jpg', title: 'Master Bedroom Wardrobe' },
            { img: '/images/tv-cabinet.jpg', title: 'Open Space TV Setup' }
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
