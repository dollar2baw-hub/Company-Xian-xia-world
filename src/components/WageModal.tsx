import React from 'react';
import { Worker } from '../types/game';
import { sound } from '../utils/audio';
import { 
  Coins, 
  AlertCircle, 
  CheckCircle2, 
  Users, 
  ShieldAlert, 
  X, 
  Flame, 
  Award, 
  Briefcase 
} from 'lucide-react';

interface WageModalProps {
  isOpen: boolean;
  onClose: () => void;
  workers: Worker[];
  linhThach: number;
  onPayWages: () => void;
}

export const WageModal: React.FC<WageModalProps> = ({
  isOpen,
  onClose,
  workers,
  linhThach,
  onPayWages
}) => {
  if (!isOpen) return null;

  const totalWage = workers.reduce((sum, w) => sum + w.wageDetails.total, 0);
  const canAfford = linhThach >= totalWage;

  const handlePay = () => {
    sound.playCoins();
    onPayWages();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative max-w-2xl w-full bg-slate-900 border-2 border-amber-500 rounded-lg pixel-box shadow-2xl p-5 sm:p-6 space-y-4 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <Coins className="w-6 h-6 text-amber-400 animate-pulse" />
            <div>
              <h3 className="font-bold text-base sm:text-lg text-slate-100">
                Kỳ Thanh Toán Lương Chu Kỳ (1h30p)
              </h3>
              <p className="text-xs text-amber-400/90 font-pixel">
                Đã đến hạn trả thù lao cho đội ngũ công nhân xưởng
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Total Summary */}
        <div className="bg-slate-950/80 p-3.5 rounded border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block">Tổng quỹ lương cần trả:</span>
            <span className="text-lg sm:text-xl font-bold font-pixel text-amber-300">
              {totalWage.toLocaleString()} Linh Thạch
            </span>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block">Số dư hiện tại:</span>
            <span className={canAfford ? 'text-emerald-400 font-pixel font-bold' : 'text-red-400 font-pixel font-bold'}>
              {linhThach.toLocaleString()} Linh Thạch
            </span>
          </div>
        </div>

        {/* Detailed Breakdown for each worker */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-4 h-4 text-cyan-400" />
            Chi Tiết Thù Lao Từng Nhân Lực ({workers.length} người):
          </h4>

          {workers.map((w) => (
            <div
              key={w.id}
              className="bg-slate-950/60 border border-slate-800 rounded p-3 text-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <div>
                  <strong className="text-slate-200 text-sm">{w.name}</strong>
                  <span className="ml-2 text-[10px] text-amber-400 font-pixel">
                    ({w.realm})
                  </span>
                </div>
                <span className="font-bold font-pixel text-sm text-amber-300">
                  {w.wageDetails.total} LT
                </span>
              </div>

              {/* Component breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] bg-slate-900/60 p-2 rounded border border-slate-800/80">
                <div>
                  <span className="text-slate-400 block">Lương cơ bản:</span>
                  <span className="text-slate-200 font-pixel">{w.wageDetails.base} LT</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Phụ cấp nặng nhọc:</span>
                  <span className="text-orange-300 font-pixel">+{w.wageDetails.hazardBonus} LT</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Phụ cấp tu vi:</span>
                  <span className="text-purple-300 font-pixel">+{w.wageDetails.realmBonus} LT</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Tay nghề:</span>
                  <span className="text-cyan-300 font-pixel">+{w.wageDetails.skillBonus} LT</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pay action */}
        <div className="pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={handlePay}
            disabled={!canAfford}
            className={`w-full py-2.5 rounded font-bold text-xs sm:text-sm pixel-btn flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
              canAfford
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950'
                : 'bg-slate-800 text-red-400 border border-red-800 cursor-not-allowed'
            }`}
          >
            <Coins className="w-4 h-4" />
            {canAfford ? `THANH TOÁN TOÀN BỘ LƯƠNG (${totalWage} LT)` : 'KHÔNG ĐỦ LINH THẠCH THANH TOÁN!'}
          </button>
        </div>
      </div>
    </div>
  );
};
