import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  GameState, 
  ProfessionId, 
  Worker, 
  Workstation, 
  Recipe, 
  ProducedProduct,
  ProductionMode,
  ProductionQueueItem,
  MarketListing,
  CultivatorClient
} from './types/game';
import { 
  PROFESSIONS_DATA, 
  INITIAL_ITEMS, 
  INITIAL_RECIPES, 
  createInitialWorkers, 
  createInitialWorkstations, 
  createInitialHerbPlots,
  createInitialMarketListings,
  createInitialClients,
  calculateCraftQuality,
  computeWorkerWage
} from './data/gameData';
import { sound } from './utils/audio';

// Components
import { ProfessionSelect } from './components/ProfessionSelect';
import { Header } from './components/Header';
import { WorkshopView } from './components/WorkshopView';
import { WorkersView } from './components/WorkersView';
import { MarketView } from './components/MarketView';
import { ClientsOrdersView } from './components/ClientsOrdersView';
import { StorageDrawer } from './components/StorageDrawer';
import { ListingModal } from './components/ListingModal';
import { WageModal } from './components/WageModal';

const SAVE_KEY = 'tu_tien_cong_nghiep_save_v2';
const WAGE_CYCLE_SECONDS = 90 * 60; // 1 hour 30 minutes = 5400s

export default function App() {
  const [activeTab, setActiveTab] = useState<'workshop' | 'workers' | 'market' | 'clients'>('workshop');

  // Modals state
  const [isStorageOpen, setIsStorageOpen] = useState(false);
  const [isWageModalOpen, setIsWageModalOpen] = useState(false);
  const [listingProduct, setListingProduct] = useState<ProducedProduct | null>(null);

  // Initialize Game State
  const [gameState, setGameState] = useState<GameState>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(SAVE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.hasChosenProfession) {
            return parsed;
          }
        }
      } catch (err) {
        console.warn('Failed to parse save', err);
      }
    }

    // Default initial state
    return {
      hasChosenProfession: false,
      playerProfession: 'luyen_khi',
      playerName: 'Hàn Lập',
      sectEnterpriseName: 'Vạn Kiếm Luyện Khí Các',
      linhThach: 1500,
      reputation: 25,
      wageCycleSeconds: WAGE_CYCLE_SECONDS,
      wageElapsedSeconds: 0,
      wageDue: false,
      lastWagePaidTimestamp: Date.now(),
      soundEnabled: true,
      rawMaterials: { ...PROFESSIONS_DATA.luyen_khi.initialMaterials },
      craftedProducts: [
        {
          id: 'prod_init_1',
          itemId: 'kiem_thiet',
          name: 'Bách Luyện Thiết Kiếm',
          category: 'khi_cu',
          rank: 'pham_cap',
          stars: 3,
          craftedAt: Date.now(),
          craftsmanName: 'Lý Thiết Búa'
        }
      ],
      recipes: [...INITIAL_RECIPES],
      workers: createInitialWorkers('luyen_khi'),
      workstations: createInitialWorkstations('luyen_khi'),
      herbPlots: createInitialHerbPlots(),
      marketItems: { ...INITIAL_ITEMS },
      marketListings: createInitialMarketListings(),
      clients: createInitialClients(),
      logs: [{ id: '1', time: 'Khởi đầu', text: 'Khai trương xưởng tu tiên công nghiệp!', type: 'success' }],
      stats: {
        totalCrafted: 1,
        totalEarned: 0,
        totalSold: 0,
        wagesPaidTotal: 0
      }
    };
  });

  // Keep audio in sync
  useEffect(() => {
    sound.enabled = gameState.soundEnabled;
  }, [gameState.soundEnabled]);

  // Auto save
  useEffect(() => {
    if (gameState.hasChosenProfession) {
      try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
      } catch (e) {
        console.error('Save failed', e);
      }
    }
  }, [gameState]);

  // Handler: Start Career
  const handleSelectProfession = (profession: ProfessionId, playerName: string, enterpriseName: string) => {
    const profMeta = PROFESSIONS_DATA[profession];
    const newWorkers = createInitialWorkers(profession);
    const newWorkstations = createInitialWorkstations(profession);

    setGameState((prev) => ({
      ...prev,
      hasChosenProfession: true,
      playerProfession: profession,
      playerName,
      sectEnterpriseName: enterpriseName,
      linhThach: profMeta.startingLinhThach,
      rawMaterials: { ...profMeta.initialMaterials },
      craftedProducts: [],
      workers: newWorkers,
      workstations: newWorkstations,
      herbPlots: createInitialHerbPlots(),
      wageElapsedSeconds: 0,
      wageDue: false,
      logs: [{
        id: Date.now().toString(),
        time: 'Khởi đầu',
        text: `Đạo hiệu ${playerName} chính thức lập nghiệp với ngành ${profMeta.name}!`,
        type: 'success'
      }]
    }));
  };

  const handleResetGame = () => {
    if (confirm('Bạn có chắc chắn muốn khởi tạo lại sự nghiệp tu tiên?')) {
      localStorage.removeItem(SAVE_KEY);
      setGameState((prev) => ({
        ...prev,
        hasChosenProfession: false,
        playerProfession: 'luyen_khi',
        linhThach: 1500,
        rawMaterials: { ...PROFESSIONS_DATA.luyen_khi.initialMaterials },
        craftedProducts: [],
        workers: createInitialWorkers('luyen_khi'),
        workstations: createInitialWorkstations('luyen_khi'),
        wageElapsedSeconds: 0,
        wageDue: false
      }));
    }
  };

  // Workstation Actions
  const handleStartProduction = useCallback((
    stationId: string,
    recipeId: string,
    mode: ProductionMode,
    targetCount: number,
    queue: ProductionQueueItem[],
    repeatMode: 'none' | 'infinite' | 'count',
    repeatTotal: number
  ) => {
    setGameState((prev) => {
      const updatedStations = prev.workstations.map((ws) => {
        if (ws.id !== stationId) return ws;
        const initialRecipe = mode === 'queue' && queue.length > 0 ? queue[0].recipeId : recipeId;
        return {
          ...ws,
          activeRecipeId: initialRecipe,
          productionMode: mode,
          targetCount: mode === 'fixed_count' ? targetCount : 0,
          completedCount: 0,
          queue: mode === 'queue' ? [...queue] : [],
          queueRepeatMode: repeatMode,
          queueRepeatTotal: repeatTotal,
          queueRepeatCurrent: 0,
          progress: 0,
          status: 'running' as const
        };
      });

      return { ...prev, workstations: updatedStations };
    });
  }, []);

  const handleStopProduction = useCallback((stationId: string) => {
    setGameState((prev) => ({
      ...prev,
      workstations: prev.workstations.map((ws) =>
        ws.id === stationId ? { ...ws, status: 'idle' as const, progress: 0 } : ws
      )
    }));
  }, []);

  const handleAssignWorkers = useCallback((stationId: string, workerIds: string[]) => {
    setGameState((prev) => {
      // Update worker assignments
      const updatedWorkers = prev.workers.map((w) => {
        if (workerIds.includes(w.id)) {
          return { ...w, assignedFacilityId: stationId, status: 'working' as const };
        } else if (w.assignedFacilityId === stationId) {
          return { ...w, assignedFacilityId: null, status: 'idle' as const };
        }
        return w;
      });

      const updatedStations = prev.workstations.map((ws) =>
        ws.id === stationId ? { ...ws, assignedWorkerIds: workerIds } : ws
      );

      return { ...prev, workers: updatedWorkers, workstations: updatedStations };
    });
  }, []);

  const handleUpgradeStation = useCallback((stationId: string) => {
    setGameState((prev) => {
      const station = prev.workstations.find((ws) => ws.id === stationId);
      if (!station) return prev;
      const cost = station.level * 200 + 150;
      if (prev.linhThach < cost) return prev;

      sound.playBreakthrough();

      return {
        ...prev,
        linhThach: prev.linhThach - cost,
        workstations: prev.workstations.map((ws) =>
          ws.id === stationId
            ? { ...ws, level: ws.level + 1, maxWorkers: Math.min(6, ws.maxWorkers + 1) }
            : ws
        )
      };
    });
  }, []);

  const handleManualAccelerate = useCallback((stationId: string) => {
    sound.playHammer();
    setGameState((prev) => ({
      ...prev,
      workstations: prev.workstations.map((ws) =>
        ws.id === stationId && ws.status === 'running'
          ? { ...ws, progress: Math.min(100, ws.progress + 15) }
          : ws
      )
    }));
  }, []);

  // Worker Hire & Fire
  const handleHireWorker = useCallback((candidate: Worker, hireCost: number) => {
    setGameState((prev) => {
      if (prev.linhThach < hireCost) return prev;
      return {
        ...prev,
        linhThach: prev.linhThach - hireCost,
        workers: [...prev.workers, candidate]
      };
    });
  }, []);

  const handleFireWorker = useCallback((workerId: string) => {
    setGameState((prev) => ({
      ...prev,
      workers: prev.workers.filter((w) => w.id !== workerId),
      workstations: prev.workstations.map((ws) => ({
        ...ws,
        assignedWorkerIds: ws.assignedWorkerIds.filter((id) => id !== workerId)
      }))
    }));
  }, []);

  // Pay Wages
  const handlePayWages = useCallback(() => {
    setGameState((prev) => {
      const totalWage = prev.workers.reduce((s, w) => s + w.wageDetails.total, 0);
      if (prev.linhThach < totalWage) return prev;

      return {
        ...prev,
        linhThach: prev.linhThach - totalWage,
        wageElapsedSeconds: 0,
        wageDue: false,
        lastWagePaidTimestamp: Date.now(),
        stats: {
          ...prev.stats,
          wagesPaidTotal: prev.stats.wagesPaidTotal + totalWage
        }
      };
    });
  }, []);

  // Market Listing & Trades
  const handleConfirmListing = useCallback((product: ProducedProduct, count: number, unitPrice: number) => {
    setGameState((prev) => {
      // Remove product instance from warehouse
      const remainingProducts = prev.craftedProducts.filter((p) => p.id !== product.id);

      const newListing: MarketListing = {
        id: `lst_player_${Date.now()}`,
        sellerName: `${prev.playerName} (${prev.sectEnterpriseName})`,
        isPlayer: true,
        itemId: product.itemId,
        rank: product.rank,
        stars: product.stars,
        count: 1,
        unitPrice,
        originalPrice: unitPrice,
        listedAt: Date.now(),
        demandScore: 85,
        status: 'active'
      };

      return {
        ...prev,
        craftedProducts: remainingProducts,
        marketListings: [newListing, ...prev.marketListings]
      };
    });
  }, []);

  const handleBuyListing = useCallback((listingId: string, count: number) => {
    setGameState((prev) => {
      const listing = prev.marketListings.find((l) => l.id === listingId);
      if (!listing) return prev;
      const totalCost = listing.unitPrice * count;
      if (prev.linhThach < totalCost) return prev;

      const itemMeta = prev.marketItems[listing.itemId];

      // If it's a finished product, add to craftedProducts
      let updatedCrafted = [...prev.craftedProducts];
      let updatedRaw = { ...prev.rawMaterials };

      if (itemMeta?.isCraftableProduct) {
        for (let i = 0; i < count; i++) {
          updatedCrafted.push({
            id: `prod_bought_${Date.now()}_${i}`,
            itemId: listing.itemId,
            name: itemMeta.name,
            category: itemMeta.category as any,
            rank: listing.rank,
            stars: listing.stars,
            craftedAt: Date.now(),
            craftsmanName: listing.sellerName
          });
        }
      } else {
        // Raw material
        updatedRaw[listing.itemId] = (updatedRaw[listing.itemId] || 0) + count;
      }

      // Update listing count
      const updatedListings = prev.marketListings
        .map((l) => {
          if (l.id !== listingId) return l;
          const nextCount = l.count - count;
          return { ...l, count: nextCount, status: nextCount <= 0 ? ('sold' as const) : l.status };
        })
        .filter((l) => l.status === 'active');

      return {
        ...prev,
        linhThach: prev.linhThach - totalCost,
        rawMaterials: updatedRaw,
        craftedProducts: updatedCrafted,
        marketListings: updatedListings
      };
    });
  }, []);

  // Client Orders
  const handleCompleteClientOrder = useCallback((clientId: string, orderId: string, matchedProductIds: string[]) => {
    setGameState((prev) => {
      const client = prev.clients.find((c) => c.id === clientId);
      if (!client || !client.activeOrder || client.activeOrder.id !== orderId) return prev;

      const order = client.activeOrder;
      const remainingProducts = prev.craftedProducts.filter((p) => !matchedProductIds.includes(p.id));

      const updatedClients = prev.clients.map((c) => {
        if (c.id !== clientId) return c;
        return {
          ...c,
          affinity: Math.min(100, c.affinity + order.rewardAffinity),
          totalPurchasedCount: c.totalPurchasedCount + order.count,
          totalSpentLinhThach: c.totalSpentLinhThach + order.rewardLinhThach,
          lastPurchaseDate: 'Vừa xong',
          isFriend: true, // Now firmly friend
          activeOrder: undefined // Cleared
        };
      });

      return {
        ...prev,
        linhThach: prev.linhThach + order.rewardLinhThach,
        craftedProducts: remainingProducts,
        clients: updatedClients,
        stats: {
          ...prev.stats,
          totalEarned: prev.stats.totalEarned + order.rewardLinhThach,
          totalSold: prev.stats.totalSold + order.count
        }
      };
    });
  }, []);

  const handleSendGiftToClient = useCallback((clientId: string) => {
    setGameState((prev) => {
      if (prev.linhThach < 20) return prev;
      return {
        ...prev,
        linhThach: prev.linhThach - 20,
        clients: prev.clients.map((c) =>
          c.id === clientId ? { ...c, affinity: Math.min(100, c.affinity + 8), isFriend: true } : c
        )
      };
    });
  }, []);

  // --- MAIN REAL-TIME GAME LOOP (Ticks every 1000ms real-time) ---
  useEffect(() => {
    if (!gameState.hasChosenProfession) return;

    const timer = setInterval(() => {
      setGameState((prev) => {
        // 1. Advance Wage Timeline (Real-time)
        let nextWageElapsed = prev.wageElapsedSeconds + 1;
        let nextWageDue = prev.wageDue;

        if (nextWageElapsed >= prev.wageCycleSeconds) {
          nextWageDue = true;
        }

        let updatedRaw = { ...prev.rawMaterials };
        let updatedCrafted = [...prev.craftedProducts];
        let updatedStats = { ...prev.stats };

        // 2. Advance Workstations Production
        const updatedStations = prev.workstations.map((ws) => {
          if (ws.status !== 'running' || !ws.activeRecipeId) return ws;

          const recipe = prev.recipes.find((r) => r.id === ws.activeRecipeId);
          if (!recipe) return ws;

          // Check materials availability
          const hasMaterials = recipe.ingredients.every((ing) => (updatedRaw[ing.itemId] || 0) >= ing.count);
          if (!hasMaterials) {
            // Cannot craft! Worker pauses and waits
            return { ...ws, status: 'waiting_materials' as const };
          }

          // Compute production speed based on assigned workers
          const wsWorkers = prev.workers.filter((w) => ws.assignedWorkerIds.includes(w.id));
          const totalEfficiency = wsWorkers.reduce((acc, w) => acc + w.efficiency, 0) || 0.6;
          const speedFactor = (1 + (ws.level - 1) * 0.12) * totalEfficiency;

          const stepProgress = (100 / recipe.craftTimeSeconds) * speedFactor;
          const nextProgress = ws.progress + stepProgress;

          if (nextProgress >= 100) {
            // FINISHED 1 PRODUCT!
            // Deduct ingredients
            recipe.ingredients.forEach((ing) => {
              updatedRaw[ing.itemId] -= ing.count;
            });

            // Calculate item quality (Rank & Stars 1★-9★)
            const quality = calculateCraftQuality(recipe.baseRank, ws.level, wsWorkers);
            const itemMeta = prev.marketItems[recipe.resultItemId];

            const newProductInstance: ProducedProduct = {
              id: `prod_${Date.now()}_${Math.random()}`,
              itemId: recipe.resultItemId,
              name: itemMeta ? itemMeta.name : recipe.name,
              category: (itemMeta?.category as any) || 'khi_cu',
              rank: quality.rank,
              stars: quality.stars,
              craftedAt: Date.now(),
              craftsmanName: wsWorkers[0]?.name || prev.playerName
            };

            updatedCrafted.push(newProductInstance);
            updatedStats.totalCrafted += 1;

            // Workers gain EXP
            wsWorkers.forEach((w) => {
              w.experience += recipe.expReward;
            });

            // Handle Production Modes (infinite, fixed_count, queue)
            if (ws.productionMode === 'fixed_count') {
              const nextCompleted = ws.completedCount + 1;
              if (nextCompleted >= ws.targetCount) {
                return {
                  ...ws,
                  progress: 0,
                  completedCount: nextCompleted,
                  status: 'completed' as const
                };
              }
              return { ...ws, progress: 0, completedCount: nextCompleted };
            } else if (ws.productionMode === 'queue') {
              // Handle queue progression
              let newQueue = [...ws.queue];
              if (newQueue.length > 0) {
                const cur = newQueue[0];
                cur.completedCount += 1;
                if (cur.completedCount >= cur.targetCount) {
                  newQueue.shift(); // remove finished task
                }
              }

              if (newQueue.length === 0) {
                // Queue finished! Check repeat mode
                if (ws.queueRepeatMode === 'infinite') {
                  return { ...ws, progress: 0 };
                } else {
                  return { ...ws, progress: 0, status: 'completed' as const };
                }
              }

              return {
                ...ws,
                progress: 0,
                activeRecipeId: newQueue[0].recipeId,
                queue: newQueue
              };
            }

            // Infinite mode: resets progress and continues!
            return { ...ws, progress: 0 };
          }

          return { ...ws, progress: nextProgress };
        });

        // 3. Simulate Cultivator buyers purchasing player listings on the market
        let updatedListings = [...prev.marketListings];
        let nextLinhThach = prev.linhThach;
        let updatedClients = [...prev.clients];

        // Randomly attempt to buy a player listing every ~15 ticks
        if (Math.random() < 0.08) {
          const playerListings = updatedListings.filter((l) => l.isPlayer && l.status === 'active');
          if (playerListings.length > 0) {
            const boughtListing = playerListings[Math.floor(Math.random() * playerListings.length)];
            const revenue = boughtListing.unitPrice * boughtListing.count;
            nextLinhThach += revenue;
            updatedStats.totalEarned += revenue;
            updatedStats.totalSold += boughtListing.count;

            boughtListing.status = 'sold';
            sound.playCoins();

            // Chance that the buyer sends a Friend / Client request to become a Khách Quen
            const buyerNames = ['Diệp Vô Nhai', 'Tống Cẩm Ly', 'Lâm Thần', 'Lý Hàn Phi', 'Mộ Dung Tuyết'];
            const buyerSects = ['Vạn Kiếm Tông', 'Đan Đỉnh Các', 'Thái Thanh Cung', 'Thiên Tinh Các'];
            const randomBuyerName = buyerNames[Math.floor(Math.random() * buyerNames.length)];

            if (!updatedClients.some((c) => c.name === randomBuyerName)) {
              updatedClients.push({
                id: `cli_gen_${Date.now()}`,
                name: randomBuyerName,
                avatar: '🧘‍♂️',
                sect: buyerSects[Math.floor(Math.random() * buyerSects.length)],
                realm: 'Trúc Cơ Kỳ',
                affinity: 30,
                isFriend: true,
                totalPurchasedCount: boughtListing.count,
                totalSpentLinhThach: revenue,
                lastPurchaseDate: 'Vừa xong',
                activeOrder: {
                  id: `ord_direct_${Date.now()}`,
                  title: 'Đơn đặt hàng trực tiếp từ khách quen',
                  itemId: boughtListing.itemId,
                  minRank: boughtListing.rank,
                  minStars: 2,
                  count: 2,
                  rewardLinhThach: Math.round(revenue * 1.3),
                  rewardAffinity: 15,
                  deadlineSeconds: 3600,
                  status: 'active'
                }
              });
            }
          }
        }

        return {
          ...prev,
          wageElapsedSeconds: nextWageElapsed,
          wageDue: nextWageDue,
          linhThach: nextLinhThach,
          rawMaterials: updatedRaw,
          craftedProducts: updatedCrafted,
          workstations: updatedStations,
          marketListings: updatedListings.filter((l) => l.status === 'active'),
          clients: updatedClients,
          stats: updatedStats
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.hasChosenProfession]);

  // If user hasn't chosen a profession yet, show the onboarding screen
  if (!gameState.hasChosenProfession) {
    return <ProfessionSelect onSelect={handleSelectProfession} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative selection:bg-amber-500 selection:text-slate-950">
      {/* Top Header with Real-time Wage Timeline Bar */}
      <Header
        profession={gameState.playerProfession}
        enterpriseName={gameState.sectEnterpriseName}
        playerName={gameState.playerName}
        linhThach={gameState.linhThach}
        reputation={gameState.reputation}
        wageElapsedSeconds={gameState.wageElapsedSeconds}
        wageCycleSeconds={gameState.wageCycleSeconds}
        wageDue={gameState.wageDue}
        soundEnabled={gameState.soundEnabled}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenWageModal={() => setIsWageModalOpen(true)}
        onSoundToggle={() => setGameState((p) => ({ ...p, soundEnabled: !p.soundEnabled }))}
        onReset={handleResetGame}
      />

      {/* Main Tab Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {activeTab === 'workshop' && (
          <WorkshopView
            profession={gameState.playerProfession}
            workstations={gameState.workstations}
            recipes={gameState.recipes}
            workers={gameState.workers}
            rawMaterials={gameState.rawMaterials}
            craftedProducts={gameState.craftedProducts}
            marketItems={gameState.marketItems}
            linhThach={gameState.linhThach}
            onOpenStorage={() => setIsStorageOpen(true)}
            onStartProduction={handleStartProduction}
            onStopProduction={handleStopProduction}
            onAssignWorkers={handleAssignWorkers}
            onUpgradeStation={handleUpgradeStation}
            onManualAccelerate={handleManualAccelerate}
          />
        )}

        {activeTab === 'workers' && (
          <WorkersView
            workers={gameState.workers}
            workstations={gameState.workstations}
            profession={gameState.playerProfession}
            linhThach={gameState.linhThach}
            onHireWorker={handleHireWorker}
            onFireWorker={handleFireWorker}
            onOpenWageModal={() => setIsWageModalOpen(true)}
          />
        )}

        {activeTab === 'market' && (
          <MarketView
            marketItems={gameState.marketItems}
            marketListings={gameState.marketListings}
            craftedProducts={gameState.craftedProducts}
            linhThach={gameState.linhThach}
            onBuyListing={handleBuyListing}
            onBuyRawResource={(itemId, count) => {}}
            onOpenListingModalForProduct={(product) => setListingProduct(product)}
            onOpenStorage={() => setIsStorageOpen(true)}
          />
        )}

        {activeTab === 'clients' && (
          <ClientsOrdersView
            clients={gameState.clients}
            craftedProducts={gameState.craftedProducts}
            marketItems={gameState.marketItems}
            onCompleteClientOrder={handleCompleteClientOrder}
            onSendGiftToClient={handleSendGiftToClient}
          />
        )}
      </main>

      {/* 2. Storage Drawer Modal (Tab Nguyên Liệu & Tab Sản Phẩm) */}
      <StorageDrawer
        isOpen={isStorageOpen}
        onClose={() => setIsStorageOpen(false)}
        rawMaterials={gameState.rawMaterials}
        craftedProducts={gameState.craftedProducts}
        marketItems={gameState.marketItems}
        onOpenListingModal={(prod) => {
          setIsStorageOpen(false);
          setListingProduct(prod);
        }}
      />

      {/* 3. Rao Bán Lên Thị Trường Modal */}
      <ListingModal
        isOpen={listingProduct !== null}
        onClose={() => setListingProduct(null)}
        product={listingProduct}
        marketItems={gameState.marketItems}
        onConfirmListing={handleConfirmListing}
      />

      {/* 4. Wage Payment Modal (1h30p) */}
      <WageModal
        isOpen={isWageModalOpen}
        onClose={() => setIsWageModalOpen(false)}
        workers={gameState.workers}
        linhThach={gameState.linhThach}
        onPayWages={handlePayWages}
      />
    </div>
  );
}
