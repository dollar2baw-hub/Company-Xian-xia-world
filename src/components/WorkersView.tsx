import React, { useState } from 'react';
import { Worker, ProfessionId, Workstation } from '../types/game';
import { PROFESSIONS_DATA, RARE_TALENTS, computeWorkerWage } from '../data/gameData';
import { sound } from '../utils/audio';
import { 
  Users, 
  UserPlus, 
  UserX, 
  Sparkles, 
  Briefcase, 
  Coins, 
  ShieldAlert, 
  Award, 
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface WorkersViewProps {
  workers: Worker[];
  workstations: Workstation[];
  profession: ProfessionId;
  linhThach: number;
  onHireWorker: (candidate: Worker, hireCost: number) => void;
  onFireWorker: (workerId: string) => void;
  onOpenWageModal: () => void;
}

export const WorkersView: React.FC<WorkersViewProps> = ({
  workers,
  workstations,
  profession,
  linhThach,
  onHireWorker,
  onFireWorker,
  onOpenWageModal
}) => {
  const prof = PROFESSIONS_DATA[profession];
  const [selectedWorkerForWage, setSelectedWorkerForWage] = useState<Worker | null>(null);

  // Pool of job seekers for hire
  const candidatePool: Array<{ worker: Worker; hireCost: number }> = [
    {
      worker: {
        id: `cand_1_${Date.now()}`,
        name: 'Trần Đại Lực',
        profession,
        realm: 'Phàm Nhân',
        realmLevel: 1,
        stamina: 100,
        maxStamina: 100,
        efficiency: 1.05,
        wageDetails: computeWorkerWage(1, 2, 1),
        experience: 0,
        nextLevelExp: 50,
        hasTalent: false,
        specialStat: { name: 'Thể Lực Cường Hãn', value: '+10%', description: 'Ít hao mòn thể lực khi làm việc' },
        assignedFacilityId: null,
        status: 'idle',
        avatarSeed: 101
      },
      hireCost: 120
    },
    {
      worker: {
        id: `cand_2_${Date.now()}`,
        name: 'Mộc Vân Dao',
        profession,
        realm: 'Luyện Khí Kỳ (Tầng 1-3)',
        realmLevel: 2,
        stamina: 100,
        maxStamina: 100,
        efficiency: 1.25,
        wageDetails: computeWorkerWage(2, 2, 2),
        experience: 20,
        nextLevelExp: 80,
        hasTalent: false,
        specialStat: { name: 'Tâm Pháp Ôn Hỏa', value: '+15% Hiệu Suất', description: 'Gia tăng tính ổn định của ngọn lửa' },
        assignedFacilityId: null,
        status: 'idle',
        avatarSeed: 102
      },
      hireCost: 280
    },
    {
      worker: {
        id: `cand_3_${Date.now()}`,
        name: 'Liễu Thiên Cơ',
        profession,
        realm: 'Luyện Khí Kỳ (Tầng 4-6)',
        realmLevel: 3,
        stamina: 100,
        maxStamina: 100,
        efficiency: 1.5,
        wageDetails: computeWorkerWage(3, 2, 3),
        experience: 50,
        nextLevelExp: 150,
        hasTalent: true, // ~5% rare talent!
        talent: RARE_TALENTS[1], // Đoán Cốt Thần Thủ (+2★)
        specialStat: { name: 'Thần Thức Khống Chế', value: '+25%', description: 'Tăng tỉ lệ sản phẩm Thượng cấp' },
        assignedFacilityId: null,
        status: 'idle',
        avatarSeed: 103
      },
      hireCost: 650
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-lg pixel-box">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            Nhân Lực Xưởng ({prof.workerTitle})
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Quản lý đội ngũ {prof.workerTitle}, kiểm tra thiên phú hiếm, mức lương chu kỳ 1h30p và chiêu mộ thợ mới.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenWageModal();
            }}
            className="px-3.5 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-700 rounded text-xs text-amber-300 font-pixel flex items-center gap-1.5 cursor-pointer"
          >
            <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
            Bảng Lương Chu Kỳ 1h30p ({workers.reduce((s, w) => s + w.wageDetails.total, 0)} LT)
          </button>
        </div>
      </div>

      {/* 1. Danh sách các Luyện Khí Sư Đã Chiêu Mộ */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Users className="w-4 h-4 text-cyan-400" />
          Đội Ngũ {prof.workerTitle} Đang Phục Vụ ({workers.length} người)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workers.map((w) => {
            const activeStation = workstations.find(ws => ws.assignedWorkerIds.includes(w.id));

            return (
              <div
                key={w.id}
                className="bg-slate-900/90 border border-slate-800 rounded-lg p-4 pixel-box flex flex-col justify-between space-y-3 relative"
              >
                <div>
                  {/* Top: Name & Realm */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                        {w.name}
                        {w.hasTalent && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[9px] font-pixel">
                            ★ THIÊN PHÚ
                          </span>
                        )}
                      </h4>
                      <span className="text-[11px] text-amber-300 font-pixel mt-0.5 block">
                        Cảnh giới: {w.realm}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-pixel ${
                        w.status === 'working'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {w.status === 'working' ? 'ĐANG LÀM' : 'RẢNH RỖI'}
                    </span>
                  </div>

                  {/* Lò mà họ đang hoạt động */}
                  <div className="mt-2.5 bg-slate-950/80 p-2 rounded border border-slate-800/80 text-xs">
                    <span className="text-slate-400">Nơi hoạt động: </span>
                    <strong className={activeStation ? 'text-amber-300' : 'text-slate-500 italic'}>
                      {activeStation ? activeStation.name : 'Chưa được gán cơ sở nào'}
                    </strong>
                  </div>

                  {/* Chỉ số & Hiệu suất */}
                  <div className="mt-2 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Hiệu suất rèn luyện:</span>
                      <strong className="text-emerald-400 font-pixel">
                        +{Math.round((w.efficiency - 1) * 100)}%
                      </strong>
                    </div>

                    {w.specialStat && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Chỉ số đặc biệt:</span>
                        <span className="text-cyan-300 font-pixel">
                          {w.specialStat.name} ({w.specialStat.value})
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Thiên phú hiếm (~5% tỉ lệ xuất hiện) */}
                  {w.hasTalent && w.talent && (
                    <div className="mt-2.5 bg-amber-950/40 border border-amber-500/50 p-2.5 rounded text-xs space-y-1">
                      <div className="font-bold text-amber-300 font-pixel flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        THIÊN PHÚ: {w.talent.name}
                      </div>
                      <p className="text-[11px] text-slate-300 leading-tight">
                        {w.talent.description}
                      </p>
                    </div>
                  )}

                  {/* Mức lương chu kỳ 1h30p */}
                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Lương chu kỳ (1h30p):</span>
                      <strong className="text-amber-300 font-pixel text-sm">
                        {w.wageDetails.total} Linh Thạch
                      </strong>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedWorkerForWage(w)}
                      className="text-xs text-cyan-400 hover:text-cyan-300 underline font-pixel cursor-pointer"
                    >
                      [Xem chi tiết lương]
                    </button>
                  </div>
                </div>

                {/* Trục Xuất button */}
                <div className="pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Bạn có chắc chắn muốn trục xuất ${w.name} rời khỏi xưởng?`)) {
                        sound.playClick();
                        onFireWorker(w.id);
                      }
                    }}
                    className="w-full py-1.5 bg-slate-950 hover:bg-red-950/80 border border-slate-800 hover:border-red-800 text-slate-400 hover:text-red-300 text-xs rounded pixel-btn flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <UserX className="w-3.5 h-3.5" />
                    Trục Xuất Khỏi Xưởng
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Chiêu Mộ Thợ Mới */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-5 pixel-box space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-emerald-400" />
            2. Chiêu Mộ Nhân Lực Muốn Tìm Việc ({prof.workerTitle})
          </h3>
          <span className="text-xs text-slate-400 font-pixel">Cập nhật ứng viên tu chân</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {candidatePool.map((c, idx) => {
            const canAfford = linhThach >= c.hireCost;
            return (
              <div
                key={idx}
                className="bg-slate-950/80 border border-slate-800 rounded p-3.5 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                        {c.worker.name}
                        {c.worker.hasTalent && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[9px] font-pixel">
                            ★ THIÊN PHÚ
                          </span>
                        )}
                      </h4>
                      <span className="text-[10px] text-amber-400 font-pixel">{c.worker.realm}</span>
                    </div>

                    <span className="text-xs font-bold text-amber-300 font-pixel">
                      {c.hireCost} LT
                    </span>
                  </div>

                  <div className="mt-2 text-xs space-y-1 text-slate-400">
                    <p>Hiệu suất: <strong className="text-emerald-400">+{Math.round((c.worker.efficiency - 1) * 100)}%</strong></p>
                    <p>Lương chu kỳ (1h30p): <strong className="text-slate-200">{c.worker.wageDetails.total} LT</strong></p>
                    
                    {c.worker.hasTalent && c.worker.talent && (
                      <p className="text-[11px] text-amber-300 font-pixel border-t border-slate-800 pt-1">
                        ★ {c.worker.talent.name}: {c.worker.talent.description}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    sound.playCoins();
                    onHireWorker(c.worker, c.hireCost);
                  }}
                  disabled={!canAfford}
                  className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-bold text-xs rounded pixel-btn cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Chiêu Mộ ({c.hireCost} Linh Thạch)
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Chi Tiết Lương Worker */}
      {selectedWorkerForWage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative max-w-md w-full bg-slate-900 border-2 border-amber-500 rounded p-5 pixel-box space-y-3">
            <h4 className="font-bold text-sm text-slate-100 flex items-center justify-between border-b border-slate-800 pb-2">
              <span>Chi Tiết Lương: {selectedWorkerForWage.name}</span>
              <span className="text-xs text-amber-400 font-pixel">{selectedWorkerForWage.wageDetails.total} LT / 1h30p</span>
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between bg-slate-950 p-2 rounded">
                <span className="text-slate-400">1. Lương cơ bản nghề:</span>
                <span className="text-slate-200 font-pixel">{selectedWorkerForWage.wageDetails.base} LT</span>
              </div>
              <div className="flex justify-between bg-slate-950 p-2 rounded">
                <span className="text-slate-400">2. Phụ cấp công việc ({prof.hazardType}):</span>
                <span className="text-orange-300 font-pixel">+{selectedWorkerForWage.wageDetails.hazardBonus} LT</span>
              </div>
              <div className="flex justify-between bg-slate-950 p-2 rounded">
                <span className="text-slate-400">3. Phụ cấp cảnh giới ({selectedWorkerForWage.realm}):</span>
                <span className="text-purple-300 font-pixel">+{selectedWorkerForWage.wageDetails.realmBonus} LT</span>
              </div>
              <div className="flex justify-between bg-slate-950 p-2 rounded">
                <span className="text-slate-400">4. Thù lao tay nghề & thâm niên:</span>
                <span className="text-cyan-300 font-pixel">+{selectedWorkerForWage.wageDetails.skillBonus} LT</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSelectedWorkerForWage(null)}
                className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded pixel-btn cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
