-- ================================================================
-- SKEMA DATABASE SUPABASE UNTUK AGMAL JAYA INTERIOR
-- ================================================================
-- Cara Penggunaan:
-- 1. Buka dashboard Supabase: https://supabase.com/dashboard/project/hxpjyglsjwbxkeexulul
-- 2. Pilih menu "SQL Editor" di bilah navigasi kiri
-- 3. Klik "New Query", paste seluruh isi file ini, lalu klik "Run" (tombol hijau)
-- ================================================================

-- 1. TABEL UNTUK DATA KONTEN WEBSITE (CMS)
CREATE TABLE IF NOT EXISTS public.website_data (
    id TEXT PRIMARY KEY,
    content JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Aktifkan Row Level Security (RLS)
ALTER TABLE public.website_data ENABLE ROW LEVEL SECURITY;

-- Policy: Publik dapat membaca data website
DROP POLICY IF EXISTS "Public can view website data" ON public.website_data;
CREATE POLICY "Public can view website data"
    ON public.website_data FOR SELECT
    USING (true);

-- Policy: Publik dapat mengedit data website (CMS Admin)
DROP POLICY IF EXISTS "Public can update website data" ON public.website_data;
CREATE POLICY "Public can update website data"
    ON public.website_data FOR ALL
    USING (true);


-- 2. TABEL UNTUK PESANAN & INVOICE (ORDERS)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    data JSONB NOT NULL
);

-- Aktifkan Row Level Security (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Policy: Publik dapat membaca, menambah, mengubah, dan menghapus pesanan
DROP POLICY IF EXISTS "Public full access to orders" ON public.orders;
CREATE POLICY "Public full access to orders"
    ON public.orders FOR ALL
    USING (true);


-- 3. STORAGE BUCKET UNTUK UPLOAD FOTO/GAMBAR KONTEN
INSERT INTO storage.buckets (id, name, public)
VALUES ('content', 'content', true)
ON CONFLICT (id) DO NOTHING;

-- Policy Storage: Publik dapat melihat gambar
DROP POLICY IF EXISTS "Public read storage" ON storage.objects;
CREATE POLICY "Public read storage"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'content');

-- Policy Storage: Publik dapat mengunggah gambar baru
DROP POLICY IF EXISTS "Public insert storage" ON storage.objects;
CREATE POLICY "Public insert storage"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'content');

-- Policy Storage: Publik dapat memperbarui gambar
DROP POLICY IF EXISTS "Public update storage" ON storage.objects;
CREATE POLICY "Public update storage"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'content');
