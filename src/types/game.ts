export type ProfessionId = 'luyen_khi' | 'luyen_dan' | 'khai_khoang' | 'duoc_dien' | 'luyen_bao';

// Phẩm chất: Phàm cấp -> Huyền cấp -> Hoàng cấp -> Địa cấp -> Thiên cấp
export type ItemRank = 'pham_cap' | 'huyen_cap' | 'hoang_cap' | 'dia_cap' | 'thien_cap';

export interface ItemQuality {
  rank: ItemRank;
  stars: number; // 1 to 9 (Nhất tinh -> Cửu tinh)
}

export interface ResourceItem {
  id: string;
  name: string;
  category: 'khoang_san' | 'duoc_lieu' | 'khi_cu' | 'dan_duoc' | 'trang_suc' | 'nhien_lieu';
  description: string;
  basePrice: number;
  currentPrice: number;
  priceTrend: 'up' | 'down' | 'stable';
  icon: string;
  professionSource?: ProfessionId;
  color: string;
  isCraftableProduct?: boolean;
}

export interface ProducedProduct {
  id: string; // unique instance id
  itemId: string;
  name: string;
  category: 'khi_cu' | 'dan_duoc' | 'trang_suc' | 'khoang_san' | 'duoc_lieu';
  rank: ItemRank;
  stars: number; // 1-9
  craftedAt: number;
  craftsmanName: string;
}

export interface Recipe {
  id: string;
  name: string;
  profession: ProfessionId;
  description: string;
  ingredients: { itemId: string; count: number }[];
  resultItemId: string;
  resultCount: number;
  craftTimeSeconds: number;
  minMasteryLevel: number;
  expReward: number;
  unlocked: boolean;
  baseRank: ItemRank;
}

export type CultivationRealm = 
  | 'Phàm Nhân'
  | 'Luyện Khí Kỳ (Tầng 1-3)'
  | 'Luyện Khí Kỳ (Tầng 4-6)'
  | 'Luyện Khí Kỳ (Tầng 7-9)'
  | 'Trúc Cơ Kỳ'
  | 'Kim Đan Kỳ'
  | 'Nguyên Anh Kỳ';

export interface WorkerWageDetails {
  base: number;
  hazardBonus: number; // Nặng nhọc, độc hại, nhiệt độ cao
  realmBonus: number;  // Phụ cấp cảnh giới tu vi
  skillBonus: number;  // Phụ cấp tay nghề & kinh nghiệm
  total: number;
}

export interface Worker {
  id: string;
  name: string;
  profession: ProfessionId;
  realm: CultivationRealm;
  realmLevel: number; // 1 to 7
  stamina: number;
  maxStamina: number;
  efficiency: number; // 1.0 = 100%
  wageDetails: WorkerWageDetails;
  experience: number;
  nextLevelExp: number;
  hasTalent: boolean; // ~5% rare
  talent?: {
    name: string;
    description: string;
    effectType: 'speed' | 'quality_boost' | 'material_save' | 'wage_discount' | 'double_yield';
    value: number;
  };
  specialStat?: {
    name: string;
    value: string;
    description: string;
  };
  assignedFacilityId: string | null;
  status: 'working' | 'resting' | 'idle';
  avatarSeed: number;
}

export type ProductionMode = 'infinite' | 'fixed_count' | 'queue';

export interface ProductionQueueItem {
  id: string;
  recipeId: string;
  targetCount: number;
  completedCount: number;
}

export interface Workstation {
  id: string;
  name: string;
  profession: ProfessionId;
  level: number;
  maxLevel: number;
  maxWorkers: number;
  assignedWorkerIds: string[]; // Can assign multiple workers
  activeRecipeId: string | null;
  productionMode: ProductionMode;
  targetCount: number;
  completedCount: number;
  queue: ProductionQueueItem[];
  queueRepeatMode: 'none' | 'infinite' | 'count';
  queueRepeatTotal: number;
  queueRepeatCurrent: number;
  progress: number; // 0 to 100
  status: 'idle' | 'running' | 'waiting_materials' | 'completed';
  durability: number;
  fuel: number;
}

export interface HerbPlot {
  id: string;
  herbId: string | null;
  growthProgress: number; // 0 - 100
  waterLevel: number;
  quality: ItemQuality;
  isReady: boolean;
  assignedWorkerId: string | null;
}

// Market Listing item on sale by players or other cultivators
export interface MarketListing {
  id: string;
  sellerName: string;
  isPlayer: boolean;
  itemId: string;
  rank: ItemRank;
  stars: number;
  count: number;
  unitPrice: number;
  originalPrice: number;
  listedAt: number;
  demandScore: number; // 1 to 100
  status: 'active' | 'sold';
}

// Customer / Client system
export interface DirectCustomerOrder {
  id: string;
  title: string;
  itemId: string;
  minRank: ItemRank;
  minStars: number;
  count: number;
  rewardLinhThach: number;
  rewardAffinity: number;
  deadlineSeconds: number;
  status: 'active' | 'completed' | 'expired';
}

export interface CultivatorClient {
  id: string;
  name: string;
  avatar: string;
  sect: string;
  realm: string;
  affinity: number; // 0 to 100
  isFriend: boolean;
  totalPurchasedCount: number;
  totalSpentLinhThach: number;
  lastPurchaseDate: string;
  activeOrder?: DirectCustomerOrder;
}

export interface GameState {
  hasChosenProfession: boolean;
  playerProfession: ProfessionId;
  playerName: string;
  sectEnterpriseName: string;
  linhThach: number;
  reputation: number;
  
  // Real-time wage timeline (1h30p = 5400s)
  wageCycleSeconds: number; // 5400
  wageElapsedSeconds: number; // 0 to 5400
  wageDue: boolean;
  lastWagePaidTimestamp: number;

  soundEnabled: boolean;

  // Inventory: raw materials vs crafted products with quality
  rawMaterials: Record<string, number>; // itemId -> count
  craftedProducts: ProducedProduct[];   // Array of products with ranks and stars

  recipes: Recipe[];
  workers: Worker[];
  workstations: Workstation[];
  herbPlots: HerbPlot[];
  marketItems: Record<string, ResourceItem>;

  // Market listings
  marketListings: MarketListing[];

  // Cultivator clients & friends
  clients: CultivatorClient[];

  logs: { id: string; time: string; text: string; type: 'info' | 'success' | 'warn' | 'market' }[];
  stats: {
    totalCrafted: number;
    totalEarned: number;
    totalSold: number;
    wagesPaidTotal: number;
  };
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  flavor: string;
  type: string;
  effectText: string;
  impactFnKey: string;
}

export interface SectOrder {
  id: string;
  sectName: string;
  sectBadge: string;
  title: string;
  requestedItem: { itemId: string; count: number };
  rewardLinhThach: number;
  rewardReputation: number;
  timeRemainingSeconds: number;
  totalTimeSeconds: number;
  status: string;
}

export interface TechUpgrade {
  id: string;
  name: string;
  profession: string;
  description: string;
  costLinhThach: number;
  costReputation: number;
  unlocked: boolean;
  icon: string;
  effect: { type: string; value: number };
}
