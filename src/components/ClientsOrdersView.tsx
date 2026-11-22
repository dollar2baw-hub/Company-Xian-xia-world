import React from 'react';
import { CultivatorClient, ProducedProduct, ResourceItem, DirectCustomerOrder } from '../types/game';
import { RANK_NAMES, RANK_COLORS } from '../data/gameData';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  Users, 
  UserCheck, 
  UserPlus, 
  Scroll, 
  Send, 
  Coins, 
  Heart, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Award
} from 'lucide-react';

interface ClientsOrdersViewProps {
  clients: CultivatorClient[];
  craftedProducts: ProducedProduct[];
  marketItems: Record<string, ResourceItem>;
  onCompleteClientOrder: (clientId: string, orderId: string, matchedProductIds: string[]) => void;
  onSendGiftToClient: (clientId: string) => void;
}

export const ClientsOrdersView: React.FC<ClientsOrdersViewProps> = ({
  clients,
  craftedProducts,
  marketItems,
  onCompleteClientOrder,
  onSendGiftToClient
}) => {
  // Check matching products for an order
  const checkOrderFulfillment = (order: DirectCustomerOrder) => {
    const rankOrder = ['pham_cap', 'huyen_cap', 'hoang_cap', 'dia_cap', 'thien_cap'];
    const minRankIdx = rankOrder.indexOf(order.minRank);

    const eligible = craftedProducts.filter(p => {
      if (p.itemId !== order.itemId) return false;
      const pRankIdx = rankOrder.indexOf(p.rank);
      if (pRankIdx < minRankIdx) return false;
      if (pRankIdx === minRankIdx && p.stars < order.minStars) return false;
      return true;
    });

    const isReady = eligible.length >= order.count;
    const matchedIds = eligible.slice(0, order.count).map(p => p.id);

    return { isReady, currentCount: eligible.length, matchedIds };
  };

  const handleDeliver = (clientId: string, order: DirectCustomerOrder) => {
    const { isReady, matchedIds } = checkOrderFulfillment(order);
    if (!isReady) return;

    sound.playBreakthrough();
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } catch {
      // fallback
    }

    onCompleteClientOrder(clientId, order.id, matchedIds);
  };

  const activeOrdersClients = clients.filter(c => c.activeOrder && c.activeOrder.status === 'active');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-lg pixel-box flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Scroll className="w-5 h-5 text-amber-400" />
              Đơn Hàng & Khách Hàng • Nguồn Khách Ổn Định Nhất
            </h2>
            <span className="text-[10px] bg-purple-500/10 border border-purple-500/30 text-purple-300 px-2 py-0.5 rounded font-pixel">
              Mạng Lưới Thân Hữu Cửu Châu
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Khi người khác mua hàng của bạn trên thị trường, họ có thể kết bạn và đặt đơn hàng trực tiếp tại xưởng! Đây là nguồn khách hàng trung thành, mang lại thu nhập ổn định lâu dài.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-pixel">
          <div className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded">
            Khách quen kết bạn: <strong className="text-amber-300">{clients.filter(c => c.isFriend).length}</strong> người
          </div>
          <div className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded">
            Đơn hàng độc quyền: <strong className="text-emerald-400">{activeOrdersClients.length}</strong> đơn
          </div>
        </div>
      </div>

      {/* 1. Đơn Hàng Trực Tiếp Từ Khách Quen */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Scroll className="w-4 h-4 text-emerald-400" />
          Đơn Hàng Trực Tiếp Đang Chờ Giao ({activeOrdersClients.length})
        </h3>

        {activeOrdersClients.length === 0 ? (
          <div className="p-8 bg-slate-900/60 rounded-lg border border-slate-800 text-center text-slate-500 text-xs">
            Hiện tại chưa có khách quen nào gửi đơn hàng mới. Hãy duy trì rao bán trên thị trường để tìm kiếm thêm bạn hữu tu chân!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeOrdersClients.map((client) => {
              const order = client.activeOrder!;
              const itemMeta = marketItems[order.itemId];
              const { isReady, currentCount, matchedIds } = checkOrderFulfillment(order);
              const rankStyle = RANK_COLORS[order.minRank] || RANK_COLORS.pham_cap;

              return (
                <div
                  key={order.id}
                  className={`bg-slate-900/90 rounded-lg p-4 pixel-box flex flex-col justify-between space-y-3 border transition-all ${
                    isReady
                      ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)] ring-1 ring-emerald-500/40'
                      : 'border-slate-800'
                  }`}
                >
                  <div>
                    {/* Client Info Header */}
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl p-1 bg-slate-950 rounded border border-slate-800">
                          {client.avatar}
                        </span>
                        <div>
                          <h4 className="font-bold text-xs sm:text-sm text-slate-100">{client.name}</h4>
                          <span className="text-[10px] text-amber-400 font-pixel">
                            {client.sect} • {client.realm}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] text-red-400 font-pixel">
                        <Heart className="w-3.5 h-3.5 fill-red-400" />
                        <span>{client.affinity}/100</span>
                      </div>
                    </div>

                    {/* Order requirements */}
                    <div className="mt-3 bg-slate-950/80 p-3 rounded border border-slate-800/80 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Vật phẩm yêu cầu:</span>
                          <strong className="text-xs text-slate-200">{itemMeta?.name || order.itemId}</strong>
                        </div>
                        <span className="text-xs font-bold text-cyan-300 font-pixel">x{order.count} món</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px]">
                        <span className="text-slate-400">Yêu cầu phẩm chất tối thiểu:</span>
                        <span className={`px-1.5 py-0.2 rounded font-pixel font-bold border ${rankStyle.text} ${rankStyle.bg} ${rankStyle.border}`}>
                          {RANK_NAMES[order.minRank]} {order.minStars}★+
                        </span>
                      </div>

                      {/* Stock fulfillment tracker */}
                      <div>
                        <div className="flex justify-between text-[11px] text-slate-400 mb-1 font-pixel">
                          <span>Sản phẩm đạt chuẩn trong kho:</span>
                          <span className={isReady ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                            {currentCount} / {order.count}
                          </span>
                        </div>
                        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className={`h-full transition-all duration-300 ${
                              isReady ? 'bg-emerald-500' : 'bg-amber-400'
                            }`}
                            style={{ width: `${Math.min(100, (currentCount / order.count) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Rewards */}
                    <div className="mt-3 flex items-center justify-between text-xs px-1">
                      <span className="text-amber-300 font-bold font-pixel flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5 text-amber-400" />
                        +{order.rewardLinhThach} Linh Thạch
                      </span>
                      <span className="text-purple-300 font-bold font-pixel flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-red-400" />
                        +{order.rewardAffinity} Thân thiết
                      </span>
                    </div>
                  </div>

                  {/* Deliver button */}
                  <div className="pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => handleDeliver(client.id, order)}
                      disabled={!isReady}
                      className={`w-full py-2.5 rounded font-bold text-xs pixel-btn flex items-center justify-center gap-1.5 cursor-pointer shadow ${
                        isReady
                          ? 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-slate-950'
                          : 'bg-slate-950 text-slate-500 border border-slate-800 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <Send className="w-3.5 h-3.5" />
                      {isReady ? 'BÀN GIAO ĐƠN HÀNG NGAY!' : 'CHƯA ĐỦ SẢN PHẨM ĐẠT PHẨM CHẤT'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Mạng Lưới Khách Hàng & Bạn Bè Đã Mua Hàng */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-5 pixel-box space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" />
            Mạng Lưới Khách Hàng & Bạn Hữu Đã Giao Dịch ({clients.length})
          </h3>
          <span className="text-xs text-slate-400 font-pixel">Khách quen thân thiết</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {clients.map((c) => (
            <div
              key={c.id}
              className="bg-slate-950/80 border border-slate-800 rounded p-3.5 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl p-1 bg-slate-900 rounded border border-slate-800">{c.avatar}</span>
                    <div>
                      <h4 className="font-bold text-sm text-slate-100 flex items-center gap-1">
                        {c.name}
                        {c.isFriend && (
                          <span className="text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/40 px-1 py-0.2 rounded font-pixel">
                            BẠN BÈ
                          </span>
                        )}
                      </h4>
                      <p className="text-[11px] text-amber-400 font-pixel">{c.sect} • {c.realm}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-red-400 font-pixel">
                    <Heart className="w-3.5 h-3.5 fill-red-400" />
                    <span>{c.affinity}</span>
                  </div>
                </div>

                <div className="mt-3 text-xs space-y-1 text-slate-400 bg-slate-900/60 p-2.5 rounded border border-slate-800/80">
                  <div className="flex justify-between">
                    <span>Đã mua từ xưởng:</span>
                    <strong className="text-slate-200 font-pixel">{c.totalPurchasedCount} món</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Tổng tiền chi tiêu:</span>
                    <strong className="text-amber-400 font-pixel">{c.totalSpentLinhThach} LT</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Lần mua gần nhất:</span>
                    <span className="text-slate-300 font-pixel">{c.lastPurchaseDate}</span>
                  </div>
                </div>
              </div>

              {/* Action: Tặng quà / Kết giao */}
              <button
                type="button"
                onClick={() => {
                  sound.playBreakthrough();
                  onSendGiftToClient(c.id);
                }}
                className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-400/60 text-amber-300 text-xs rounded pixel-btn flex items-center justify-center gap-1 cursor-pointer font-pixel"
              >
                <Heart className="w-3 h-3 text-red-400" />
                Gửi Linh Trà Tăng Thân Thiết (-20 LT)
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
