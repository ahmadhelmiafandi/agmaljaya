export interface MaterialColorInfo {
  fill: string;
  stroke: string;
  label: string;
  name: string;
}

export const MATERIAL_COLORS: Record<string, MaterialColorInfo> = {
    '1': { fill: '#e8d5b7', stroke: '#c4a882', label: 'HPL', name: 'Multiplek + HPL' },
    '2': { fill: '#d4e8d4', stroke: '#7ab87a', label: 'PVC', name: 'PVC' },
    '3': { fill: '#c4a882', stroke: '#8b6f47', label: 'Kayu', name: 'Kayu Solid' },
};

export const WALL_POS = {
    Utara: 'A',
    Selatan: 'B',
    Barat: 'C',
    Timur: 'D',
} as const;

export const WALL_LABELS = { 
    Utara: 'Dinding A (Depan)', 
    Selatan: 'Dinding B (Belakang)', 
    Barat: 'Dinding C (Kiri)', 
    Timur: 'Dinding D (Kanan)' 
} as const;
