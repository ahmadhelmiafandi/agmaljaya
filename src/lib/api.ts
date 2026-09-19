/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const isSupabaseConfigured = Boolean(
    import.meta.env.VITE_SUPABASE_URL && 
    import.meta.env.VITE_SUPABASE_ANON_KEY &&
    !import.meta.env.VITE_SUPABASE_URL.includes('placeholder')
);

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface Product {
  id: string;
  name: string;
  shapes: string[];
  basePrice: number;
  active: boolean;
}

export interface Material {
  id: string;
  name: string;
  priceModifier: number;
  type: string;
}

export interface Accessory {
  id: string;
  name: string;
  price: number;
  type: string;
}

export interface Settings {
  [key: string]: any;
  hero: {
    title: string;
    subtitle: string;
  };
  about: {
    description: string;
    badgeValue: string;
    badgeTitle: string;
    badgeSub: string;
    img: string;
  };
  contact: {
    [key: string]: any;
    phone: string;
    email: string;
    mapUrl: string;
  };
  faqs: Array<{ q: string; a: string }>;
  testimonials: Array<{ text: string; name: string; loc: string }>;
  team: Array<{ name: string; role: string; img: string }>;
  services: Array<{ title: string; desc: string }>;
  howItWorks: Array<{ title: string; desc: string }>;
  portfolio: Array<{ img: string; title: string }>;
  products: Array<{ title: string; img: string; features: string }>;
  tech: {
    title: string;
    desc: string;
  };
  articles: Array<{ title: string; date: string; img: string; desc: string; content?: string }>;
}

export interface WebsiteData {
  products: Product[];
  materials: Material[];
  accessories: Accessory[];
  settings: Settings;
}

import { defaultData } from '../data/defaultWebsiteData';

const getWebsiteData = async (): Promise<WebsiteData> => {
    if (!isSupabaseConfigured) {
        return defaultData;
    }
    try {
        const { data, error } = await supabase
            .from('website_data')
            .select('content')
            .eq('id', 'primary_data')
            .maybeSingle();

        if (error) throw error;
        
        if (!data) {
            // Seed default data if not exists
            const { error: seedError } = await supabase
                .from('website_data')
                .insert([{ id: 'primary_data', content: defaultData }]);
            if (seedError) console.error('Seeding error:', seedError);
            return defaultData;
        }
        
        return data.content as WebsiteData;
    } catch (e) {
        console.error('Supabase fetch error, using local defaults:', e);
        return defaultData;
    }
};

export const api = {
    getProducts: async (): Promise<Product[]> => {
        const data = await getWebsiteData();
        return data.products;
    },
    updateProduct: async (id: string, productData: Partial<Product>): Promise<Product[]> => {
        const currentData = await getWebsiteData();
        const newProducts = currentData.products.map(p => 
            p.id === id ? { ...p, ...productData } : p
        );
        const newData = { ...currentData, products: newProducts };
        
        const { error } = await supabase
            .from('website_data')
            .update({ content: newData })
            .eq('id', 'primary_data');
        
        if (error) throw error;
        return newProducts;
    },
    addProduct: async (productData: Omit<Product, 'id' | 'active'>): Promise<Product[]> => {
        const currentData = await getWebsiteData();
        const newProduct: Product = { 
            id: Date.now().toString(), 
            active: true,
            ...productData 
        };
        const newProducts = [...currentData.products, newProduct];
        const newData = { ...currentData, products: newProducts };
        
        const { error } = await supabase
            .from('website_data')
            .update({ content: newData })
            .eq('id', 'primary_data');
        
        if (error) throw error;
        return newProducts;
    },
    getMaterials: async (): Promise<Material[]> => {
        const data = await getWebsiteData();
        return data.materials;
    },
    getAccessories: async (): Promise<Accessory[]> => {
        const data = await getWebsiteData();
        return data.accessories;
    },
    getOrders: async (): Promise<any[]> => {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('Orders fetch error:', error);
            return [];
        }
        return data.map(item => ({ ...item.data, id: item.id, createdAt: item.created_at }));
    },
    submitOrder: async (orderData: any): Promise<any> => {
        const { data, error } = await supabase
            .from('orders')
            .insert([{ data: orderData }])
            .select()
            .single();
        
        if (error) throw error;
        return { ...data.data, id: data.id, createdAt: data.created_at };
    },
    updateOrderStatus: async (id: string, status: string): Promise<any> => {
        const { data: currentOrder, error: fetchError } = await supabase
            .from('orders')
            .select('data')
            .eq('id', id)
            .single();
        
        if (fetchError) throw fetchError;

        const updatedData = { ...currentOrder.data, status };
        
        const { data, error } = await supabase
            .from('orders')
            .update({ data: updatedData })
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        return { ...data.data, id: data.id, createdAt: data.created_at };
    },
    deleteOrder: async (id: string): Promise<void> => {
        const { error } = await supabase
            .from('orders')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
    },
    getSettings: async (): Promise<Settings> => {
        const data = await getWebsiteData();
        return data.settings;
    },
    updateSettings: async (settingsData: Settings): Promise<Settings> => {
        const currentData = await getWebsiteData();
        const newData = { ...currentData, settings: settingsData };
        
        const { error } = await supabase
            .from('website_data')
            .update({ content: newData })
            .eq('id', 'primary_data');
        
        if (error) throw error;
        return newData.settings;
    },
    saveDesign: async (config: any, totalPrice: number): Promise<string> => {
        const { data, error } = await supabase
            .from('orders')
            .insert([{ data: { config, totalPrice, isDraft: true, status: 'Draft' } }])
            .select()
            .single();
        
        if (error) throw error;
        return data.id;
    },
    getDesign: async (id: string): Promise<any> => {
        const { data, error } = await supabase
            .from('orders')
            .select('data')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        return data.data;
    },
    uploadImage: async (file: File): Promise<string> => {
        if (isSupabaseConfigured) {
            try {
                const fileExt = file.name.split('.').pop() || 'jpg';
                const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
                const filePath = `uploads/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('content')
                    .upload(filePath, file, { upsert: true });

                if (!uploadError) {
                    const { data } = supabase.storage
                        .from('content')
                        .getPublicUrl(filePath);

                    if (data?.publicUrl) {
                        return data.publicUrl;
                    }
                } else {
                    console.warn('Supabase storage upload warning, falling back to base64:', uploadError);
                }
            } catch (err) {
                console.warn('Supabase storage exception, falling back to base64:', err);
            }
        }

        // Guaranteed fallback: read as base64 data URL
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                if (typeof reader.result === 'string') {
                    resolve(reader.result);
                } else {
                    reject(new Error('Failed to convert file to data URL'));
                }
            };
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
        });
    }
};
