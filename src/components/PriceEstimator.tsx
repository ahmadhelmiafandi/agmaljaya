import React from 'react';
import { TrendingUp, Zap } from 'lucide-react';
import { PlacedItem, CatalogItem, Material3D, BOMBreakdown, BOMMaterialDetail, BOMItem } from '../types/interior';

interface PriceEstimatorProps {
    price: number;
}

export default function PriceEstimator({ price }: PriceEstimatorProps) {
    const isReady = price > 0;

    return (
        <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 rounded-2xl shadow-xl border border-slate-700/50 p-6 text-white relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute -top-10 -right-10 w-36 h-36 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 -left-12 w-44 h-44 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
                {/* Label */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <TrendingUp size={14} className="text-teal-400" />
                        Estimasi Biaya Produksi
                    </h3>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
                        <Zap size={10} /> Real-time
                    </span>
                </div>

                {/* Price */}
                <div className="mb-3">
                    {isReady ? (
                        <>
                            <div className="text-4xl font-extrabold tracking-tight leading-none">
                                Rp {price.toLocaleString('id-ID')}
                            </div>
                            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                                Harga sudah termasuk material, pengerjaan, & instalasi standar Jabodetabek.
                            </p>
                        </>
                    ) : (
                        <>
                            <div className="text-2xl font-bold text-slate-500 leading-none">Belum dihitung</div>
                            <p className="text-sm text-slate-500 mt-2">Pilih produk & material untuk melihat estimasi harga.</p>
                        </>
                    )}
                </div>

                {/* Progress / indicator bar */}
                <div className="mt-4">
                    <div className="h-1.5 w-full bg-slate-700/50 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-700 ${isReady ? 'bg-gradient-to-r from-amber-400 to-teal-400' : 'bg-slate-600 animate-pulse'}`}
                            style={{ width: isReady ? '100%' : '30%' }}
                        />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1.5">
                        <span>{isReady ? 'Kalkulasi lengkap' : 'Menunggu input...'}</span>
                        <span>Estimasi</span>
                    </div>
                </div>

                {/* Disclaimer */}
                {isReady && (
                    <p className="text-[10px] text-slate-500 mt-3 border-t border-slate-700/50 pt-3">
                        *Harga final setelah survey langsung. Dapat berubah ±10-15%.
                    </p>
                )}
            </div>
        </div>
    );
}

export function calculateBOM(
    placedItems: PlacedItem[],
    itemsCatalog: CatalogItem[],
    materialsCatalog: Material3D[]
): BOMBreakdown {
  if (!placedItems || !Array.isArray(placedItems)) {
    return { items: [], total: 0 };
  }

  let total = 0;
  const items: BOMItem[] = [];

  for (const placedItem of placedItems) {
    const catalogItem = itemsCatalog.find(i => i.id === placedItem.item3dId);
    if (!catalogItem) continue;

    // Get scales (handling both array and object formats)
    let scaleX = 1;
    let scaleY = 1;
    let scaleZ = 1;
    if (placedItem.scale) {
      if (Array.isArray(placedItem.scale)) {
        scaleX = placedItem.scale[0] !== undefined ? placedItem.scale[0] : 1;
        scaleY = placedItem.scale[1] !== undefined ? placedItem.scale[1] : 1;
        scaleZ = placedItem.scale[2] !== undefined ? placedItem.scale[2] : 1;
      } else {
        const scaleObj = placedItem.scale as any;
        scaleX = scaleObj.x !== undefined ? scaleObj.x : 1;
        scaleY = scaleObj.y !== undefined ? scaleObj.y : 1;
        scaleZ = scaleObj.z !== undefined ? scaleObj.z : 1;
      }
    }

    const width = Math.round(catalogItem.default_width * scaleX);
    const height = Math.round(catalogItem.default_height * scaleY);
    const depth = Math.round(catalogItem.default_depth * scaleZ);

    // Calculate base price computed
    let basePriceComputed = catalogItem.base_price;
    if (catalogItem.price_unit === 'per_meter') {
      basePriceComputed = catalogItem.base_price * (width / 100);
    }

    // Material assignments modifier
    const materials: BOMMaterialDetail[] = [];
    let sumModifiers = 0;
    let countModifiers = 0;

    const meshParts = catalogItem.mesh_parts || {};
    const partNames = Object.keys(meshParts);

    for (const part of partNames) {
      const assignedMaterialId = placedItem.materialAssignments ? placedItem.materialAssignments[part] : null;
      const material = assignedMaterialId ? materialsCatalog.find(m => m.id === assignedMaterialId) : null;

      if (material) {
        materials.push({
          part,
          name: material.name,
          code: material.code,
          brand: material.brand,
          modifier: material.price_modifier
        });
        sumModifiers += material.price_modifier;
        countModifiers++;
      } else {
        materials.push({
          part,
          name: 'Default Material',
          code: '-',
          brand: '-',
          modifier: 1.0
        });
        sumModifiers += 1.0;
        countModifiers++;
      }
    }

    const multiplier = countModifiers > 0 ? sumModifiers / countModifiers : 1.0;
    const subtotal = Math.round(basePriceComputed * multiplier);

    items.push({
      id: placedItem.id,
      catalogId: catalogItem.id,
      name: catalogItem.name,
      category: catalogItem.category,
      dimensions: { width, height, depth },
      basePrice: catalogItem.base_price,
      priceUnit: catalogItem.price_unit,
      materials,
      multiplier,
      subtotal
    });

    total += subtotal;
  }

  return { items, total };
}
