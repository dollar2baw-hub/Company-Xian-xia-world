import React, { useState } from 'react';
import { 
  ResourceItem, 
  ProducedProduct, 
  MarketListing, 
  ItemRank 
} from '../types/game';
import { RANK_NAMES, RANK_COLORS } from '../data/gameData';
import { sound } from '../utils/audio';
import { 
  ShoppingBag, 
  Tag, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Coins, 
  ArrowUpDown, 
  Filter, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  UserCheck 
} from 'lucide-react';

interface MarketViewProps {
  marketItems: Record<string, ResourceItem>;
  marketListings: MarketListing[];
  craftedProducts: ProducedProduct[];
  linhThach: number;
  onBuyListing: (listingId: string, count: number) => void;
  onBuyRawResource: (itemId: string, count: number) => void;
  onOpenListingModalForProduct: (product: ProducedProduct) => void;
  onOpenStorage: () => void;
}

export const MarketView: React.FC<MarketViewProps> = ({
  marketItems,
  marketListings,
  craftedProducts,
  linhThach,
  onBuyListing,
  onBuyRawResource,
  onOpenListingModalForProduct,
  onOpenStorage
}) => {
  // a -> f categories as requested
  const [activeCategory, setActiveCategory] = useState<'all' | 'khoang_san' | 'duoc_lieu' | 'khi_cu' | 'dan_duoc' | 'trang_suc'>('all');
  
  // 1.1 Sorting: Theo Giá Cả hoặc Theo Phẩm Chất
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'quality_desc' | 'quality_asc'>('price_asc');

  // Filter listings
  const filteredListings = marketListings.filter(item => {
    if (item.status !== 'active') return false;
    const meta = marketItems[item.itemId];
    if (!meta) return true;
    if (activeCategory === 'all') return true;
    return meta.category === activeCategory;
  });

  // Sort logic
  const rankScores: Record<ItemRank, number> = {
    pham_cap: 10,
    huyen_cap: 20,
    hoang_cap: 30,
    dia_cap: 40,
    thien_cap: 50
  };

  const sortedListings = [...filteredListings].sort((a, b) => {
    if (sortBy === 'price_asc') return a.unitPrice - b.unitPrice;
    if (sortBy === 'price_desc') return b.unitPrice - a.unitPrice;
    const scoreA = rankScores[a.rank] + a.stars;
    const scoreB = rankScores[b.rank] + b.stars;
    if (sortBy === 'quality_desc') return scoreB - scoreA;
    return scoreA - scoreB;
  });

  const categories = [
    { id: 'all', label: 'a. Tất Cả' },
    { id: 'khoang_san', label: 'b. Khoáng Sản' },
    { id: 'duoc_lieu', label: 'c. Dược Liệu' },
    { id: 'khi_cu', label: 'd. Khí Cụ' },
    { id: 'dan_duoc', label: 'e. Đan Dược' },
    { id: 'trang_suc', label: 'f. Trang Sức' }
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header: Market Overview + Nút Rao Bán */}
      <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-lg pixel-box flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              Thị Trường Tu Chân Giới
            </h2>
            <span className="text-[10px] bg-amber-500/10 border border-amber-500/30 text-amber-300 px-2 py-0.5 rounded font-pixel">
              Giao Thương Tự Do Cửu Châu
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Nơi mua bán khoáng sản, dược liệu, khí cụ, đan dược và trang sức với các tu sĩ và thương hội.
          </p>
        </div>

        {/* 1.2: Nút Rao Bán */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              if (craftedProducts.length === 0) {
                alert('Kho sản phẩm của bạn hiện chưa có sản phẩm nào! Hãy sản xuất trước để đem rao bán.');
                return;
              }
              onOpenStorage();
            }}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs sm:text-sm rounded pixel-btn flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <Tag className="w-4 h-4" />
            <span>+ RAO BÁN VẬT PHẨM TỪ KHO</span>
          </button>
        </div>
      </div>

      {/* 1. Hạng Mục Lọc (a -> f) & 1.1 Sắp Xếp */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/70 p-3 rounded border border-slate-800">
        {/* Categories Tabs */}
        <div className="flex overflow-x-auto gap-1.5 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                sound.playClick();
                setActiveCategory(c.id as any);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded whitespace-nowrap cursor-pointer transition-all border ${
                activeCategory === c.id
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* 1.1: Sắp xếp theo Giá cả hoặc Phẩm chất */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-pixel flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
            Sắp xếp theo:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-amber-300 font-pixel focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            <option value="price_asc">Giá cả: Thấp ➔ Cao</option>
            <option value="price_desc">Giá cả: Cao ➔ Thấp</option>
            <option value="quality_desc">Phẩm chất: Thiên ➔ Phàm cấp</option>
            <option value="quality_asc">Phẩm chất: Phàm ➔ Thiên cấp</option>
          </select>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="space-y-4">
        <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            Các Sản Phẩm Đang Rao Bán Trên Thị Trường ({sortedListings.length})
          </span>
        </h3>

        {sortedListings.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/60 rounded-lg border border-slate-800 text-slate-500">
            Hiện không có sản phẩm nào thuộc danh mục này đang rao bán.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedListings.map((lst) => {
              const itemMeta = marketItems[lst.itemId];
              const rankStyle = RANK_COLORS[lst.rank] || RANK_COLORS.pham_cap;
              const canAfford = linhThach >= lst.unitPrice;

              return (
                <div
                  key={lst.id}
                  className={`bg-slate-900/90 rounded-lg p-4 pixel-box flex flex-col justify-between space-y-3 border transition-all ${
                    lst.isPlayer
                      ? 'border-amber-400/80 shadow-[0_0_12px_rgba(245,158,11,0.2)] ring-1 ring-amber-400/30'
                      : 'border-slate-800'
                  }`}
                >
                  <div>
                    {/* Header: Item Name, Rank, Seller */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-sm text-slate-100">{itemMeta?.name || lst.itemId}</h4>
                          {lst.isPlayer && (
                            <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1 py-0.2 rounded font-pixel">
                              BẠN ĐĂNG BÁN
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 mt-1">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-pixel font-bold border ${rankStyle.text} ${rankStyle.bg} ${rankStyle.border}`}>
                            {RANK_NAMES[lst.rank]}
                          </span>
                          <span className="text-xs text-amber-400 font-pixel font-bold">
                            {lst.stars}★
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm sm:text-base font-bold font-pixel text-amber-300 flex items-center justify-end gap-1">
                          <Coins className="w-3.5 h-3.5 text-amber-400" />
                          {lst.unitPrice} LT
                        </div>
                        <span className="text-[10px] text-slate-400 font-pixel block">
                          Còn lại: {lst.count} món
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {itemMeta?.description}
                    </p>

                    <div className="mt-2.5 bg-slate-950/70 p-2 rounded border border-slate-800/80 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Người rao bán:</span>
                      <strong className={lst.isPlayer ? 'text-amber-300' : 'text-slate-300'}>
                        {lst.sellerName}
                      </strong>
                    </div>
                  </div>

                  {/* Buy button */}
                  <div className="pt-2 border-t border-slate-800">
                    {lst.isPlayer ? (
                      <div className="w-full py-2 bg-slate-950 border border-amber-500/30 text-amber-300 text-xs font-pixel rounded text-center">
                        Đang chờ tu sĩ khác mua...
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          sound.playCoins();
                          onBuyListing(lst.id, 1);
                        }}
                        disabled={!canAfford}
                        className="w-full py-2 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-200 text-xs font-bold rounded pixel-btn flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        Mua 1 Món ({lst.unitPrice} Linh Thạch)
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
