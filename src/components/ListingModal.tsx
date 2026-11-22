import React, { useState, useEffect } from 'react';
import { ProducedProduct, ResourceItem, MarketListing } from '../types/game';
import { RANK_NAMES, RANK_COLORS } from '../data/gameData';
import { sound } from '../utils/audio';
import { 
  X, 
  Tag, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Coins, 
  CheckCircle2, 
  AlertTriangle,
  Lightbulb,
  ArrowRight
} from 'lucide-react';

interface ListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProducedProduct | null;
  marketItems: Record<string, ResourceItem>;
  onConfirmListing: (product: ProducedProduct, count: number, unitPrice: number) => void;
}

export const ListingModal: React.FC<ListingModalProps> = ({
  isOpen,
  onClose,
  product,
  marketItems,
  onConfirmListing
}) => {
  if (!isOpen || !product) return null;

  const itemMeta = marketItems[product.itemId];
  const basePrice = itemMeta ? itemMeta.currentPrice : 100;

  // Star and rank multiplier
  const qualityMultiplier = 1 + (product.stars * 0.12) + (
    product.rank === 'thien_cap' ? 1.5 :
    product.rank === 'dia_cap' ? 1.0 :
    product.rank === 'hoang_cap' ? 0.6 :
    product.rank === 'huyen_cap' ? 0.3 : 0
  );

  const recommendedPrice = Math.round(basePrice * qualityMultiplier);

  const [unitPrice, setUnitPrice] = useState<number>(recommendedPrice);
  const [count, setCount] = useState<number>(1);

  useEffect(() => {
    setUnitPrice(recommendedPrice);
    setCount(1);
  }, [product, recommendedPrice]);

  // Market analysis estimation
  const priceRatio = unitPrice / (recommendedPrice || 1);
  let saleChance = 80;
  let verdictText = 'Giá hợp lý, sức mua cao';
  let verdictColor = 'text-emerald-400';

  if (priceRatio <= 0.85) {
    saleChance = 98;
    verdictText = 'Giá hời! Sẽ bán hết cực nhanh trong vài phút';
    verdictColor = 'text-emerald-400 font-bold';
  } else if (priceRatio <= 1.05) {
    saleChance = 88;
    verdictText = 'Mức giá chuẩn thị trường, thanh khoản tốt';
    verdictColor = 'text-emerald-300';
  } else if (priceRatio <= 1.25) {
    saleChance = 55;
    verdictText = 'Giá hơi cao, cần khách hàng sành sỏi mới mua';
    verdictColor = 'text-amber-400';
  } else if (priceRatio <= 1.6) {
    saleChance = 25;
    verdictText = 'Giá đắt! Nguy cơ ế ẩm cao, ít người hỏi mua';
    verdictColor = 'text-orange-400';
  } else {
    saleChance = 8;
    verdictText = 'Giá cắt cổ! Gần như không ai thèm mua';
    verdictColor = 'text-red-400 font-bold';
  }

  const handleList = () => {
    sound.playCoins();
    onConfirmListing(product, count, unitPrice);
    onClose();
  };

  const rankStyle = RANK_COLORS[product.rank] || RANK_COLORS.pham_cap;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative max-w-lg w-full bg-slate-900 border-2 border-amber-500 rounded-lg pixel-box shadow-2xl p-5 sm:p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base text-slate-100">
              Rao Bán Sản Phẩm Lên Thị Trường
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Product Card */}
        <div className="bg-slate-950/80 p-3.5 rounded border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-slate-200">{product.name}</h4>
            <div className="flex items-center gap-1.5">
              <span className={`text-[10px] px-2 py-0.5 rounded font-pixel font-bold border ${rankStyle.text} ${rankStyle.bg} ${rankStyle.border}`}>
                {RANK_NAMES[product.rank]}
              </span>
              <span className="text-xs text-amber-400 font-pixel font-bold">{product.stars}★</span>
            </div>
          </div>
          <p className="text-xs text-slate-400">{itemMeta?.description}</p>
        </div>

        {/* Price Input & Presets */}
        <div className="space-y-3 bg-slate-950/50 p-3.5 rounded border border-slate-800">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Đặt đơn giá bán (Linh Thạch/món):</span>
              <span className="text-slate-400 font-pixel">Gợi ý: {recommendedPrice} LT</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                value={unitPrice}
                onChange={(e) => setUnitPrice(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-amber-300 font-pixel font-bold focus:outline-none focus:border-amber-400"
              />
              <button
                type="button"
                onClick={() => setUnitPrice(recommendedPrice)}
                className="px-2.5 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-amber-300 font-pixel rounded cursor-pointer whitespace-nowrap"
              >
                Giá Chuẩn
              </button>
            </div>
          </div>

          {/* Market Intelligence Analysis */}
          <div className="p-3 bg-slate-900/90 rounded border border-slate-700 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 text-amber-300 font-semibold font-pixel">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              ĐÁNH GIÁ TÌNH HÌNH THỊ TRƯỜNG & KHẢ NĂNG BÁN:
            </div>

            <div className="space-y-1 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Xu hướng cung cầu:</span>
                <span className="text-emerald-400 font-pixel">Nhu cầu ổn định (85/100)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tỷ lệ bán thành công dự đoán:</span>
                <span className="font-bold font-pixel text-amber-300">{saleChance}%</span>
              </div>
              <div className="pt-1 border-t border-slate-800">
                <span className="text-slate-400">Nhận định hệ thống: </span>
                <strong className={verdictColor}>{verdictText}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleList}
            className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs sm:text-sm rounded pixel-btn flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <Tag className="w-4 h-4" />
            <span>XÁC NHẬN ĐĂNG RAO BÁN ({unitPrice} LINH THẠCH)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
