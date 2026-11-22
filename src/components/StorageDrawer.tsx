import React, { useState } from 'react';
import { ProducedProduct, ResourceItem } from '../types/game';
import { RANK_NAMES, RANK_COLORS } from '../data/gameData';
import { sound } from '../utils/audio';
import { 
  X, 
  Archive, 
  Boxes, 
  Sparkles, 
  ShoppingBag, 
  Tag, 
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';

interface StorageDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  rawMaterials: Record<string, number>;
  craftedProducts: ProducedProduct[];
  marketItems: Record<string, ResourceItem>;
  onOpenListingModal: (product: ProducedProduct) => void;
}

export const StorageDrawer: React.FC<StorageDrawerProps> = ({
  isOpen,
  onClose,
  rawMaterials,
  craftedProducts,
  marketItems,
  onOpenListingModal
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'materials' | 'products'>('materials');

  if (!isOpen) return null;

  const rawEntries = Object.entries(rawMaterials).filter(([_, count]) => count > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative max-w-4xl w-full bg-slate-900 border-2 border-slate-700 rounded-lg pixel-box shadow-2xl flex flex-col max-h-[88vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <Archive className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base sm:text-lg text-slate-100 flex items-center gap-2">
              Kho Xưởng Tiên Gia
              <span className="text-xs text-slate-400 font-pixel">
                ({rawEntries.length} loại nguyên liệu • {craftedProducts.length} sản phẩm)
              </span>
            </h3>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub Tabs: Nguyên Liệu vs Sản Phẩm */}
        <div className="flex border-b border-slate-800 bg-slate-950 px-4 pt-2 gap-2">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveSubTab('materials');
            }}
            className={`px-4 py-2 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'materials'
                ? 'border-amber-400 text-amber-300 bg-slate-900/60 rounded-t'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Boxes className="w-4 h-4" />
            Nguyên Liệu Trong Kho ({rawEntries.reduce((sum, [_, c]) => sum + c, 0)})
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveSubTab('products');
            }}
            className={`px-4 py-2 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'products'
                ? 'border-amber-400 text-amber-300 bg-slate-900/60 rounded-t'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Sản Phẩm Đã Tạo ({craftedProducts.length})
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {activeSubTab === 'materials' ? (
            /* Tab Nguyên Liệu */
            <div>
              {rawEntries.length === 0 ? (
                <div className="text-center py-12 text-slate-500 space-y-2">
                  <p className="text-sm">Hiện tại kho chưa có nguyên liệu nào.</p>
                  <p className="text-xs text-slate-400">Hãy ghé qua mục Thị Trường để mua hoặc cho thợ khai thác!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {rawEntries.map(([itemId, count]) => {
                    const item = marketItems[itemId];
                    if (!item) return null;

                    return (
                      <div
                        key={itemId}
                        className="bg-slate-950/80 border border-slate-800 rounded p-3 flex items-start justify-between"
                      >
                        <div>
                          <h4 className="font-bold text-xs sm:text-sm text-slate-200">{item.name}</h4>
                          <span className="text-[10px] text-slate-500 uppercase font-pixel tracking-wider">
                            {item.category.replace('_', ' ')}
                          </span>
                          <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                            {item.description}
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="font-bold text-base text-cyan-300 font-pixel">
                            x{count}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Tab Sản Phẩm */
            <div>
              {/* Notice that products cannot be sold instant-cash directly in warehouse */}
              <div className="mb-4 bg-amber-500/10 border border-amber-500/30 p-2.5 rounded text-xs text-amber-300 flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>
                  Quy định Tiên Giới: Bạn không thể bán trực tiếp sản phẩm lấy tiền mặt từ kho. Hãy nhấn <strong>"Rao Bán Lên Thị Trường"</strong> hoặc giao cho <strong>"Khách Quen / Đơn Hàng"</strong> để nhận thù lao cao nhất!
                </span>
              </div>

              {craftedProducts.length === 0 ? (
                <div className="text-center py-12 text-slate-500 space-y-2">
                  <p className="text-sm">Chưa có sản phẩm nào được chế tác.</p>
                  <p className="text-xs text-slate-400">Hãy chỉ định công nhân và khởi động lò rèn / đan lô để tạo sản phẩm!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {craftedProducts.map((prod) => {
                    const itemMeta = marketItems[prod.itemId];
                    const rankStyle = RANK_COLORS[prod.rank] || RANK_COLORS.pham_cap;

                    return (
                      <div
                        key={prod.id}
                        className="bg-slate-950/80 border border-slate-800 rounded p-3.5 flex flex-col justify-between space-y-3 relative group"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-bold text-xs sm:text-sm text-slate-100">{prod.name}</h4>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-pixel font-bold border ${rankStyle.text} ${rankStyle.bg} ${rankStyle.border}`}>
                                  {RANK_NAMES[prod.rank]}
                                </span>
                                <span className="text-[11px] text-amber-400 font-pixel">
                                  {prod.stars}★
                                </span>
                              </div>
                            </div>
                            <span className="text-xl">✨</span>
                          </div>

                          <div className="mt-2 text-[11px] text-slate-400 space-y-0.5 border-t border-slate-800/80 pt-1.5">
                            <p>Chế tác bởi: <strong className="text-slate-300">{prod.craftsmanName}</strong></p>
                            <p>Giá sàn gợi ý: <strong className="text-amber-400">{itemMeta ? itemMeta.currentPrice * (1 + prod.stars * 0.15) : 100} LT</strong></p>
                          </div>
                        </div>

                        {/* Action: Rao Bán */}
                        <div className="pt-2 border-t border-slate-800">
                          <button
                            type="button"
                            onClick={() => {
                              sound.playClick();
                              onOpenListingModal(prod);
                            }}
                            className="w-full py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs rounded pixel-btn flex items-center justify-center gap-1.5 cursor-pointer shadow"
                          >
                            <Tag className="w-3.5 h-3.5" />
                            Rao Bán Lên Thị Trường
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
