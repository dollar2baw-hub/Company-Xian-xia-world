import React, { useState } from 'react';
import { 
  ProfessionId, 
  Workstation, 
  Recipe, 
  Worker, 
  ResourceItem, 
  ProducedProduct,
  ProductionMode,
  ProductionQueueItem
} from '../types/game';
import { PROFESSIONS_DATA, RANK_NAMES, RANK_COLORS } from '../data/gameData';
import { PixelCanvas } from './PixelCanvas';
import { sound } from '../utils/audio';
import { 
  Flame, 
  Archive, 
  Play, 
  Square, 
  Users, 
  ArrowUpCircle, 
  Layers, 
  AlertTriangle,
  Clock,
  Sparkles,
  CheckCircle2,
  ListOrdered,
  Infinity as InfinityIcon,
  Plus,
  Trash2,
  RefreshCw,
  Hammer
} from 'lucide-react';

interface WorkshopViewProps {
  profession: ProfessionId;
  workstations: Workstation[];
  recipes: Recipe[];
  workers: Worker[];
  rawMaterials: Record<string, number>;
  craftedProducts: ProducedProduct[];
  marketItems: Record<string, ResourceItem>;
  linhThach: number;
  onOpenStorage: () => void;
  onStartProduction: (stationId: string, recipeId: string, mode: ProductionMode, targetCount: number, queue: ProductionQueueItem[], repeatMode: 'none' | 'infinite' | 'count', repeatTotal: number) => void;
  onStopProduction: (stationId: string) => void;
  onAssignWorkers: (stationId: string, workerIds: string[]) => void;
  onUpgradeStation: (stationId: string) => void;
  onManualAccelerate: (stationId: string) => void;
}

export const WorkshopView: React.FC<WorkshopViewProps> = ({
  profession,
  workstations,
  recipes,
  workers,
  rawMaterials,
  craftedProducts,
  marketItems,
  linhThach,
  onOpenStorage,
  onStartProduction,
  onStopProduction,
  onAssignWorkers,
  onUpgradeStation,
  onManualAccelerate
}) => {
  const prof = PROFESSIONS_DATA[profession];
  const [selectedStationId, setSelectedStationId] = useState<string>(workstations[0]?.id || '');
  const activeStation = workstations.find(ws => ws.id === selectedStationId) || workstations[0];

  // Modal / config state for active furnace
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>(recipes[0]?.id || '');
  const [productionMode, setProductionMode] = useState<ProductionMode>('infinite');
  const [targetCount, setTargetCount] = useState<number>(10);
  
  // Custom Queue builder: e.g. 10 swords -> 5 bows -> 2 shields
  const [queueItems, setQueueItems] = useState<ProductionQueueItem[]>([]);
  const [queueRepeatMode, setQueueRepeatMode] = useState<'none' | 'infinite' | 'count'>('none');
  const [queueRepeatTotal, setQueueRepeatTotal] = useState<number>(1);

  // Workers assigned to current station
  const assignedWorkers = workers.filter(w => activeStation?.assignedWorkerIds.includes(w.id));
  const availableWorkers = workers.filter(w => w.profession === profession);

  const getUpgradeCost = (level: number) => level * 200 + 150;

  // Add to queue builder
  const handleAddToQueue = (recipeId: string, count: number) => {
    sound.playClick();
    setQueueItems(prev => [
      ...prev,
      { id: `q_${Date.now()}_${Math.random()}`, recipeId, targetCount: count, completedCount: 0 }
    ]);
  };

  const handleRemoveFromQueue = (index: number) => {
    sound.playClick();
    setQueueItems(prev => prev.filter((_, i) => i !== index));
  };

  // Toggle assigning a worker
  const handleToggleWorker = (workerId: string) => {
    if (!activeStation) return;
    sound.playClick();
    let currentIds = [...activeStation.assignedWorkerIds];
    if (currentIds.includes(workerId)) {
      currentIds = currentIds.filter(id => id !== workerId);
    } else {
      if (currentIds.length >= activeStation.maxWorkers) {
        alert(`Cơ sở này cấp ${activeStation.level} chỉ chứa tối đa ${activeStation.maxWorkers} ${prof.workerTitle}. Hãy nâng cấp cơ sở để thêm chỗ!`);
        return;
      }
      currentIds.push(workerId);
    }
    onAssignWorkers(activeStation.id, currentIds);
  };

  const handleStart = () => {
    if (!activeStation) return;
    sound.playClick();
    onStartProduction(
      activeStation.id,
      selectedRecipeId,
      productionMode,
      targetCount,
      queueItems,
      queueRepeatMode,
      queueRepeatTotal
    );
  };

  const checkRecipeMaterials = (recipe: Recipe) => {
    return recipe.ingredients.every(ing => (rawMaterials[ing.itemId] || 0) >= ing.count);
  };

  const totalProfessionWorkers = workers.filter(w => w.profession === profession);
  const workingCount = totalProfessionWorkers.filter(w => w.status === 'working').length;
  const idleCount = totalProfessionWorkers.length - workingCount;

  return (
    <div className="space-y-6">
      {/* 1. Header Metrics: Luyện Khí Sư Count + Nút Mở Kho (Tab đóng) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-900 border border-slate-800 p-4 rounded-lg pixel-box">
        {/* Info 1: Luyện khí sư (số nhân công đang có) */}
        <div className="md:col-span-7 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2 bg-slate-950 border border-slate-800 rounded">
              {prof.pixelArtSymbol}
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                {prof.name} • {prof.facilityTitle}
              </h2>
              <div className="flex items-center gap-2 text-xs font-pixel mt-0.5">
                <span className="text-amber-400">
                  Tổng {prof.workerTitle}: <strong>{totalProfessionWorkers.length}</strong>
                </span>
                <span>•</span>
                <span className="text-emerald-400">Đang làm việc: {workingCount}</span>
                <span>•</span>
                <span className="text-slate-400">Rảnh rỗi: {idleCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info 2: Kho (Nút bấm mở tab đóng: Tab Nguyên Liệu & Tab Sản Phẩm) */}
        <div className="md:col-span-5 flex justify-end">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenStorage();
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs sm:text-sm rounded pixel-btn flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <Archive className="w-4 h-4" />
            <span>MỞ KHO TIÊN GIA (NGUYÊN LIỆU & SẢN PHẨM)</span>
          </button>
        </div>
      </div>

      {/* 2. Animated Workshop Pixel Canvas */}
      <PixelCanvas
        profession={profession}
        isRunning={workstations.some(w => w.status === 'running')}
        workerCount={workingCount}
        facilityLevel={activeStation?.level || 1}
        onManualAction={() => {
          if (activeStation && activeStation.status === 'running') {
            onManualAccelerate(activeStation.id);
          }
        }}
      />

      {/* 3. Bên dưới là các Lò đang sở hữu & Cấp độ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Workstations list */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              Danh Sách {prof.facilityTitle} ({workstations.length})
            </h3>
            <span className="text-[11px] text-slate-400 font-pixel">Bấm để điều phối</span>
          </div>

          <div className="space-y-2.5">
            {workstations.map((ws) => {
              const isSelected = ws.id === activeStation?.id;
              const activeRecipe = recipes.find(r => r.id === ws.activeRecipeId);
              const assignedCount = ws.assignedWorkerIds.length;

              return (
                <div
                  key={ws.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedStationId(ws.id);
                  }}
                  className={`p-3.5 rounded border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800/90 border-amber-400 shadow-md ring-1 ring-amber-400/40'
                      : 'bg-slate-900/70 border-slate-800 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-slate-100">{ws.name}</span>
                        <span className="text-[10px] bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 text-amber-400 font-pixel font-bold">
                          Cấp {ws.level}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Sức chứa thợ: <strong className="text-cyan-300">{assignedCount}/{ws.maxWorkers}</strong> {prof.workerTitle}
                      </p>
                    </div>

                    <div>
                      {ws.status === 'running' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-pixel font-bold animate-pulse">
                          ĐANG HOẠT ĐỘNG
                        </span>
                      ) : ws.status === 'waiting_materials' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-pixel font-bold">
                          THIẾU NGUYÊN LIỆU
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 border border-slate-700 font-pixel">
                          ĐANG NGHỈ
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Progress bar if running */}
                  {ws.status === 'running' && (
                    <div className="mt-2.5">
                      <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-pixel">
                        <span className="text-amber-300">{activeRecipe?.name || 'Đang sản xuất...'}</span>
                        <span>{Math.round(ws.progress)}%</span>
                      </div>
                      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="bg-gradient-to-r from-amber-500 to-orange-400 h-full transition-all duration-200"
                          style={{ width: `${ws.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {ws.status === 'waiting_materials' && (
                    <div className="mt-2 text-[10px] text-amber-400/90 font-pixel flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-400" />
                      Công nhân tạm dừng công việc chờ nạp đủ nguyên liệu vào kho!
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Furnace Operations */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-lg p-5 pixel-box space-y-5">
          {activeStation ? (
            <>
              {/* Header: Name, Level & Upgrade */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="font-bold text-base text-amber-300 flex items-center gap-2">
                    <span>{prof.pixelArtSymbol}</span>
                    {activeStation.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Cấp {activeStation.level} • Sức chứa: {activeStation.maxWorkers} thợ • Tỉ lệ ra phẩm chất cao: +{activeStation.level * 8}%
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onUpgradeStation(activeStation.id)}
                    disabled={linhThach < getUpgradeCost(activeStation.level)}
                    className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded text-xs font-semibold pixel-btn cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                  >
                    <ArrowUpCircle className="w-4 h-4" />
                    Nâng Cấp Lò ({getUpgradeCost(activeStation.level)} LT)
                  </button>
                </div>
              </div>

              {/* 3.1: Chỉ Định Luyện Khí Sư Làm Việc Tại Lò */}
              <div className="bg-slate-950/80 p-3.5 rounded border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-cyan-400" />
                    3.1 Chỉ Định {prof.workerTitle} ({assignedWorkers.length}/{activeStation.maxWorkers}):
                  </span>
                  <span className="text-[11px] text-amber-400 font-pixel">
                    Càng nhiều thợ cao cấp ➔ Sản xuất càng nhanh & Phẩm chất càng cao
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {availableWorkers.map((w) => {
                    const isAssigned = activeStation.assignedWorkerIds.includes(w.id);
                    return (
                      <button
                        key={w.id}
                        type="button"
                        onClick={() => handleToggleWorker(w.id)}
                        className={`p-2 rounded text-left text-xs border transition-all cursor-pointer flex items-center justify-between ${
                          isAssigned
                            ? 'bg-amber-500/20 border-amber-500/60 text-amber-200'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div>
                          <strong className="text-slate-100">{w.name}</strong>
                          <span className="text-[10px] text-cyan-300 block font-pixel">
                            {w.realm} • Hiệu suất: +{Math.round((w.efficiency - 1) * 100)}%
                          </span>
                        </div>
                        <span className="text-[10px] font-pixel font-bold">
                          {isAssigned ? '✓ ĐANG RÈN' : '+ CHỈ ĐỊNH'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Workstation Running Status or Configuration Panel */}
              {activeStation.status === 'running' || activeStation.status === 'waiting_materials' ? (
                <div className="bg-slate-950/80 p-4 rounded border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Trạng thái lò</span>
                      <span className="font-bold text-sm text-amber-400">
                        {recipes.find(r => r.id === activeStation.activeRecipeId)?.name || 'Chuỗi sản xuất tự động'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onStopProduction(activeStation.id)}
                      className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900 border border-red-700 text-red-300 text-xs rounded pixel-btn flex items-center gap-1 cursor-pointer"
                    >
                      <Square className="w-3 h-3" /> Dừng Lò Luyện
                    </button>
                  </div>

                  {/* Progress bar */}
                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1 font-pixel">
                      <span>Tiến trình hoàn thiện</span>
                      <span className="text-emerald-400">{Math.round(activeStation.progress)}%</span>
                    </div>
                    <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full transition-all duration-200"
                        style={{ width: `${activeStation.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Manual hammering button */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => onManualAccelerate(activeStation.id)}
                      className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-slate-950 font-bold text-xs rounded pixel-btn cursor-pointer flex items-center justify-center gap-2 shadow"
                    >
                      <Hammer className="w-4 h-4" />
                      GÕ BÚA TRỢ LỰC THỦ CÔNG (+15% TIẾN TRÌNH)
                    </button>
                  </div>
                </div>
              ) : (
                /* Configuration Form for starting craft */
                <div className="space-y-4">
                  {/* Select Mode */}
                  <div>
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                      3. Chọn Chế Độ Sản Xuất:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setProductionMode('infinite')}
                        className={`p-2.5 rounded text-left border cursor-pointer text-xs ${
                          productionMode === 'infinite'
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <InfinityIcon className="w-4 h-4 mb-1 text-amber-400" />
                        <span className="block font-semibold">Sản Xuất Vô Hạn</span>
                        <span className="text-[10px] text-slate-400">Rèn liên tục không giới hạn</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setProductionMode('fixed_count')}
                        className={`p-2.5 rounded text-left border cursor-pointer text-xs ${
                          productionMode === 'fixed_count'
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <ListOrdered className="w-4 h-4 mb-1 text-cyan-400" />
                        <span className="block font-semibold">Theo Số Lượng</span>
                        <span className="text-[10px] text-slate-400">Đủ số lượng đặt ra sẽ dừng</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setProductionMode('queue')}
                        className={`p-2.5 rounded text-left border cursor-pointer text-xs ${
                          productionMode === 'queue'
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <RefreshCw className="w-4 h-4 mb-1 text-emerald-400" />
                        <span className="block font-semibold">Chuỗi Tự Động</span>
                        <span className="text-[10px] text-slate-400">10 Kiếm ➔ 10 Cung ➔ Lặp lại</span>
                      </button>
                    </div>
                  </div>

                  {/* Mode-specific settings */}
                  {productionMode === 'fixed_count' && (
                    <div className="bg-slate-950/60 p-3 rounded border border-slate-800 flex items-center justify-between">
                      <span className="text-xs text-slate-300">Nhập số lượng cần sản xuất:</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={1}
                          max={500}
                          value={targetCount}
                          onChange={(e) => setTargetCount(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-24 bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-sm text-amber-300 font-pixel font-bold focus:outline-none focus:border-amber-400 text-center"
                        />
                        <span className="text-xs text-slate-400">món</span>
                      </div>
                    </div>
                  )}

                  {productionMode === 'queue' && (
                    <div className="bg-slate-950/70 p-3.5 rounded border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200">
                          Lập Trình Chuỗi Sản Xuất Tự Động ({queueItems.length} công đoạn):
                        </span>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-slate-400">Lặp lại:</span>
                          <select
                            value={queueRepeatMode}
                            onChange={(e) => setQueueRepeatMode(e.target.value as any)}
                            className="bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-xs text-amber-300 font-pixel"
                          >
                            <option value="none">Không lặp (Chạy 1 lần)</option>
                            <option value="infinite">Lặp vô hạn</option>
                            <option value="count">Lặp N lần</option>
                          </select>
                        </div>
                      </div>

                      {/* Queue items list */}
                      {queueItems.length === 0 ? (
                        <p className="text-xs text-slate-500 italic py-2 text-center">
                          Chưa có công đoạn nào. Hãy chọn công thức bên dưới và bấm "+ Thêm vào chuỗi".
                        </p>
                      ) : (
                        <div className="space-y-1.5">
                          {queueItems.map((q, idx) => {
                            const qRecipe = recipes.find(r => r.id === q.recipeId);
                            return (
                              <div
                                key={q.id}
                                className="flex items-center justify-between bg-slate-900 p-2 rounded border border-slate-800 text-xs"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="font-pixel text-amber-400">#{idx + 1}</span>
                                  <span className="font-semibold text-slate-200">{qRecipe?.name}</span>
                                  <span className="text-cyan-300 font-pixel">x{q.targetCount} món</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveFromQueue(idx)}
                                  className="text-slate-500 hover:text-red-400 p-1 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Recipes List to pick from */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      Chọn Vật Phẩm Sản Xuất:
                    </span>

                    <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                      {recipes.filter(r => r.profession === profession).map((r) => {
                        const isSelected = selectedRecipeId === r.id;
                        const hasMaterials = checkRecipeMaterials(r);

                        return (
                          <div
                            key={r.id}
                            className={`p-3 rounded border transition-all ${
                              isSelected
                                ? 'bg-slate-950 border-amber-400 ring-1 ring-amber-400/30'
                                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div
                                onClick={() => setSelectedRecipeId(r.id)}
                                className="flex-1 cursor-pointer"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-xs sm:text-sm text-slate-200">{r.name}</span>
                                  <span className="text-[10px] text-amber-400 font-pixel">
                                    (Cơ bản: {RANK_NAMES[r.baseRank]})
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                                  {r.description}
                                </p>

                                {/* Ingredients */}
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {r.ingredients.map(ing => {
                                    const owned = rawMaterials[ing.itemId] || 0;
                                    const ok = owned >= ing.count;
                                    const meta = marketItems[ing.itemId];
                                    return (
                                      <span
                                        key={ing.itemId}
                                        className={`text-[10px] px-2 py-0.5 rounded border font-pixel ${
                                          ok ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300' : 'bg-red-950/40 border-red-800 text-red-300'
                                        }`}
                                      >
                                        {meta?.name || ing.itemId}: {owned}/{ing.count}
                                      </span>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Button to select or add to queue */}
                              <div className="flex flex-col gap-1.5 items-end">
                                {productionMode === 'queue' ? (
                                  <button
                                    type="button"
                                    onClick={() => handleAddToQueue(r.id, 10)}
                                    className="px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 border border-cyan-700 text-cyan-200 text-xs rounded pixel-btn cursor-pointer flex items-center gap-1"
                                  >
                                    <Plus className="w-3 h-3" /> Thêm 10 món
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setSelectedRecipeId(r.id)}
                                    className={`px-3 py-1 text-xs rounded font-pixel cursor-pointer ${
                                      isSelected
                                        ? 'bg-amber-500 text-slate-950 font-bold'
                                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                    }`}
                                  >
                                    {isSelected ? '✓ Đã Chọn' : 'Chọn'}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Start Crafting Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleStart}
                      disabled={productionMode === 'queue' && queueItems.length === 0}
                      className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs sm:text-sm rounded pixel-btn flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Play className="w-4 h-4 fill-slate-950" />
                      <span>KHỞI ĐỘNG LÒ SẢN XUẤT</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
