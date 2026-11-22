import { 
  ProfessionId, 
  ItemRank, 
  ResourceItem, 
  Recipe, 
  Worker, 
  Workstation, 
  HerbPlot, 
  MarketListing, 
  CultivatorClient,
  WorkerWageDetails
} from '../types/game';

export interface ProfessionMeta {
  id: ProfessionId;
  name: string;
  workerTitle: string;
  facilityTitle: string;
  tagline: string;
  description: string;
  accentColor: string;
  hazardType: string;
  startingLinhThach: number;
  initialMaterials: Record<string, number>;
  primaryProduced: string;
  primaryConsumed: string;
  perks: string[];
  pixelArtSymbol: string;
}

export const RANK_NAMES: Record<ItemRank, string> = {
  pham_cap: 'Phàm Cấp',
  huyen_cap: 'Huyền Cấp',
  hoang_cap: 'Hoàng Cấp',
  dia_cap: 'Địa Cấp',
  thien_cap: 'Thiên Cấp'
};

export const RANK_COLORS: Record<ItemRank, { text: string; bg: string; border: string; glow: string }> = {
  pham_cap: { text: 'text-slate-300', bg: 'bg-slate-800', border: 'border-slate-600', glow: 'rgba(148, 163, 184, 0.2)' },
  huyen_cap: { text: 'text-emerald-300', bg: 'bg-emerald-950/80', border: 'border-emerald-500', glow: 'rgba(16, 185, 129, 0.4)' },
  hoang_cap: { text: 'text-cyan-300', bg: 'bg-cyan-950/80', border: 'border-cyan-500', glow: 'rgba(6, 182, 212, 0.4)' },
  dia_cap: { text: 'text-purple-300', bg: 'bg-purple-950/80', border: 'border-purple-500', glow: 'rgba(168, 85, 247, 0.4)' },
  thien_cap: { text: 'text-amber-300', bg: 'bg-amber-950/80', border: 'border-amber-400', glow: 'rgba(245, 158, 11, 0.6)' },
};

export const PROFESSIONS_DATA: Record<ProfessionId, ProfessionMeta> = {
  luyen_khi: {
    id: 'luyen_khi',
    name: 'Luyện Khí Sư',
    workerTitle: 'Luyện Khí Sư',
    facilityTitle: 'Lò Luyện Khí',
    tagline: 'Rèn đúc thần binh, chấn hưng tiên giới',
    description: 'Chuyên chế tạo các loại binh khí, vũ khí, phi kiếm, thuẫn giáp từ quặng khoáng sản. Cần kiểm soát hỏa nhiệt Tam Muội và tay nghề tôi luyện.',
    accentColor: '#f97316',
    hazardType: 'Nhiệt độ cao & Bụi kim loại',
    startingLinhThach: 1500,
    initialMaterials: {
      quang_thiet: 60,
      quang_dong: 30,
      nhien_lieu_than: 40,
    },
    primaryProduced: 'Kiếm, Cung, Khiên, Phi Kiếm',
    primaryConsumed: 'Khoáng mỏ (Thiết, Đồng, Huyền Thiết), Than',
    perks: ['Tăng hiệu suất rèn đúc', 'Tỉ lệ rèn ra phẩm chất cao', 'Đơn hàng khách quen phong phú'],
    pixelArtSymbol: '⚔️'
  },
  luyen_dan: {
    id: 'luyen_dan',
    name: 'Luyện Đan Sư',
    workerTitle: 'Luyện Đan Sư',
    facilityTitle: 'Đan Lô Thần Đỉnh',
    tagline: 'Luyện thần đan diệu dược, nghịch thiên cải mệnh',
    description: 'Chuyên tinh luyện linh thảo dược liệu thành các loại tiên đan hỗ trợ tu vi, hồi phục và đột phá. Cần kiểm soát hỏa hầu và ngưng kết đan văn.',
    accentColor: '#10b981',
    hazardType: 'Khói độc dược tính & Nhiệt áp',
    startingLinhThach: 1500,
    initialMaterials: {
      duoc_ngung_huyet: 50,
      duoc_hoang_tinh: 30,
      linh_tuyen_thuy: 40,
    },
    primaryProduced: 'Khí Huyết Đan, Bổ Khí Đan, Trúc Cơ Đan',
    primaryConsumed: 'Dược điền (Linh Chi, Cửu Diệp Thảo), Linh Tuyền',
    perks: ['Nhu cầu thị trường cực cao', 'Đan văn cực phẩm giá trị lớn', 'Giảm tiêu hao linh dược'],
    pixelArtSymbol: '🧪'
  },
  khai_khoang: {
    id: 'khai_khoang',
    name: 'Khai Khoáng (Khoáng Công)',
    workerTitle: 'Khoáng Công',
    facilityTitle: 'Hầm Mỏ Linh Mạch',
    tagline: 'Đào sâu lòng đất, khai thác vạn lượng linh quặng',
    description: 'Chỉ huy đội ngũ khoáng công khai thác các mạch khoáng sản quý hiếm từ lòng đất, vận hành hầm mỏ và đường ray xe goòng.',
    accentColor: '#06b6d4',
    hazardType: 'Hầm sâu sập lún & Khí ngột ngạt',
    startingLinhThach: 1300,
    initialMaterials: {
      quang_thiet: 100,
      quang_dong: 60,
      nhien_lieu_than: 50,
      quang_huyen_thiet: 15,
    },
    primaryProduced: 'Thiết Quặng, Tử Đồng, Huyền Thiết, Hàn Tinh',
    primaryConsumed: 'Than đá, Cuốc linh lực, Xe goòng',
    perks: ['Sản lượng khai khoáng lớn', 'Cung cấp cho toàn bộ xưởng Luyện Khí', 'Cơ hội đào trúng quặng hiếm'],
    pixelArtSymbol: '⛏️'
  },
  duoc_dien: {
    id: 'duoc_dien',
    name: 'Dược Điền (Dược Công)',
    workerTitle: 'Dược Công',
    facilityTitle: 'Ruộng Bậc Thang Thần Nông',
    tagline: 'Gieo trồng tiên thảo, ươm mầm sinh cơ bát ngát',
    description: 'Quản lý cánh đồng linh dược, điều phối dược công gieo hạt, tưới nước linh tuyền, thu hoạch thảo dược cung cấp cho xưởng Luyện Đan.',
    accentColor: '#84cc16',
    hazardType: 'Lao động ngoài trời & Sương hàn',
    startingLinhThach: 1300,
    initialMaterials: {
      duoc_ngung_huyet: 80,
      duoc_hoang_tinh: 50,
      linh_tuyen_thuy: 60,
      duoc_linh_chi: 10,
    },
    primaryProduced: 'Ngưng Huyết Thảo, Hoàng Tinh, Cửu Diệp, Linh Chi',
    primaryConsumed: 'Hạt giống, Nước linh tuyền, Đất thần nông',
    perks: ['Sản lượng thảo dược dồi dào', 'Cung ứng nguồn dược cho Luyện Đan Sư', 'Thảo mộc thanh khiết phẩm chất cao'],
    pixelArtSymbol: '🌿'
  },
  luyen_bao: {
    id: 'luyen_bao',
    name: 'Luyện Bảo Sư',
    workerTitle: 'Luyện Bảo Sư',
    facilityTitle: 'Lò Luyện Bảo Trận Đài',
    tagline: 'Chế tạo thần phù, cấm chế nạp giới vi diệu',
    description: 'Chuyên chế tác các bảo vật bổ trợ tu sĩ như Túi Trữ Vật, Trữ Vật Giới Chỉ, Hộ Tâm Kính và Định Hồn Ngọc.',
    accentColor: '#a855f7',
    hazardType: 'Nén không gian & Tiêu hao thần thức',
    startingLinhThach: 1600,
    initialMaterials: {
      quang_huyen_thiet: 20,
      ngoc_han_tinh: 15,
      to_linh_tam: 30,
      quang_dong: 20,
    },
    primaryProduced: 'Túi Trữ Vật, Trữ Vật Giới Chỉ, Hộ Tâm Kính',
    primaryConsumed: 'Tơ linh tằm, Huyền Thiết, Hàn Tinh',
    perks: ['Giá trị bảo vật cao nhất thị trường', 'Được các tu sĩ đại năng săn đón', 'Cấm chế gia tăng độ bền'],
    pixelArtSymbol: '💍'
  }
};

export const INITIAL_ITEMS: Record<string, ResourceItem> = {
  // Khoáng sản (Mining products)
  quang_thiet: {
    id: 'quang_thiet',
    name: 'Thiết Quặng',
    category: 'khoang_san',
    description: 'Quặng sắt thô chứa hàm lượng linh khí nhẹ, nguyên liệu cơ bản cho Luyện Khí.',
    basePrice: 15,
    currentPrice: 15,
    priceTrend: 'stable',
    icon: 'iron_ore',
    professionSource: 'khai_khoang',
    color: '#94a3b8'
  },
  quang_dong: {
    id: 'quang_dong',
    name: 'Tử Đồng Quặng',
    category: 'khoang_san',
    description: 'Quặng đồng ánh tím dẻo dai, dẫn truyền linh lực cực tốt.',
    basePrice: 25,
    currentPrice: 25,
    priceTrend: 'stable',
    icon: 'copper_ore',
    professionSource: 'khai_khoang',
    color: '#ea580c'
  },
  quang_huyen_thiet: {
    id: 'quang_huyen_thiet',
    name: 'Huyền Thiết Tinh',
    category: 'khoang_san',
    description: 'Sắt đen nghìn năm hấp thụ hàn khí ngầm, cực kỳ rắn rỏi để rèn thần binh và bảo vật.',
    basePrice: 65,
    currentPrice: 65,
    priceTrend: 'up',
    icon: 'dark_steel',
    professionSource: 'khai_khoang',
    color: '#475569'
  },
  ngoc_han_tinh: {
    id: 'ngoc_han_tinh',
    name: 'Hàn Băng Tinh',
    category: 'khoang_san',
    description: 'Pha lê kết tinh từ băng tuyết vạn năm, tỏa hàn khí thấu xương.',
    basePrice: 110,
    currentPrice: 110,
    priceTrend: 'stable',
    icon: 'ice_crystal',
    professionSource: 'khai_khoang',
    color: '#38bdf8'
  },
  nhien_lieu_than: {
    id: 'nhien_lieu_than',
    name: 'Hắc Thạch Than',
    category: 'nhien_lieu',
    description: 'Than đá âm u cháy bền bỉ, cung cấp nhiệt năng ổn định cho lò lửa.',
    basePrice: 10,
    currentPrice: 10,
    priceTrend: 'stable',
    icon: 'coal',
    color: '#334155'
  },

  // Dược liệu (Herb farming products)
  duoc_ngung_huyet: {
    id: 'duoc_ngung_huyet',
    name: 'Ngưng Huyết Thảo',
    category: 'duoc_lieu',
    description: 'Lá cây đỏ như máu, có tác dụng sinh huyết trị thương thần tốc.',
    basePrice: 18,
    currentPrice: 18,
    priceTrend: 'stable',
    icon: 'blood_grass',
    professionSource: 'duoc_dien',
    color: '#ef4444'
  },
  duoc_hoang_tinh: {
    id: 'duoc_hoang_tinh',
    name: 'Hoàng Tinh Thảo',
    category: 'duoc_lieu',
    description: 'Rễ củ màu vàng óng chứa đại lượng thổ linh khí, bồi bổ đan điền.',
    basePrice: 28,
    currentPrice: 28,
    priceTrend: 'stable',
    icon: 'yellow_essence',
    professionSource: 'duoc_dien',
    color: '#eab308'
  },
  duoc_cuu_diep: {
    id: 'duoc_cuu_diep',
    name: 'Cửu Diệp Thảo',
    category: 'duoc_lieu',
    description: 'Cỏ chín lá lấp lánh đom đóm, vị thuốc dẫn truyền kinh mạch quý hiếm.',
    basePrice: 60,
    currentPrice: 60,
    priceTrend: 'up',
    icon: 'nine_leaf',
    professionSource: 'duoc_dien',
    color: '#22c55e'
  },
  duoc_linh_chi: {
    id: 'duoc_linh_chi',
    name: 'Xích Huyết Linh Chi',
    category: 'duoc_lieu',
    description: 'Nấm linh chi đỏ mọc trên vách đá nghìn năm, dược lực dồi dào đột phá cảnh giới.',
    basePrice: 120,
    currentPrice: 120,
    priceTrend: 'stable',
    icon: 'lingzhi',
    professionSource: 'duoc_dien',
    color: '#b91c1c'
  },
  linh_tuyen_thuy: {
    id: 'linh_tuyen_thuy',
    name: 'Linh Tuyền Thủy',
    category: 'nhien_lieu',
    description: 'Nước suối nguồn linh khí thuần khiết dùng tưới linh điền và dung môi luyện đan.',
    basePrice: 8,
    currentPrice: 8,
    priceTrend: 'stable',
    icon: 'spirit_water',
    color: '#0ea5e9'
  },
  to_linh_tam: {
    id: 'to_linh_tam',
    name: 'Tơ Linh Tằm',
    category: 'nhien_lieu',
    description: 'Tơ tằm hấp thu ánh trăng dẻo dai, dùng may túi trữ vật và đệm cấm chế.',
    basePrice: 40,
    currentPrice: 40,
    priceTrend: 'stable',
    icon: 'spirit_silk',
    color: '#e2e8f0'
  },

  // Khí cụ (Weapons/Equipment - Luyện Khí)
  kiem_thiet: {
    id: 'kiem_thiet',
    name: 'Bách Luyện Thiết Kiếm',
    category: 'khi_cu',
    description: 'Thanh kiếm sắt tôi luyện trăm lần lửa, sắc bén chém sắt như bùn.',
    basePrice: 95,
    currentPrice: 95,
    priceTrend: 'stable',
    icon: 'iron_sword',
    professionSource: 'luyen_khi',
    color: '#60a5fa',
    isCraftableProduct: true
  },
  cung_dong: {
    id: 'cung_dong',
    name: 'Tử Đồng Linh Cung',
    category: 'khi_cu',
    description: 'Cung bắn tên linh lực với cánh cung đúc từ quặng đồng tím dẻo dai.',
    basePrice: 140,
    currentPrice: 140,
    priceTrend: 'stable',
    icon: 'bronze_bow',
    professionSource: 'luyen_khi',
    color: '#fb923c',
    isCraftableProduct: true
  },
  thuan_huyen_thiet: {
    id: 'thuan_huyen_thiet',
    name: 'Huyền Thiết Khiên',
    category: 'khi_cu',
    description: 'Khiên phòng ngự kiên cố đúc từ Huyền Thiết, chống đỡ đòn đánh mãnh liệt.',
    basePrice: 280,
    currentPrice: 280,
    priceTrend: 'up',
    icon: 'black_shield',
    professionSource: 'luyen_khi',
    color: '#64748b',
    isCraftableProduct: true
  },
  phi_kiem_tram_yeu: {
    id: 'phi_kiem_tram_yeu',
    name: 'Trảm Yêu Phi Kiếm',
    category: 'khi_cu',
    description: 'Thượng phẩm phi kiếm ngự phong ngút ngàn, uy lực chấn nhiếp yêu ma.',
    basePrice: 520,
    currentPrice: 520,
    priceTrend: 'up',
    icon: 'flying_sword',
    professionSource: 'luyen_khi',
    color: '#38bdf8',
    isCraftableProduct: true
  },

  // Đan dược (Pills - Luyện Đan)
  dan_khi_huyet: {
    id: 'dan_khi_huyet',
    name: 'Ngưng Huyết Đan',
    category: 'dan_duoc',
    description: 'Đan dược cấp tốc chỉ huyết, chữa lành ngoại thương cho tu sĩ.',
    basePrice: 85,
    currentPrice: 85,
    priceTrend: 'stable',
    icon: 'blood_pill',
    professionSource: 'luyen_dan',
    color: '#f87171',
    isCraftableProduct: true
  },
  dan_bo_khi: {
    id: 'dan_bo_khi',
    name: 'Bổ Khí Dưỡng Thần Đan',
    category: 'dan_duoc',
    description: 'Hồi phục linh lực cạn kiệt, giữ tinh thần tỉnh táo khi ngự kiếm.',
    basePrice: 125,
    currentPrice: 125,
    priceTrend: 'stable',
    icon: 'qi_pill',
    professionSource: 'luyen_dan',
    color: '#fbbf24',
    isCraftableProduct: true
  },
  dan_truc_co: {
    id: 'dan_truc_co',
    name: 'Trúc Cơ Cố Bản Đan',
    category: 'dan_duoc',
    description: 'Thần đan giúp tu sĩ Luyện Khí Kỳ đại viên mãn đột phá lên Trúc Cơ Kỳ.',
    basePrice: 480,
    currentPrice: 480,
    priceTrend: 'up',
    icon: 'foundation_pill',
    professionSource: 'luyen_dan',
    color: '#34d399',
    isCraftableProduct: true
  },
  dan_tay_tuy: {
    id: 'dan_tay_tuy',
    name: 'Tẩy Tủy Hoán Cốt Đan',
    category: 'dan_duoc',
    description: 'Tẩy trừ tạp chất kinh mạch, tái tạo linh căn, cực phẩm nan cầu.',
    basePrice: 820,
    currentPrice: 820,
    priceTrend: 'up',
    icon: 'purify_pill',
    professionSource: 'luyen_dan',
    color: '#c084fc',
    isCraftableProduct: true
  },

  // Trang sức / Bảo vật (Luyện Bảo)
  bao_tui_tru_vat: {
    id: 'bao_tui_tru_vat',
    name: 'Túi Trữ Vật Sơ Cấp',
    category: 'trang_suc',
    description: 'Túi gấm chứa cấm chế không gian 3x3 thước, vật bất ly thân của tu sĩ.',
    basePrice: 190,
    currentPrice: 190,
    priceTrend: 'stable',
    icon: 'storage_pouch',
    professionSource: 'luyen_bao',
    color: '#a855f7',
    isCraftableProduct: true
  },
  bao_gioi_chi: {
    id: 'bao_gioi_chi',
    name: 'Trữ Vật Giới Chỉ',
    category: 'trang_suc',
    description: 'Nhẫn bạc khắc trận pháp Tu Di, không gian rộng rãi chứa được cả linh dược.',
    basePrice: 390,
    currentPrice: 390,
    priceTrend: 'up',
    icon: 'storage_ring',
    professionSource: 'luyen_bao',
    color: '#818cf8',
    isCraftableProduct: true
  },
  bao_ho_tam_kinh: {
    id: 'bao_ho_tam_kinh',
    name: 'Hộ Tâm Kính',
    category: 'trang_suc',
    description: 'Gương hộ tâm treo trước ngực hóa giải đòn trí mạng từ thần thức.',
    basePrice: 580,
    currentPrice: 580,
    priceTrend: 'stable',
    icon: 'heart_mirror',
    professionSource: 'luyen_bao',
    color: '#38bdf8',
    isCraftableProduct: true
  },
  bao_dinh_hon_ngoc: {
    id: 'bao_dinh_hon_ngoc',
    name: 'Định Hồn Ngọc Bội',
    category: 'trang_suc',
    description: 'Bảo ngọc tỏa thanh quang xua tan tâm ma, hộ vệ linh hồn khi độ kiếp.',
    basePrice: 890,
    currentPrice: 890,
    priceTrend: 'up',
    icon: 'soul_jade',
    professionSource: 'luyen_bao',
    color: '#2dd4bf',
    isCraftableProduct: true
  }
};

export const INITIAL_RECIPES: Recipe[] = [
  // Luyện Khí
  {
    id: 'rec_kiem_thiet',
    name: 'Rèn Bách Luyện Thiết Kiếm',
    profession: 'luyen_khi',
    description: 'Nung chảy 3 quặng thiết cùng 1 than, đập rèn tạo hình sắc bén.',
    ingredients: [
      { itemId: 'quang_thiet', count: 3 },
      { itemId: 'nhien_lieu_than', count: 1 }
    ],
    resultItemId: 'kiem_thiet',
    resultCount: 1,
    craftTimeSeconds: 4,
    minMasteryLevel: 1,
    expReward: 15,
    unlocked: true,
    baseRank: 'pham_cap'
  },
  {
    id: 'rec_cung_dong',
    name: 'Đúc Tử Đồng Linh Cung',
    profession: 'luyen_khi',
    description: 'Kết hợp 3 tử đồng cùng 1 thiết quặng, tôi mềm tạo độ đàn hồi.',
    ingredients: [
      { itemId: 'quang_dong', count: 3 },
      { itemId: 'quang_thiet', count: 1 },
      { itemId: 'nhien_lieu_than', count: 2 }
    ],
    resultItemId: 'cung_dong',
    resultCount: 1,
    craftTimeSeconds: 6,
    minMasteryLevel: 2,
    expReward: 25,
    unlocked: true,
    baseRank: 'pham_cap'
  },
  {
    id: 'rec_thuan_huyen_thiet',
    name: 'Đúc Huyền Thiết Khiên',
    profession: 'luyen_khi',
    description: 'Dùng Huyền Thiết Tinh tôi luyện thành khiên bát quái kiên cố.',
    ingredients: [
      { itemId: 'quang_huyen_thiet', count: 2 },
      { itemId: 'quang_dong', count: 2 },
      { itemId: 'nhien_lieu_than', count: 3 }
    ],
    resultItemId: 'thuan_huyen_thiet',
    resultCount: 1,
    craftTimeSeconds: 9,
    minMasteryLevel: 3,
    expReward: 45,
    unlocked: true,
    baseRank: 'huyen_cap'
  },
  {
    id: 'rec_phi_kiem_tram_yeu',
    name: 'Luyện Trảm Yêu Phi Kiếm',
    profession: 'luyen_khi',
    description: 'Khắc ngự kiếm phù văn lên lõi Huyền Thiết và Hàn Băng Tinh.',
    ingredients: [
      { itemId: 'quang_huyen_thiet', count: 3 },
      { itemId: 'ngoc_han_tinh', count: 2 },
      { itemId: 'nhien_lieu_than', count: 4 }
    ],
    resultItemId: 'phi_kiem_tram_yeu',
    resultCount: 1,
    craftTimeSeconds: 14,
    minMasteryLevel: 4,
    expReward: 80,
    unlocked: true,
    baseRank: 'hoang_cap'
  },

  // Luyện Đan
  {
    id: 'rec_dan_khi_huyet',
    name: 'Luyện Ngưng Huyết Đan',
    profession: 'luyen_dan',
    description: 'Văn Hỏa hãm Ngưng Huyết Thảo, kết hợp nước linh tuyền thanh lọc.',
    ingredients: [
      { itemId: 'duoc_ngung_huyet', count: 3 },
      { itemId: 'linh_tuyen_thuy', count: 1 }
    ],
    resultItemId: 'dan_khi_huyet',
    resultCount: 2,
    craftTimeSeconds: 4,
    minMasteryLevel: 1,
    expReward: 15,
    unlocked: true,
    baseRank: 'pham_cap'
  },
  {
    id: 'rec_dan_bo_khi',
    name: 'Luyện Bổ Khí Dưỡng Thần Đan',
    profession: 'luyen_dan',
    description: 'Chiết xuất dưỡng chất Hoàng Tinh và Ngưng Huyết Thảo.',
    ingredients: [
      { itemId: 'duoc_hoang_tinh', count: 2 },
      { itemId: 'duoc_ngung_huyet', count: 1 },
      { itemId: 'linh_tuyen_thuy', count: 2 }
    ],
    resultItemId: 'dan_bo_khi',
    resultCount: 1,
    craftTimeSeconds: 6,
    minMasteryLevel: 2,
    expReward: 25,
    unlocked: true,
    baseRank: 'pham_cap'
  },
  {
    id: 'rec_dan_truc_co',
    name: 'Luyện Trúc Cơ Cố Bản Đan',
    profession: 'luyen_dan',
    description: 'Hòa quyện Cửu Diệp Thảo cùng Hoàng Tinh qua Vũ Hỏa ngưng đan.',
    ingredients: [
      { itemId: 'duoc_cuu_diep', count: 3 },
      { itemId: 'duoc_hoang_tinh', count: 2 },
      { itemId: 'linh_tuyen_thuy', count: 3 }
    ],
    resultItemId: 'dan_truc_co',
    resultCount: 1,
    craftTimeSeconds: 10,
    minMasteryLevel: 3,
    expReward: 50,
    unlocked: true,
    baseRank: 'huyen_cap'
  },
  {
    id: 'rec_dan_tay_tuy',
    name: 'Luyện Tẩy Tủy Hoán Cốt Đan',
    profession: 'luyen_dan',
    description: 'Nấu Xích Huyết Linh Chi nghìn năm và Cửu Diệp Thảo ngưng tụ đan văn.',
    ingredients: [
      { itemId: 'duoc_linh_chi', count: 2 },
      { itemId: 'duoc_cuu_diep', count: 2 },
      { itemId: 'linh_tuyen_thuy', count: 4 }
    ],
    resultItemId: 'dan_tay_tuy',
    resultCount: 1,
    craftTimeSeconds: 15,
    minMasteryLevel: 4,
    expReward: 90,
    unlocked: true,
    baseRank: 'hoang_cap'
  },

  // Khai Khoáng
  {
    id: 'rec_dao_thiet_dong',
    name: 'Khai Thác Thiết Quặng Tầng 1',
    profession: 'khai_khoang',
    description: 'Khai quật vỉa sắt và tử đồng bằng cuốc linh lực.',
    ingredients: [{ itemId: 'nhien_lieu_than', count: 1 }],
    resultItemId: 'quang_thiet',
    resultCount: 4,
    craftTimeSeconds: 4,
    minMasteryLevel: 1,
    expReward: 16,
    unlocked: true,
    baseRank: 'pham_cap'
  },
  {
    id: 'rec_dao_tu_dong',
    name: 'Khai Thác Mạch Tử Đồng',
    profession: 'khai_khoang',
    description: 'Khoan sâu 100 trượng khai thác thớ quặng đồng tím.',
    ingredients: [{ itemId: 'nhien_lieu_than', count: 2 }],
    resultItemId: 'quang_dong',
    resultCount: 3,
    craftTimeSeconds: 5,
    minMasteryLevel: 2,
    expReward: 26,
    unlocked: true,
    baseRank: 'pham_cap'
  },
  {
    id: 'rec_dao_huyen_thiet',
    name: 'Khai Thác Huyền Thiết Cổ Vein',
    profession: 'khai_khoang',
    description: 'Dùng mũi khoan phá vách đá chứa tinh thể Huyền Thiết.',
    ingredients: [{ itemId: 'nhien_lieu_than', count: 3 }],
    resultItemId: 'quang_huyen_thiet',
    resultCount: 2,
    craftTimeSeconds: 8,
    minMasteryLevel: 3,
    expReward: 50,
    unlocked: true,
    baseRank: 'huyen_cap'
  },
  {
    id: 'rec_dao_han_tinh',
    name: 'Khai Thác Hàn Băng Tinh',
    profession: 'khai_khoang',
    description: 'Đào sâu vào động băng vạn năm thu thập tinh thể.',
    ingredients: [{ itemId: 'nhien_lieu_than', count: 4 }],
    resultItemId: 'ngoc_han_tinh',
    resultCount: 2,
    craftTimeSeconds: 12,
    minMasteryLevel: 4,
    expReward: 80,
    unlocked: true,
    baseRank: 'hoang_cap'
  },

  // Dược Điền
  {
    id: 'rec_trong_ngung_huyet',
    name: 'Ươm Ngưng Huyết Thảo',
    profession: 'duoc_dien',
    description: 'Tưới nước linh tuyền chăm sóc thảo dược sinh huyết.',
    ingredients: [{ itemId: 'linh_tuyen_thuy', count: 1 }],
    resultItemId: 'duoc_ngung_huyet',
    resultCount: 4,
    craftTimeSeconds: 4,
    minMasteryLevel: 1,
    expReward: 15,
    unlocked: true,
    baseRank: 'pham_cap'
  },
  {
    id: 'rec_trong_hoang_tinh',
    name: 'Bồi Dưỡng Hoàng Tinh',
    profession: 'duoc_dien',
    description: 'Bón phân linh mộc dưỡng củ hoàng tinh béo mọng.',
    ingredients: [{ itemId: 'linh_tuyen_thuy', count: 2 }],
    resultItemId: 'duoc_hoang_tinh',
    resultCount: 3,
    craftTimeSeconds: 5,
    minMasteryLevel: 2,
    expReward: 25,
    unlocked: true,
    baseRank: 'pham_cap'
  },
  {
    id: 'rec_trong_cuu_diep',
    name: 'Nuôi Dưỡng Cửu Diệp Thảo',
    profession: 'duoc_dien',
    description: 'Hấp thu tinh hoa nguyệt sắc nuôi chín phiến lá.',
    ingredients: [{ itemId: 'linh_tuyen_thuy', count: 3 }],
    resultItemId: 'duoc_cuu_diep',
    resultCount: 2,
    craftTimeSeconds: 8,
    minMasteryLevel: 3,
    expReward: 48,
    unlocked: true,
    baseRank: 'huyen_cap'
  },
  {
    id: 'rec_trong_linh_chi',
    name: 'Cấy Ghép Xích Huyết Linh Chi',
    profession: 'duoc_dien',
    description: 'Cấy phôi nấm đỏ ngàn năm duy trì sinh khí dồi dào.',
    ingredients: [{ itemId: 'linh_tuyen_thuy', count: 4 }],
    resultItemId: 'duoc_linh_chi',
    resultCount: 2,
    craftTimeSeconds: 12,
    minMasteryLevel: 4,
    expReward: 80,
    unlocked: true,
    baseRank: 'hoang_cap'
  },

  // Luyện Bảo
  {
    id: 'rec_bao_tui_tru_vat',
    name: 'Dệt Túi Trữ Vật Không Gian',
    profession: 'luyen_bao',
    description: 'Dệt tơ linh tằm và đồng tím tạo miệng túi cấm chế nạp giới.',
    ingredients: [
      { itemId: 'to_linh_tam', count: 2 },
      { itemId: 'quang_dong', count: 1 }
    ],
    resultItemId: 'bao_tui_tru_vat',
    resultCount: 1,
    craftTimeSeconds: 5,
    minMasteryLevel: 1,
    expReward: 25,
    unlocked: true,
    baseRank: 'pham_cap'
  },
  {
    id: 'rec_bao_gioi_chi',
    name: 'Đúc Trữ Vật Giới Chỉ',
    profession: 'luyen_bao',
    description: 'Khắc trận pháp Tu Di lên vòng nhẫn Huyền Thiết.',
    ingredients: [
      { itemId: 'quang_huyen_thiet', count: 2 },
      { itemId: 'to_linh_tam', count: 2 }
    ],
    resultItemId: 'bao_gioi_chi',
    resultCount: 1,
    craftTimeSeconds: 8,
    minMasteryLevel: 2,
    expReward: 45,
    unlocked: true,
    baseRank: 'huyen_cap'
  },
  {
    id: 'rec_bao_ho_tam_kinh',
    name: 'Chế Tác Hộ Tâm Kính',
    profession: 'luyen_bao',
    description: 'Tráng lớp tinh thể Băng Tuyết lên mặt gương Huyền Thiết bảo vệ tâm mạch.',
    ingredients: [
      { itemId: 'ngoc_han_tinh', count: 2 },
      { itemId: 'quang_huyen_thiet', count: 2 }
    ],
    resultItemId: 'bao_ho_tam_kinh',
    resultCount: 1,
    craftTimeSeconds: 11,
    minMasteryLevel: 3,
    expReward: 70,
    unlocked: true,
    baseRank: 'hoang_cap'
  },
  {
    id: 'rec_bao_dinh_hon_ngoc',
    name: 'Điêu Khắc Định Hồn Ngọc',
    profession: 'luyen_bao',
    description: 'Khắc trận đồ trừ ma tĩnh tâm lên ngọc băng hộ mệnh.',
    ingredients: [
      { itemId: 'ngoc_han_tinh', count: 3 },
      { itemId: 'to_linh_tam', count: 3 }
    ],
    resultItemId: 'bao_dinh_hon_ngoc',
    resultCount: 1,
    craftTimeSeconds: 15,
    minMasteryLevel: 4,
    expReward: 95,
    unlocked: true,
    baseRank: 'dia_cap'
  }
];

export const RARE_TALENTS = [
  {
    name: 'Hỏa Linh Tiên Căn',
    description: 'Rút ngắn 30% thời gian nung đúc, ngọn lửa thuần khiết tuyệt đối',
    effectType: 'speed' as const,
    value: 0.3
  },
  {
    name: 'Đoán Cốt Thần Thủ',
    description: 'Tăng 2 sao phẩm chất (+2★) cho mọi sản phẩm chế tạo',
    effectType: 'quality_boost' as const,
    value: 2
  },
  {
    name: 'Tiết Kiệm Tinh Thuật',
    description: 'Có 35% xác suất không tiêu hao nguyên liệu phụ trợ',
    effectType: 'material_save' as const,
    value: 0.35
  },
  {
    name: 'Thiên Địa Khí Cảm',
    description: 'Có 20% xác suất sản xuất ra gấp đôi sản phẩm (x2 yield)',
    effectType: 'double_yield' as const,
    value: 0.2
  }
];

export function computeWorkerWage(realmLevel: number, hazardLevel: number, skillLevel: number): WorkerWageDetails {
  const base = 25;
  const hazardBonus = hazardLevel * 15; // Nặng nhọc, độc hại
  const realmBonus = realmLevel * 20;   // Tu vi
  const skillBonus = skillLevel * 10;   // Kinh nghiệm tay nghề
  const total = base + hazardBonus + realmBonus + skillBonus;
  return { base, hazardBonus, realmBonus, skillBonus, total };
}

export function createInitialWorkers(profession: ProfessionId): Worker[] {
  const names = {
    luyen_khi: ['Lý Thiết Búa', 'Hỏa Vân Tử', 'Luyện Châm Nương'],
    luyen_dan: ['Dược Lão', 'Thanh Linh Tiên Tử', 'Đan Tâm Đạo Nhân'],
    khai_khoang: ['Ngưu Đại Lực', 'Khoan Sơn Lão Hán', 'Thiết Đầu Thất'],
    duoc_dien: ['Thần Nông Thị', 'Lục Thảo Cô Nương', 'Mộc Diệp Đạo Đồng'],
    luyen_bao: ['Cấm Chế Sư Vô Nhai', 'Diệu Thủ Không Không', 'Ngọc Tâm Chân Nhân']
  };

  const list = names[profession] || names['luyen_khi'];
  const hazard = 2; // Medium-high hazard

  return [
    {
      id: `w_${profession}_1`,
      name: list[0],
      profession,
      realm: 'Luyện Khí Kỳ (Tầng 4-6)',
      realmLevel: 2,
      stamina: 100,
      maxStamina: 100,
      efficiency: 1.2,
      wageDetails: computeWorkerWage(2, hazard, 2),
      experience: 30,
      nextLevelExp: 100,
      hasTalent: true,
      talent: RARE_TALENTS[0],
      specialStat: { name: 'Thần Niệm', value: '42 Điểm', description: 'Tăng tốc độ kiểm soát ngọn lửa' },
      assignedFacilityId: `ws_${profession}_1`,
      status: 'working',
      avatarSeed: 1
    },
    {
      id: `w_${profession}_2`,
      name: list[1],
      profession,
      realm: 'Luyện Khí Kỳ (Tầng 1-3)',
      realmLevel: 1,
      stamina: 100,
      maxStamina: 100,
      efficiency: 1.0,
      wageDetails: computeWorkerWage(1, hazard, 1),
      experience: 10,
      nextLevelExp: 60,
      hasTalent: false,
      specialStat: { name: 'Cơ Bắp', value: '35 Điểm', description: 'Bền bỉ khi làm việc liên tục' },
      assignedFacilityId: null,
      status: 'idle',
      avatarSeed: 2
    }
  ];
}

export function createInitialWorkstations(profession: ProfessionId): Workstation[] {
  const titles = {
    luyen_khi: ['Lò Luyện Khí Bát Quái #1', 'Bàn Rèn Huyền Kim #2', 'Bể Tôi Linh Thủy #3'],
    luyen_dan: ['Đan Lô Tử Hà #1', 'Đỉnh Nấu Linh Thảo #2', 'Buồng Ngưng Đan Chân Không #3'],
    khai_khoang: ['Giếng Mỏ Tầng Nông #1', 'Dàn Đào Thạch Nhũ #2', 'Đường Ray Xe Goòng #3'],
    duoc_dien: ['Ruộng Bậc Thang Tụ Linh #1', 'Luống Linh Thảo Phù Sa #2', 'Vườn Nhà Kính Thần Nông #3'],
    luyen_bao: ['Đài Luyện Bảo Thái Cực #1', 'Bàn Khắc Cấm Chế #2', 'Lò Khảm Nạm Ngọc Bảo #3']
  };

  const selectedTitles = titles[profession] || titles['luyen_khi'];

  return [
    {
      id: `ws_${profession}_1`,
      name: selectedTitles[0],
      profession,
      level: 1,
      maxLevel: 10,
      maxWorkers: 2,
      assignedWorkerIds: [`w_${profession}_1`],
      activeRecipeId: null,
      productionMode: 'infinite',
      targetCount: 0,
      completedCount: 0,
      queue: [],
      queueRepeatMode: 'none',
      queueRepeatTotal: 1,
      queueRepeatCurrent: 0,
      progress: 0,
      status: 'idle',
      durability: 100,
      fuel: 100
    },
    {
      id: `ws_${profession}_2`,
      name: selectedTitles[1],
      profession,
      level: 1,
      maxLevel: 10,
      maxWorkers: 2,
      assignedWorkerIds: [],
      activeRecipeId: null,
      productionMode: 'infinite',
      targetCount: 0,
      completedCount: 0,
      queue: [],
      queueRepeatMode: 'none',
      queueRepeatTotal: 1,
      queueRepeatCurrent: 0,
      progress: 0,
      status: 'idle',
      durability: 100,
      fuel: 100
    }
  ];
}

export function createInitialHerbPlots(): HerbPlot[] {
  return [
    { id: 'plot_1', herbId: 'duoc_ngung_huyet', growthProgress: 45, waterLevel: 80, quality: { rank: 'pham_cap', stars: 3 }, isReady: false, assignedWorkerId: null },
    { id: 'plot_2', herbId: 'duoc_hoang_tinh', growthProgress: 20, waterLevel: 75, quality: { rank: 'pham_cap', stars: 2 }, isReady: false, assignedWorkerId: null },
    { id: 'plot_3', herbId: null, growthProgress: 0, waterLevel: 60, quality: { rank: 'pham_cap', stars: 1 }, isReady: false, assignedWorkerId: null },
    { id: 'plot_4', herbId: null, growthProgress: 0, waterLevel: 50, quality: { rank: 'pham_cap', stars: 1 }, isReady: false, assignedWorkerId: null }
  ];
}

// Initial active listings on the market (listed by other cultivators or merchants)
export function createInitialMarketListings(): MarketListing[] {
  return [
    {
      id: 'lst_npc_1',
      sellerName: 'Vương Đại Thương',
      isPlayer: false,
      itemId: 'kiem_thiet',
      rank: 'pham_cap',
      stars: 4,
      count: 3,
      unitPrice: 98,
      originalPrice: 95,
      listedAt: Date.now() - 3600000,
      demandScore: 85,
      status: 'active'
    },
    {
      id: 'lst_npc_2',
      sellerName: 'Bách Thảo Đường',
      isPlayer: false,
      itemId: 'duoc_ngung_huyet',
      rank: 'pham_cap',
      stars: 3,
      count: 20,
      unitPrice: 19,
      originalPrice: 18,
      listedAt: Date.now() - 7200000,
      demandScore: 92,
      status: 'active'
    },
    {
      id: 'lst_npc_3',
      sellerName: 'Thiên Cung Các',
      isPlayer: false,
      itemId: 'cung_dong',
      rank: 'huyen_cap',
      stars: 2,
      count: 2,
      unitPrice: 165,
      originalPrice: 140,
      listedAt: Date.now() - 1800000,
      demandScore: 78,
      status: 'active'
    },
    {
      id: 'lst_npc_4',
      sellerName: 'Đan Đỉnh Tông',
      isPlayer: false,
      itemId: 'dan_khi_huyet',
      rank: 'pham_cap',
      stars: 5,
      count: 8,
      unitPrice: 90,
      originalPrice: 85,
      listedAt: Date.now() - 5400000,
      demandScore: 90,
      status: 'active'
    },
    {
      id: 'lst_npc_5',
      sellerName: 'Tụ Bảo Trai',
      isPlayer: false,
      itemId: 'bao_tui_tru_vat',
      rank: 'huyen_cap',
      stars: 3,
      count: 2,
      unitPrice: 220,
      originalPrice: 190,
      listedAt: Date.now() - 900000,
      demandScore: 82,
      status: 'active'
    },
    {
      id: 'lst_npc_6',
      sellerName: 'Khoáng Sơn Minh',
      isPlayer: false,
      itemId: 'quang_thiet',
      rank: 'pham_cap',
      stars: 2,
      count: 45,
      unitPrice: 16,
      originalPrice: 15,
      listedAt: Date.now() - 400000,
      demandScore: 95,
      status: 'active'
    }
  ];
}

// Initial clients & friends who bought from market or placed direct orders
export function createInitialClients(): CultivatorClient[] {
  return [
    {
      id: 'cli_1',
      name: 'Diệp Thần',
      avatar: '🗡️',
      sect: 'Vạn Kiếm Tông',
      realm: 'Trúc Cơ Sơ Kỳ',
      affinity: 65,
      isFriend: true,
      totalPurchasedCount: 8,
      totalSpentLinhThach: 1250,
      lastPurchaseDate: 'Vừa xong',
      activeOrder: {
        id: 'ord_diep_than_1',
        title: 'Thần kiếm hộ thân trừ yêu',
        itemId: 'kiem_thiet',
        minRank: 'huyen_cap',
        minStars: 2,
        count: 3,
        rewardLinhThach: 420,
        rewardAffinity: 12,
        deadlineSeconds: 1800,
        status: 'active'
      }
    },
    {
      id: 'cli_2',
      name: 'Tô Mộng Dao',
      avatar: '🌸',
      sect: 'Thủy Nguyệt Cung',
      realm: 'Luyện Khí Viên Mãn',
      affinity: 50,
      isFriend: true,
      totalPurchasedCount: 5,
      totalSpentLinhThach: 780,
      lastPurchaseDate: 'Hôm qua',
      activeOrder: {
        id: 'ord_to_mong_dao_1',
        title: 'Đan dược bồi bổ đan điền',
        itemId: 'dan_khi_huyet',
        minRank: 'pham_cap',
        minStars: 3,
        count: 5,
        rewardLinhThach: 550,
        rewardAffinity: 15,
        deadlineSeconds: 2400,
        status: 'active'
      }
    },
    {
      id: 'cli_3',
      name: 'Hắc Sơn Trưởng Lão',
      avatar: '🛡️',
      sect: 'Kim Cương Môn',
      realm: 'Kim Đan Kỳ',
      affinity: 35,
      isFriend: false,
      totalPurchasedCount: 3,
      totalSpentLinhThach: 620,
      lastPurchaseDate: '2 ngày trước'
    }
  ];
}

// Calculate craft quality based on workstation level & workers
export function calculateCraftQuality(
  baseRank: ItemRank, 
  wsLevel: number, 
  assignedWorkers: Worker[]
): { rank: ItemRank; stars: number } {
  const ranks: ItemRank[] = ['pham_cap', 'huyen_cap', 'hoang_cap', 'dia_cap', 'thien_cap'];
  const baseIndex = ranks.indexOf(baseRank);

  // Quality score formula:
  // Workstation level contributes up to 40 points
  const levelScore = (wsLevel - 1) * 6;
  
  // Workers contribute: efficiency + realm level + exp + talent bonus
  let workerScore = 0;
  let bonusStars = 0;

  assignedWorkers.forEach(w => {
    workerScore += (w.efficiency - 1) * 30 + w.realmLevel * 8;
    if (w.talent?.effectType === 'quality_boost') {
      bonusStars += w.talent.value;
    }
  });

  const totalScore = levelScore + workerScore + Math.floor(Math.random() * 25);

  let rankOffset = 0;
  if (totalScore >= 75) rankOffset = 2;
  else if (totalScore >= 40) rankOffset = 1;

  const finalRankIndex = Math.min(ranks.length - 1, baseIndex + rankOffset);
  const finalRank = ranks[finalRankIndex];

  // Stars: 1 to 9
  const baseStars = 1 + Math.floor((totalScore % 40) / 5);
  const finalStars = Math.min(9, Math.max(1, baseStars + bonusStars));

  return { rank: finalRank, stars: finalStars };
}
