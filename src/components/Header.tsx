import React from 'react';
import { ProfessionId } from '../types/game';
import { PROFESSIONS_DATA } from '../data/gameData';
import { sound } from '../utils/audio';
import { 
  Coins, 
  Award, 
  Volume2, 
  VolumeX, 
  RotateCcw,
  Clock,
  AlertCircle,
  Briefcase,
  Users,
  ShoppingBag,
  UserCheck
} from 'lucide-react';

interface HeaderProps {
  profession: ProfessionId;
  enterpriseName: string;
  playerName: string;
  linhThach: number;
  reputation: number;
  wageElapsedSeconds: number;
  wageCycleSeconds: number;
  wageDue: boolean;
  soundEnabled: boolean;
  activeTab: 'workshop' | 'workers' | 'market' | 'clients';
  onTabChange: (tab: 'workshop' | 'workers' | 'market' | 'clients') => void;
  onOpenWageModal: () => void;
  onSoundToggle: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profession,
  enterpriseName,
  playerName,
  linhThach,
  reputation,
  wageElapsedSeconds,
  wageCycleSeconds,
  wageDue,
  soundEnabled,
  activeTab,
  onTabChange,
  onOpenWageModal,
  onSoundToggle,
  onReset
}) => {
  const prof = PROFESSIONS_DATA[profession];

  // Format countdown 1h30p
  const remainingSeconds = Math.max(0, wageCycleSeconds - wageElapsedSeconds);
  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;
  const timeFormatted = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const wageProgress = Math.min(100, (wageElapsedSeconds / wageCycleSeconds) * 100);

  const tabs: { id: typeof activeTab; label: string; icon: string; isCommon?: boolean }[] = [
    { id: 'workshop', label: `Xưởng ${prof.name}`, icon: '⚒️' },
    { id: 'workers', label: 'Nhân Lực', icon: '👥' },
    { id: 'market', label: 'Thị Trường', icon: '⚖️', isCommon: true },
    { id: 'clients', label: 'Đơn Hàng & Khách Hàng', icon: '📜', isCommon: true },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 shadow-md sticky top-0 z-40">
      {/* Top Banner: Brand, Funds, Wage Timeline */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80">
        {/* Brand & Profession */}
        <div className="flex items-center gap-3">
          <span className="text-2xl p-1.5 bg-slate-950 border border-slate-800 rounded">
            {prof.pixelArtSymbol}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-sm sm:text-base text-slate-100 tracking-wide">
                {enterpriseName}
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-pixel border border-amber-500/30">
                {prof.name}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-2">
              <span>Chủ nhân: <strong className="text-slate-200">{playerName}</strong></span>
              <span>•</span>
              <span className="text-cyan-400 font-pixel">Thời Gian Thực</span>
            </div>
          </div>
        </div>

        {/* Status HUD: Linh Thạch, Uy Danh & Wage Timeline */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-4 text-xs font-medium">
          {/* Linh Thạch */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 border border-amber-500/40 rounded shadow-inner">
            <Coins className="w-4 h-4 text-amber-400" />
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-400 uppercase leading-none">Linh Thạch</span>
              <span className="text-amber-300 font-bold font-pixel text-sm sm:text-base leading-none">
                {linhThach.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Wage Timeline Bar (1h30p) */}
          <div 
            onClick={() => {
              sound.playClick();
              onOpenWageModal();
            }}
            className={`flex flex-col justify-center px-3 py-1.5 bg-slate-950 border rounded cursor-pointer transition-all ${
              wageDue 
                ? 'border-red-500 bg-red-950/30 ring-2 ring-red-500/50 animate-pulse' 
                : 'border-slate-800 hover:border-slate-700'
            }`}
            title="Nhấp để xem bảng lương chi tiết"
          >
            <div className="flex items-center justify-between gap-3 text-[10px] mb-1">
              <span className="flex items-center gap-1 text-slate-400">
                <Briefcase className="w-3 h-3 text-cyan-400" />
                Chu kỳ trả lương (1h30p):
              </span>
              <span className={wageDue ? 'text-red-400 font-bold font-pixel' : 'text-cyan-300 font-pixel'}>
                {wageDue ? 'ĐẾN HẠN TRẢ LƯƠNG!' : timeFormatted}
              </span>
            </div>
            <div className="w-36 bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
              <div 
                className={`h-full transition-all duration-500 ${wageDue ? 'bg-red-500' : 'bg-cyan-400'}`}
                style={{ width: `${wageProgress}%` }}
              />
            </div>
          </div>

          {/* Audio toggle */}
          <button
            type="button"
            onClick={onSoundToggle}
            className={`p-1.5 rounded border cursor-pointer transition-colors ${
              soundEnabled
                ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700'
                : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-400'
            }`}
            title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Reset button */}
          <button
            type="button"
            onClick={onReset}
            className="p-1.5 bg-slate-950 border border-slate-800 rounded text-slate-500 hover:text-red-400 hover:border-red-900 cursor-pointer transition-colors"
            title="Đổi nghề / Khởi tạo lại trò chơi"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs Layout: Tab Chính (Nghề, Nhân Lực) sau đó là Tab Chung (Thị Trường, Đơn Hàng & Khách Hàng) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 flex overflow-x-auto gap-2 py-2 scrollbar-none items-center">
        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-pixel mr-1 hidden sm:inline">
          Chính:
        </span>

        {tabs.map((tab, idx) => {
          const isActive = activeTab === tab.id;
          return (
            <React.Fragment key={tab.id}>
              {idx === 2 && (
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-pixel mx-1.5 hidden sm:inline">
                  Chung:
                </span>
              )}
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onTabChange(tab.id);
                }}
                className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 border ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-sm'
                    : 'bg-slate-950/70 text-slate-300 border-slate-800 hover:bg-slate-800/80 hover:text-slate-100'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </header>
  );
};
