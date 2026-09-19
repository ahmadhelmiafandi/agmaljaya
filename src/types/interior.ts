export interface RoomConfig {
  width: number;  // cm
  length: number; // cm
  height: number; // cm
  wallColor: string;
  floorColor: string;
  ambientIntensity: number;
  sunIntensity: number;
  shadowsEnabled: boolean;
  floorType: string;
}

export interface MaterialAssignment {
  [partName: string]: string;
}

export interface PlacedItem {
  id: string;
  item3dId: string;
  position: [number, number, number]; // [x, y, z] in meters
  rotationY: number; // radians
  rotationX?: number; // radians
  scale: [number, number, number]; // [x, y, z] scale factors
  materialAssignments: MaterialAssignment;
}

export interface CameraConfig {
  fov: number;
  position: [number, number, number];
  rotation: [number, number, number];
  mode: 'perspective' | 'orthographic';
  preset: 'isometric' | 'top' | 'front' | 'side';
  gridVisible: boolean;
  helperVisible: boolean;
}

export interface CatalogItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  default_width: number;
  default_height: number;
  default_depth: number;
  min_width?: number;
  max_width?: number;
  scalable_axis?: string[];
  glb_url: string;
  thumbnail_url: string;
  base_price: number;
  price_unit: 'per_piece' | 'per_meter';
  mesh_parts?: { [partName: string]: string };
  tags?: string[];
  sort_order: number;
  is_active: boolean;
}

export interface Material3D {
  id: string;
  slug: string;
  name: string;
  brand: string;
  code: string;
  texture_url: string;
  normal_map_url: string;
  roughness: number;
  metalness: number;
  texture_repeat_x: number;
  texture_repeat_y: number;
  color_hex: string;
  price_modifier: number;
  price_per_sheet: number;
  category: string;
  finish: string;
  applicable_parts: string[];
  is_active: boolean;
  sort_order: number;
}

export interface BOMMaterialDetail {
  part: string;
  name: string;
  code: string;
  brand: string;
  modifier: number;
}

export interface BOMItem {
  id: string;
  catalogId: string;
  name: string;
  category: string;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  basePrice: number;
  priceUnit: 'per_piece' | 'per_meter';
  materials: BOMMaterialDetail[];
  multiplier: number;
  subtotal: number;
}

export interface BOMBreakdown {
  items: BOMItem[];
  total: number;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
}
