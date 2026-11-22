import React, { useEffect, useRef } from 'react';
import { ProfessionId } from '../types/game';
import { sound } from '../utils/audio';

interface PixelCanvasProps {
  profession: ProfessionId;
  isRunning: boolean;
  workerCount: number;
  facilityLevel: number;
  onManualAction?: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
  text?: string;
}

export const PixelCanvas: React.FC<PixelCanvasProps> = ({
  profession,
  isRunning,
  workerCount,
  facilityLevel,
  onManualAction
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const frameRef = useRef<number>(0);
  const tickRef = useRef<number>(0);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    // Trigger profession sound
    if (profession === 'luyen_khi') sound.playHammer();
    else if (profession === 'luyen_dan') sound.playBubble();
    else if (profession === 'khai_khoang') sound.playPickaxe();
    else if (profession === 'duoc_dien') sound.playHarvest();
    else if (profession === 'luyen_bao') sound.playMagicChime();

    // Spawn floating Qi text & particles
    const texts = ['+Linh Lực!', '+Thuần Khiết!', '+Đạt Đạo!', '+1'];
    const chosenText = texts[Math.floor(Math.random() * texts.length)];
    particlesRef.current.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 1.5,
      vy: -1.8,
      color: '#facc15',
      size: 14,
      life: 0,
      maxLife: 45,
      text: chosenText
    });

    for (let i = 0; i < 8; i++) {
      particlesRef.current.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        color: ['#f59e0b', '#38bdf8', '#a855f7', '#10b981'][Math.floor(Math.random() * 4)],
        size: Math.floor(Math.random() * 4) + 2,
        life: 0,
        maxLife: 30
      });
    }

    if (onManualAction) {
      onManualAction();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    let isMounted = true;

    const render = () => {
      if (!isMounted) return;
      tickRef.current++;
      const t = tickRef.current;

      const w = canvas.width;
      const h = canvas.height;

      // 1. Background sky & mountain / cavern layers
      if (profession === 'khai_khoang') {
        // Underground cavern
        ctx.fillStyle = '#090d16';
        ctx.fillRect(0, 0, w, h);

        // Rocky cavern texture
        for (let x = 0; x < w; x += 16) {
          for (let y = 0; y < 110; y += 16) {
            if ((x * 13 + y * 17) % 7 === 0) {
              ctx.fillStyle = '#1e293b';
              ctx.fillRect(x, y, 16, 16);
            }
          }
        }

        // Glowing crystal veins on cavern ceiling
        const crystalColors = ['#06b6d4', '#818cf8', '#38bdf8'];
        [40, 110, 220, 310, 420].forEach((cx, i) => {
          const cy = 20 + Math.sin(t * 0.05 + i) * 3;
          ctx.fillStyle = crystalColors[i % crystalColors.length];
          // Draw diamond crystal
          ctx.beginPath();
          ctx.moveTo(cx, cy - 8);
          ctx.lineTo(cx + 6, cy);
          ctx.lineTo(cx, cy + 12);
          ctx.lineTo(cx - 6, cy);
          ctx.closePath();
          ctx.fill();

          // Ambient light
          ctx.fillStyle = 'rgba(6, 182, 212, 0.15)';
          ctx.fillRect(cx - 12, cy - 10, 24, 26);
        });

      } else {
        // Open sky with Daoist mountains
        const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
        if (profession === 'luyen_khi') {
          skyGrad.addColorStop(0, '#1c1917');
          skyGrad.addColorStop(0.6, '#451a03');
          skyGrad.addColorStop(1, '#0c0a09');
        } else if (profession === 'duoc_dien') {
          skyGrad.addColorStop(0, '#064e3b');
          skyGrad.addColorStop(0.6, '#065f46');
          skyGrad.addColorStop(1, '#022c22');
        } else if (profession === 'luyen_dan') {
          skyGrad.addColorStop(0, '#134e4a');
          skyGrad.addColorStop(0.6, '#0f766e');
          skyGrad.addColorStop(1, '#042f2e');
        } else {
          // Luyện Bảo
          skyGrad.addColorStop(0, '#2e1065');
          skyGrad.addColorStop(0.6, '#3b0764');
          skyGrad.addColorStop(1, '#18022d');
        }
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, w, h);

        // Distant pixel mountains
        ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
        ctx.beginPath();
        ctx.moveTo(0, 100);
        ctx.lineTo(60, 40);
        ctx.lineTo(130, 85);
        ctx.lineTo(210, 30);
        ctx.lineTo(290, 95);
        ctx.lineTo(390, 45);
        ctx.lineTo(480, 110);
        ctx.lineTo(480, h);
        ctx.lineTo(0, h);
        ctx.fill();

        // Floating spirit Qi wisps
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        for (let i = 0; i < 4; i++) {
          const qx = (t * 0.8 + i * 130) % (w + 60) - 30;
          const qy = 30 + Math.sin((t + i * 20) * 0.04) * 8;
          ctx.fillRect(qx, qy, 35, 6);
          ctx.fillRect(qx + 5, qy - 4, 25, 4);
          ctx.fillRect(qx + 8, qy + 6, 18, 3);
        }
      }

      // 2. Flooring / Ground
      const groundY = 130;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, groundY, w, h - groundY);

      // Floor tiles
      for (let x = 0; x < w; x += 24) {
        ctx.fillStyle = ((x / 24) % 2 === 0) ? '#1e293b' : '#334155';
        ctx.fillRect(x, groundY, 22, 6);
      }

      // 3. Main Center Piece for each profession
      const cx = w / 2;
      const cy = groundY;

      if (profession === 'luyen_khi') {
        // --- LUYỆN KHÍ: FORGE FURNACE & ANVIL & BLACKSMITH ---
        // Large stone furnace
        ctx.fillStyle = '#475569';
        ctx.fillRect(cx - 90, cy - 80, 70, 80);
        ctx.fillStyle = '#334155';
        ctx.fillRect(cx - 86, cy - 76, 62, 72);

        // Chimney with pixel smoke
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(cx - 75, cy - 110, 36, 32);

        // Furnace mouth with fire
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(cx - 80, cy - 45, 50, 40);

        // Animated Fire inside furnace
        const fireHeight = 25 + Math.sin(t * 0.3) * 6;
        ctx.fillStyle = '#ea580c';
        ctx.fillRect(cx - 75, cy - 10 - fireHeight, 40, fireHeight);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(cx - 70, cy - 10 - fireHeight * 0.75, 30, fireHeight * 0.75);
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(cx - 62, cy - 10 - fireHeight * 0.45, 14, fireHeight * 0.45);

        // Smoke particles from chimney
        if (t % 8 === 0 && isRunning) {
          particlesRef.current.push({
            x: cx - 57 + (Math.random() - 0.5) * 12,
            y: cy - 110,
            vx: -0.4 + Math.random() * 0.8,
            vy: -1.2 - Math.random() * 0.5,
            color: 'rgba(203, 213, 225, 0.4)',
            size: 6,
            life: 0,
            maxLife: 40
          });
        }

        // Anvil
        ctx.fillStyle = '#64748b';
        ctx.fillRect(cx + 20, cy - 25, 36, 25);
        ctx.fillRect(cx + 10, cy - 25, 12, 10);
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(cx + 12, cy - 27, 44, 6);

        // Glowing hot sword on anvil
        ctx.fillStyle = isRunning ? '#f97316' : '#60a5fa';
        ctx.fillRect(cx + 18, cy - 29, 28, 4);

        // Blacksmith character striking anvil
        const hammerDown = Math.sin(t * 0.2) > 0.5;
        const bX = cx + 65;
        const bY = cy - 45;

        // Body & robe
        ctx.fillStyle = '#b45309';
        ctx.fillRect(bX, bY + 12, 14, 25);
        // Head / Headband
        ctx.fillStyle = '#fed7aa';
        ctx.fillRect(bX + 2, bY, 10, 12);
        ctx.fillStyle = '#dc2626'; // red bandana
        ctx.fillRect(bX + 1, bY + 2, 12, 3);
        // Arm & Hammer
        ctx.fillStyle = '#78716c';
        if (hammerDown) {
          // Hammer hitting anvil
          ctx.fillRect(bX - 16, bY + 14, 18, 5);
          ctx.fillStyle = '#475569';
          ctx.fillRect(bX - 22, bY + 11, 10, 11);

          // Sparks on anvil impact!
          if (t % 6 === 0) {
            for (let i = 0; i < 4; i++) {
              particlesRef.current.push({
                x: cx + 32,
                y: cy - 29,
                vx: (Math.random() - 0.5) * 5,
                vy: -Math.random() * 4 - 1,
                color: '#fbbf24',
                size: 2,
                life: 0,
                maxLife: 15
              });
            }
          }
        } else {
          // Hammer raised high
          ctx.fillRect(bX - 6, bY - 4, 5, 18);
          ctx.fillStyle = '#475569';
          ctx.fillRect(bX - 10, bY - 14, 12, 10);
        }

      } else if (profession === 'luyen_dan') {
        // --- LUYỆN ĐAN: BRONZE ALCHEMY CAULDRON & QI SMOKE ---
        // Three-legged cauldron
        ctx.fillStyle = '#b45309';
        // Legs
        ctx.fillRect(cx - 38, cy - 14, 8, 14);
        ctx.fillRect(cx + 30, cy - 14, 8, 14);
        ctx.fillRect(cx - 4, cy - 8, 8, 8);
        // Cauldron body
        ctx.fillStyle = '#047857';
        ctx.beginPath();
        ctx.ellipse(cx, cy - 35, 45, 30, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#065f46';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Golden ornate rim & handles
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(cx - 40, cy - 50, 80, 8);
        ctx.fillRect(cx - 52, cy - 42, 12, 16);
        ctx.fillRect(cx + 40, cy - 42, 12, 16);

        // Dragon relief carving on cauldron
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(cx - 10, cy - 36, 20, 6);
        ctx.fillRect(cx - 6, cy - 42, 12, 6);

        // Under-cauldron flame
        const flameH = 14 + Math.sin(t * 0.4) * 4;
        ctx.fillStyle = '#38bdf8'; // Spiritual cyan fire
        ctx.fillRect(cx - 20, cy - flameH, 40, flameH);
        ctx.fillStyle = '#a7f3d0';
        ctx.fillRect(cx - 12, cy - flameH * 0.7, 24, flameH * 0.7);

        // Bubbling colored elixir mist
        if (t % 5 === 0 && isRunning) {
          particlesRef.current.push({
            x: cx + (Math.random() - 0.5) * 40,
            y: cy - 52,
            vx: (Math.random() - 0.5) * 1.5,
            vy: -1.2 - Math.random() * 1.2,
            color: ['#10b981', '#34d399', '#fef08a', '#c084fc'][Math.floor(Math.random() * 4)],
            size: Math.floor(Math.random() * 6) + 3,
            life: 0,
            maxLife: 35
          });
        }

        // Herb drying rack on the left
        ctx.fillStyle = '#78350f';
        ctx.fillRect(cx - 120, cy - 65, 4, 65);
        ctx.fillRect(cx - 80, cy - 65, 4, 65);
        ctx.fillRect(cx - 124, cy - 45, 48, 4);
        ctx.fillRect(cx - 124, cy - 25, 48, 4);
        // Herbs hanging
        ctx.fillStyle = '#ef4444'; // Red herb
        ctx.fillRect(cx - 115, cy - 41, 6, 12);
        ctx.fillStyle = '#22c55e'; // Green herb
        ctx.fillRect(cx - 102, cy - 41, 6, 10);
        ctx.fillStyle = '#eab308'; // Yellow herb
        ctx.fillRect(cx - 90, cy - 41, 6, 14);

        // Alchemist waving fan
        const aX = cx + 70;
        const aY = cy - 45;
        // Robe
        ctx.fillStyle = '#065f46';
        ctx.fillRect(aX, aY + 12, 14, 25);
        // Head / Taoist bun
        ctx.fillStyle = '#fed7aa';
        ctx.fillRect(aX + 2, aY, 10, 12);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(aX + 4, aY - 4, 6, 5);
        // Feather fan waving
        const fanAngle = Math.sin(t * 0.15) * 8;
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(aX - 10, aY + 16 + fanAngle, 12, 10);

      } else if (profession === 'khai_khoang') {
        // --- KHAI KHOÁNG: MINE SHAFT, RAILS & MINECART ---
        // Mine shaft wooden beams
        ctx.fillStyle = '#78350f';
        ctx.fillRect(cx - 110, cy - 90, 14, 90);
        ctx.fillRect(cx - 20, cy - 90, 14, 90);
        ctx.fillRect(cx - 115, cy - 95, 115, 14);

        // Mine opening dark hole
        ctx.fillStyle = '#020617';
        ctx.fillRect(cx - 96, cy - 80, 76, 80);

        // Rails on ground
        ctx.fillStyle = '#64748b';
        ctx.fillRect(cx - 140, cy - 6, 280, 4);
        ctx.fillRect(cx - 140, cy - 1, 280, 4);
        // Wooden ties
        for (let rx = cx - 140; rx < cx + 140; rx += 14) {
          ctx.fillStyle = '#92400e';
          ctx.fillRect(rx, cy - 8, 4, 9);
        }

        // Rolling Minecart
        const cartOffset = isRunning ? (t * 2) % 180 - 50 : 20;
        const cartX = cx - 30 + cartOffset;
        const cartY = cy - 28;

        // Cart body
        ctx.fillStyle = '#475569';
        ctx.fillRect(cartX, cartY, 44, 20);
        ctx.fillStyle = '#334155';
        ctx.fillRect(cartX + 3, cartY + 3, 38, 14);
        // Glowing ores loaded in cart
        ctx.fillStyle = '#38bdf8'; // Ice crystal ore
        ctx.fillRect(cartX + 6, cartY - 4, 8, 8);
        ctx.fillStyle = '#f59e0b'; // Gold ore
        ctx.fillRect(cartX + 16, cartY - 6, 10, 10);
        ctx.fillStyle = '#94a3b8'; // Iron ore
        ctx.fillRect(cartX + 28, cartY - 3, 10, 8);

        // Wheels
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(cartX + 4, cartY + 18, 8, 8);
        ctx.fillRect(cartX + 32, cartY + 18, 8, 8);

        // Miner with pickaxe
        const mX = cx + 80;
        const mY = cy - 45;
        // Body
        ctx.fillStyle = '#0369a1';
        ctx.fillRect(mX, mY + 12, 14, 25);
        // Miner helmet with lamp
        ctx.fillStyle = '#fed7aa';
        ctx.fillRect(mX + 2, mY, 10, 12);
        ctx.fillStyle = '#eab308'; // Hard hat
        ctx.fillRect(mX + 1, mY - 2, 12, 5);
        ctx.fillStyle = '#fef08a'; // Headlamp light
        ctx.fillRect(mX - 2, mY, 4, 4);

        // Pickaxe swinging
        const swing = Math.sin(t * 0.25) > 0;
        ctx.fillStyle = '#78350f';
        if (swing) {
          // Striking rock
          ctx.fillRect(mX - 16, mY + 16, 18, 4);
          ctx.fillStyle = '#94a3b8';
          ctx.fillRect(mX - 20, mY + 10, 6, 16);
          if (t % 4 === 0) {
            particlesRef.current.push({
              x: mX - 18,
              y: mY + 18,
              vx: (Math.random() - 0.5) * 4,
              vy: -Math.random() * 3,
              color: '#94a3b8',
              size: 2,
              life: 0,
              maxLife: 15
            });
          }
        } else {
          // Raised pickaxe
          ctx.fillRect(mX - 6, mY - 6, 4, 18);
          ctx.fillStyle = '#94a3b8';
          ctx.fillRect(mX - 12, mY - 10, 16, 6);
        }

      } else if (profession === 'duoc_dien') {
        // --- DƯỢC ĐIỀN: TERRACED HERB GARDEN & SPIRIT SPRINKLER ---
        // Soil plots
        for (let i = 0; i < 4; i++) {
          const px = cx - 120 + i * 65;
          const py = cy - 35;
          // Soil mound
          ctx.fillStyle = '#78350f';
          ctx.fillRect(px, py + 15, 55, 20);
          ctx.fillStyle = '#451a03';
          ctx.fillRect(px + 4, py + 18, 47, 14);

          // Growing plants
          const sway = Math.sin(t * 0.08 + i) * 3;
          if (i === 0) {
            // Ngưng Huyết Thảo (Red Herb)
            ctx.fillStyle = '#16a34a'; // stem
            ctx.fillRect(px + 24, py + 4, 4, 15);
            ctx.fillStyle = '#ef4444'; // red petals
            ctx.fillRect(px + 20 + sway, py - 4, 12, 10);
            ctx.fillStyle = '#fca5a5';
            ctx.fillRect(px + 23 + sway, py - 2, 6, 6);
          } else if (i === 1) {
            // Hoàng Tinh (Yellow Herb)
            ctx.fillStyle = '#16a34a';
            ctx.fillRect(px + 24, py + 6, 4, 13);
            ctx.fillStyle = '#eab308';
            ctx.fillRect(px + 18 + sway, py, 16, 8);
          } else if (i === 2) {
            // Cửu Diệp Thảo (Green leafy)
            ctx.fillStyle = '#22c55e';
            ctx.fillRect(px + 16, py + 2, 6, 8);
            ctx.fillRect(px + 30, py + 4, 6, 8);
            ctx.fillRect(px + 23 + sway, py - 6, 8, 12);
          } else {
            // Linh Chi (Red/Gold Reishi Mushroom)
            ctx.fillStyle = '#fef08a';
            ctx.fillRect(px + 24, py + 6, 6, 12);
            ctx.fillStyle = '#b91c1c';
            ctx.fillRect(px + 16 + sway, py - 2, 22, 10);
          }
        }

        // Bamboo Spirit Water Aqueduct
        ctx.fillStyle = '#65a30d';
        ctx.fillRect(cx - 130, cy - 55, 260, 6);
        // Water drops
        if (t % 6 === 0) {
          particlesRef.current.push({
            x: cx - 90 + Math.random() * 180,
            y: cy - 48,
            vx: 0,
            vy: 2.2,
            color: '#38bdf8',
            size: 3,
            life: 0,
            maxLife: 20
          });
        }

        // Spirit butterflies floating
        const bfX = cx + Math.sin(t * 0.05) * 80;
        const bfY = cy - 70 + Math.cos(t * 0.07) * 20;
        ctx.fillStyle = '#a855f7';
        ctx.fillRect(bfX - 3, bfY - 2, 3, 4);
        ctx.fillRect(bfX + 2, bfY - 2, 3, 4);
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(bfX, bfY - 1, 2, 2);

      } else {
        // --- LUYỆN BẢO: TAOIST ALTAR, FLOATING RINGS & SPATIAL VORTEX ---
        // Hexagonal Altar base
        ctx.fillStyle = '#475569';
        ctx.fillRect(cx - 60, cy - 30, 120, 30);
        ctx.fillStyle = '#334155';
        ctx.fillRect(cx - 50, cy - 24, 100, 20);

        // Glowing Runic Circles on floor
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(cx, cy - 30, 70, 20, 0, 0, Math.PI * 2);
        ctx.stroke();

        // 8 Runes on circle
        for (let r = 0; r < 8; r++) {
          const angle = (r * Math.PI) / 4 + t * 0.02;
          const rx = cx + Math.cos(angle) * 60;
          const ry = cy - 30 + Math.sin(angle) * 16;
          ctx.fillStyle = '#c084fc';
          ctx.fillRect(rx - 2, ry - 2, 4, 4);
        }

        // Floating Spatial Rings & Amulets
        const floatY = cy - 65 + Math.sin(t * 0.06) * 8;
        // Big central treasure: Floating Storage Ring
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(cx, floatY, 16, 0, Math.PI * 2);
        ctx.stroke();
        // Socketed gem
        ctx.fillStyle = '#f43f5e';
        ctx.fillRect(cx - 4, floatY - 20, 8, 8);

        // Swirling purple spatial vortex particles
        if (t % 4 === 0 && isRunning) {
          const pAngle = Math.random() * Math.PI * 2;
          const pDist = 20 + Math.random() * 25;
          particlesRef.current.push({
            x: cx + Math.cos(pAngle) * pDist,
            y: floatY + Math.sin(pAngle) * pDist,
            vx: -Math.cos(pAngle) * 1.5,
            vy: -Math.sin(pAngle) * 1.5,
            color: ['#a855f7', '#c084fc', '#38bdf8', '#f43f5e'][Math.floor(Math.random() * 4)],
            size: 3,
            life: 0,
            maxLife: 25
          });
        }

        // Treasure Master in deep meditation
        const mX = cx - 90;
        const mY = cy - 40;
        ctx.fillStyle = '#581c87';
        ctx.fillRect(mX, mY + 10, 16, 20); // robe
        ctx.fillStyle = '#fed7aa';
        ctx.fillRect(mX + 3, mY, 10, 10); // face
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(mX + 2, mY - 3, 12, 4); // Taoist crown
      }

      // 4. Update and render particles (Sparks, Qi, smoke, floating texts)
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;

        if (p.text) {
          // Text particle
          ctx.font = 'bold 13px "VT323", monospace';
          ctx.fillStyle = p.color;
          ctx.fillText(p.text, p.x, p.y);
        } else {
          // Pixel particle
          ctx.fillStyle = p.color;
          ctx.fillRect(p.x, p.y, p.size, p.size);
        }

        if (p.life >= p.maxLife) {
          particlesRef.current.splice(i, 1);
        }
      }

      // 5. Ambient Factory HUD overlay
      ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
      ctx.fillRect(10, 10, 140, 24);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(10, 10, 140, 24);
      ctx.font = '12px "VT323", monospace';
      ctx.fillStyle = isRunning ? '#4ade80' : '#94a3b8';
      ctx.fillText(isRunning ? '● ĐANG VẬN HÀNH...' : '○ TẠM DỪNG', 16, 26);

      ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
      ctx.fillRect(w - 150, 10, 140, 24);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(w - 150, 10, 140, 24);
      ctx.fillStyle = '#fbbf24';
      ctx.fillText(`CÔNG NHÂN: ${workerCount} | CẤP ${facilityLevel}`, w - 142, 26);

      frameRef.current = requestAnimationFrame(render);
    };

    frameRef.current = requestAnimationFrame(render);

    return () => {
      isMounted = false;
      cancelAnimationFrame(frameRef.current);
    };
  }, [profession, isRunning, workerCount, facilityLevel]);

  return (
    <div className="relative group overflow-hidden border-2 border-slate-700 bg-slate-950 pixel-box shadow-2xl rounded-sm">
      <canvas
        ref={canvasRef}
        width={480}
        height={180}
        onClick={handleClick}
        className="w-full h-44 sm:h-52 cursor-pointer block select-none"
        title="Nhấp chuột để tụ linh lực & tăng tốc rèn luyện!"
      />
      <div className="absolute bottom-2 right-2 pointer-events-none opacity-80 bg-slate-900/80 px-2 py-0.5 text-[10px] text-amber-300 font-pixel border border-slate-700 rounded">
        [Nhấp chuột để Tụ Khí / Thủ Công]
      </div>
    </div>
  );
};
