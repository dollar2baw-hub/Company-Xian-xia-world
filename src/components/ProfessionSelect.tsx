import React, { useState } from 'react';
import { ProfessionId } from '../types/game';
import { PROFESSIONS_DATA } from '../data/gameData';
import { sound } from '../utils/audio';
import { Flame, Sparkles, Pickaxe, Sprout, Gem, ArrowRight, ShieldCheck, Coins } from 'lucide-react';

interface ProfessionSelectProps {
  onSelect: (profession: ProfessionId, playerName: string, enterpriseName: string) => void;
}

export const ProfessionSelect: React.FC<ProfessionSelectProps> = ({ onSelect }) => {
  const [selectedProf, setSelectedProf] = useState<ProfessionId>('luyen_khi');
  const [playerName, setPlayerName] = useState('Hàn Lập');
  const [enterpriseName, setEnterpriseName] = useState('Vạn Bảo Tiên Trang');

  const defaultNames: Record<ProfessionId, { player: string; enterprise: string }> = {
    luyen_khi: { player: 'Thiết Búa Chân Nhân', enterprise: 'Vạn Kiếm Luyện Khí Các' },
    luyen_dan: { player: 'Cửu Đỉnh Dược Sư', enterprise: 'Thái Hư Đan Đường' },
    khai_khoang: { player: 'Khai Sơn Đạo Nhân', enterprise: 'Bách Sơn Linh Khoáng Ty' },
    duoc_dien: { player: 'Thần Nông Tiên Tử', enterprise: 'Bách Thảo Linh Điền' },
    luyen_bao: { player: 'Thần Thông Trưởng Lão', enterprise: 'Thiên Cơ Bảo Trai' },
  };

  const handleChoose = (id: ProfessionId) => {
    sound.playClick();
    setSelectedProf(id);
    setEnterpriseName(defaultNames[id].enterprise);
    setPlayerName(defaultNames[id].player);
  };

  const handleStart = () => {
    sound.playBreakthrough();
    onSelect(selectedProf, playerName.trim() || 'Hàn Lập', enterpriseName.trim() || 'Vạn Bảo Tiên Trang');
  };

  const prof = PROFESSIONS_DATA[selectedProf];

  const getIcon = (id: ProfessionId) => {
    switch (id) {
      case 'luyen_khi': return <Flame className="w-5 h-5 text-orange-400" />;
      case 'luyen_dan': return <Sparkles className="w-5 h-5 text-emerald-400" />;
      case 'khai_khoang': return <Pickaxe className="w-5 h-5 text-cyan-400" />;
      case 'duoc_dien': return <Sprout className="w-5 h-5 text-lime-400" />;
      case 'luyen_bao': return <Gem className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-500/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-5xl w-full z-10 flex flex-col items-center">
        {/* Retro Header Banner */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/40 rounded-full text-amber-400 text-xs font-pixel uppercase tracking-widest mb-3">
            <span>❖</span> TU TIÊN CÔNG NGHIỆP • KHAI TÔNG LẬP NGHIỆP <span>❖</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-amber-200 via-amber-400 to-orange-400 bg-clip-text text-transparent drop-shadow-md">
            TIÊN MÔN SẢN NGHIỆP
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-2 max-w-xl mx-auto">
            Thời thế mạt pháp qua đi, kỷ nguyên <span className="text-amber-300 font-semibold">Tu Tiên Cơ Giới Hóa</span> mở ra! 
            Hãy chọn nghề nghiệp bản mệnh để khởi dựng đại xưởng tu chân, tuyển mộ công nhân và thống lĩnh thương trường!
          </p>
        </div>

        {/* Profession Cards Selection Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 w-full mb-6">
          {(Object.keys(PROFESSIONS_DATA) as ProfessionId[]).map((id) => {
            const p = PROFESSIONS_DATA[id];
            const isSelected = selectedProf === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => handleChoose(id)}
                className={`p-3 text-left rounded border transition-all duration-150 flex flex-col justify-between h-40 cursor-pointer ${
                  isSelected
                    ? 'border-amber-400 bg-slate-800/90 shadow-[0_0_15px_rgba(245,158,11,0.3)] ring-2 ring-amber-400/50'
                    : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800/60 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{p.pixelArtSymbol}</span>
                    {getIcon(id)}
                  </div>
                  <h3 className="font-bold text-sm text-slate-100">{p.name}</h3>
                  <p className="text-[11px] text-amber-400/90 font-pixel mt-0.5">{p.workerTitle}</p>
                </div>
                <div className="text-[10px] text-slate-400 border-t border-slate-800 pt-1.5 mt-2">
                  <span className="text-slate-500">Cơ sở:</span> {p.facilityTitle}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Profession Detail Panel */}
        <div className="w-full bg-slate-900/90 border border-slate-700 rounded-lg p-5 sm:p-6 mb-6 pixel-box shadow-2xl backdrop-blur-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Lore & Overview */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl p-2 bg-slate-950 rounded border border-slate-700 shadow-inner">
                  {prof.pixelArtSymbol}
                </span>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-amber-300">
                    {prof.name} <span className="text-xs text-slate-400 font-normal">({prof.workerTitle})</span>
                  </h2>
                  <p className="text-xs text-amber-400 font-pixel italic">{prof.tagline}</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded border border-slate-800">
                {prof.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950/40 p-2.5 rounded border border-slate-800/80">
                  <span className="text-slate-400 font-medium block mb-1">Vật phẩm sản xuất chủ lực:</span>
                  <span className="text-emerald-300 font-semibold">{prof.primaryProduced}</span>
                </div>
                <div className="bg-slate-950/40 p-2.5 rounded border border-slate-800/80">
                  <span className="text-slate-400 font-medium block mb-1">Nguyên liệu tiêu hao:</span>
                  <span className="text-orange-300 font-semibold">{prof.primaryConsumed}</span>
                </div>
              </div>

              {/* Special Perks */}
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  Đặc quyền thiên phú nghề nghiệp:
                </h4>
                <ul className="space-y-1.5">
                  {prof.perks.map((perk, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column: Setup Profile & Initial Capital */}
            <div className="lg:col-span-5 bg-slate-950/80 border border-slate-800 rounded p-4 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs text-slate-400">Vốn khởi nghiệp:</span>
                <span className="text-amber-400 font-bold font-pixel text-lg flex items-center gap-1.5">
                  <Coins className="w-4 h-4" />
                  {prof.startingLinhThach} Linh Thạch
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Đạo hiệu Tông Chủ / Xưởng Chủ:
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-400 font-medium"
                  placeholder="Nhập tên đạo hiệu..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Tên Thương Hiệu / Xưởng Sản Xuất:
                </label>
                <input
                  type="text"
                  value={enterpriseName}
                  onChange={(e) => setEnterpriseName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-400 font-medium"
                  placeholder="Nhập tên xưởng..."
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleStart}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm rounded shadow-lg pixel-btn flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <span>BƯỚC VÀO TIÊN GIỚI SẢN NGHIỆP</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info note */}
        <p className="text-[11px] text-slate-500 font-pixel text-center">
          Tu Tiên Công Nghiệp • Hệ thống quản lý công nhân, lò luyện, mỏ khoáng, dược điền và thương hội
        </p>
      </div>
    </div>
  );
};
