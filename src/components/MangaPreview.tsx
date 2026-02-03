'use client';

import { useState } from 'react';
import { RefreshCw, Download, ExternalLink, Loader2, Eye } from 'lucide-react';
import type { GeneratedManga, MangaPanel } from '@/types';
import Image from 'next/image';

interface MangaPreviewProps {
  manga: GeneratedManga;
  onRegenerate: (panelNumber: number) => void;
  isRegenerating: number | null;
  productName?: string;
  productDescription?: string;
}

function PanelCard({ 
  panel, 
  onRegenerate, 
  isRegenerating 
}: { 
  panel: MangaPanel; 
  onRegenerate: () => void;
  isRegenerating: boolean;
}) {
  const panelLabels = ['起', '承', '転', '結'];
  
  return (
    <div className="relative group">
      <div className="absolute -top-3 -left-3 z-10 w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
        <span className="text-white font-bold text-lg">{panelLabels[panel.panelNumber - 1]}</span>
      </div>
      
      <div className="bg-white rounded-2xl overflow-hidden shadow-xl border-4 border-zinc-900">
        <div className="relative aspect-square bg-zinc-100">
          {panel.imageUrl ? (
            <Image
              src={panel.imageUrl}
              alt={`コマ ${panel.panelNumber}`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-200 to-zinc-300">
              <div className="text-center p-4">
                <div className="text-4xl mb-2">🎨</div>
                <p className="text-zinc-500 text-sm">{panel.description}</p>
              </div>
            </div>
          )}
          
          <button
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="absolute top-2 right-2 p-2 bg-black/70 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
          >
            {isRegenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </button>
        </div>
        
        <div className="p-4 bg-white">
          <div className="relative bg-zinc-50 rounded-xl p-3 border-2 border-zinc-200">
            <div className="absolute -top-2 left-6 w-4 h-4 bg-zinc-50 border-l-2 border-t-2 border-zinc-200 rotate-45" />
            <p className="text-zinc-800 font-medium text-sm leading-relaxed">
              {panel.dialogue || 'セリフがここに入ります'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MangaPreview({ 
  manga, 
  onRegenerate, 
  isRegenerating,
  productName = '商品名',
  productDescription = ''
}: MangaPreviewProps) {
  const [showLPPreview, setShowLPPreview] = useState(false);

  const handleExportHTML = () => {
    const htmlContent = generateFullLPHTML(manga, productName, productDescription);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${productName || 'manga-lp'}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* タイトル */}
      <div className="text-center">
        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-pink-500 to-purple-500">
          {manga.title || '生成された漫画LP'}
        </h2>
        <p className="text-zinc-500 text-sm mt-2">4コマ漫画が生成されました</p>
      </div>

      {/* 4コマ漫画グリッド */}
      <div className="grid grid-cols-2 gap-4">
        {manga.panels.map((panel) => (
          <PanelCard
            key={panel.panelNumber}
            panel={panel}
            onRegenerate={() => onRegenerate(panel.panelNumber)}
            isRegenerating={isRegenerating === panel.panelNumber}
          />
        ))}
      </div>

      {/* CTAプレビュー */}
      <div className="bg-gradient-to-r from-amber-500 via-pink-500 to-purple-500 p-1 rounded-2xl">
        <div className="bg-zinc-900 rounded-xl p-6 text-center">
          <p className="text-white text-lg font-bold mb-3">{manga.ctaText}</p>
          <button className="px-6 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold rounded-full text-sm">
            詳細を見る →
          </button>
        </div>
      </div>

      {/* アクションボタン */}
      <div className="flex gap-3">
        <button
          onClick={() => setShowLPPreview(true)}
          className="flex-1 py-3 px-4 bg-zinc-800 text-white font-medium rounded-xl border border-zinc-700 hover:bg-zinc-700 transition-all flex items-center justify-center gap-2 text-sm"
        >
          <Eye className="w-4 h-4" />
          LPプレビュー
        </button>
        <button
          onClick={handleExportHTML}
          className="flex-1 py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center justify-center gap-2 text-sm"
        >
          <Download className="w-4 h-4" />
          HTMLダウンロード
        </button>
      </div>

      {/* LPプレビューモーダル */}
      {showLPPreview && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-xl font-bold text-zinc-800">ランディングページ プレビュー</h3>
                <p className="text-sm text-zinc-500">実際のLPイメージ</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleExportHTML}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium rounded-lg text-sm flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  ダウンロード
                </button>
                <button
                  onClick={() => setShowLPPreview(false)}
                  className="p-2 hover:bg-zinc-100 rounded-lg transition-colors text-zinc-600"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="overflow-auto flex-1">
              <iframe
                srcDoc={generateFullLPHTML(manga, productName, productDescription)}
                className="w-full h-full min-h-[800px]"
                title="LP Preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function generateFullLPHTML(manga: GeneratedManga, productName: string, productDescription: string): string {
  const panelLabels = ['起', '承', '転', '結'];
  const panelTitles = ['こんな悩み、ありませんか？', 'どんどん深刻に...', 'そんな時！', '解決！'];
  
  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${productName} | ${manga.title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700;900&family=Zen+Maru+Gothic:wght@700;900&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body { 
      font-family: 'Noto Sans JP', 'Hiragino Sans', sans-serif;
      background: #0a0a0a;
      color: #fff;
      line-height: 1.8;
    }
    
    .container { 
      max-width: 480px; 
      margin: 0 auto; 
      padding: 0 16px;
    }
    
    /* ヒーローセクション */
    .hero {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 40px 20px;
      background: linear-gradient(180deg, #1a1a2e 0%, #0a0a0a 100%);
      position: relative;
      overflow: hidden;
    }
    
    .hero::before {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%);
    }
    
    .hero-content {
      position: relative;
      z-index: 1;
    }
    
    .hero-badge {
      display: inline-block;
      padding: 10px 24px;
      background: linear-gradient(90deg, rgba(245,158,11,0.2), rgba(236,72,153,0.2));
      border: 1px solid rgba(245, 158, 11, 0.4);
      border-radius: 50px;
      font-size: 13px;
      font-weight: 700;
      color: #fbbf24;
      margin-bottom: 24px;
      letter-spacing: 0.05em;
    }
    
    .hero h1 {
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 28px;
      font-weight: 900;
      line-height: 1.4;
      margin-bottom: 20px;
    }
    
    .hero h1 .highlight {
      display: block;
      font-size: 36px;
      background: linear-gradient(90deg, #fbbf24, #ec4899, #a855f7);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-top: 8px;
    }
    
    .hero-desc {
      font-size: 15px;
      color: #a1a1aa;
      margin-bottom: 32px;
      line-height: 1.8;
    }
    
    .cta-button {
      display: inline-block;
      width: 100%;
      max-width: 300px;
      padding: 20px 32px;
      background: linear-gradient(90deg, #f59e0b, #ea580c);
      color: white;
      font-weight: 900;
      font-size: 18px;
      border-radius: 60px;
      text-decoration: none;
      box-shadow: 0 20px 40px rgba(245, 158, 11, 0.4);
      transition: all 0.3s ease;
      letter-spacing: 0.05em;
    }
    
    .cta-button:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 25px 50px rgba(245, 158, 11, 0.5);
    }
    
    .scroll-hint {
      margin-top: 48px;
      color: #52525b;
      font-size: 12px;
      animation: bounce 2s infinite;
    }
    
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
    
    /* 漫画セクション - 縦型 */
    .manga-section {
      padding: 60px 0;
      background: linear-gradient(180deg, #0a0a0a 0%, #0f0f1a 50%, #0a0a0a 100%);
    }
    
    .manga-flow {
      display: flex;
      flex-direction: column;
      gap: 0;
    }
    
    .panel-wrapper {
      position: relative;
    }
    
    .panel-header {
      text-align: center;
      padding: 40px 20px 24px;
    }
    
    .panel-number {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      background: linear-gradient(135deg, #f59e0b, #ea580c);
      border-radius: 50%;
      color: white;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-weight: 900;
      font-size: 24px;
      box-shadow: 0 8px 24px rgba(245, 158, 11, 0.4);
      margin-bottom: 16px;
    }
    
    .panel-title {
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 20px;
      font-weight: 900;
      color: #fff;
    }
    
    .panel {
      max-width: 400px;
      margin: 0 auto;
      background: white;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 30px 80px rgba(0,0,0,0.6);
      border: 6px solid #18181b;
    }
    
    .panel-image {
      aspect-ratio: 1;
      background: linear-gradient(135deg, #f8f8f8, #e8e8e8);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    
    .panel-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .panel-image-placeholder {
      padding: 32px;
      text-align: center;
      color: #71717a;
      font-size: 14px;
      line-height: 1.7;
    }
    
    .panel-dialogue {
      padding: 20px;
      background: white;
    }
    
    .dialogue-bubble {
      background: linear-gradient(135deg, #fefce8, #fff);
      border-radius: 20px;
      padding: 20px 24px;
      border: 3px solid #fbbf24;
      position: relative;
      box-shadow: 0 4px 12px rgba(251, 191, 36, 0.2);
    }
    
    .dialogue-bubble::before {
      content: '';
      position: absolute;
      top: -14px;
      left: 32px;
      width: 24px;
      height: 24px;
      background: linear-gradient(135deg, #fefce8, #fff);
      border-left: 3px solid #fbbf24;
      border-top: 3px solid #fbbf24;
      transform: rotate(45deg);
    }
    
    .dialogue-bubble p {
      color: #18181b;
      font-size: 16px;
      line-height: 1.8;
      font-weight: 700;
    }
    
    /* 矢印コネクター */
    .connector {
      display: flex;
      justify-content: center;
      padding: 32px 0;
    }
    
    .connector-arrow {
      width: 4px;
      height: 60px;
      background: linear-gradient(180deg, #f59e0b, #ec4899);
      position: relative;
      border-radius: 2px;
    }
    
    .connector-arrow::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 50%;
      transform: translateX(-50%);
      border-left: 12px solid transparent;
      border-right: 12px solid transparent;
      border-top: 16px solid #ec4899;
    }
    
    /* 中間CTA */
    .mid-cta {
      padding: 48px 20px;
      text-align: center;
      background: linear-gradient(180deg, transparent, rgba(245,158,11,0.05), transparent);
    }
    
    .mid-cta p {
      color: #a1a1aa;
      font-size: 14px;
      margin-bottom: 16px;
    }
    
    .mid-cta .cta-button {
      font-size: 16px;
      padding: 16px 32px;
    }
    
    /* CTAセクション */
    .cta-section {
      padding: 80px 20px;
      background: linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 100%);
      text-align: center;
    }
    
    .cta-box {
      max-width: 400px;
      margin: 0 auto;
      background: linear-gradient(135deg, rgba(245,158,11,0.1), rgba(236,72,153,0.1));
      border: 2px solid rgba(236,72,153,0.3);
      border-radius: 32px;
      padding: 48px 24px;
    }
    
    .cta-box h2 {
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 24px;
      font-weight: 900;
      margin-bottom: 16px;
      background: linear-gradient(90deg, #fbbf24, #ec4899);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1.5;
    }
    
    .cta-box p {
      color: #a1a1aa;
      margin-bottom: 32px;
      font-size: 14px;
    }
    
    .cta-box .cta-button {
      width: 100%;
    }
    
    /* フッター */
    footer {
      padding: 48px 20px;
      text-align: center;
      color: #52525b;
      font-size: 12px;
      border-top: 1px solid #27272a;
    }
    
    footer a {
      color: #71717a;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <!-- ヒーローセクション -->
  <section class="hero">
    <div class="hero-content">
      <div class="hero-badge">✨ 今話題のサービス</div>
      <h1>
        ${manga.title}
        <span class="highlight">${productName}</span>
      </h1>
      <p class="hero-desc">${productDescription || manga.ctaText}</p>
      <a href="#manga" class="cta-button">漫画で詳しく見る ↓</a>
      <div class="scroll-hint">↓ スクロールして読む ↓</div>
    </div>
  </section>
  
  <!-- 漫画セクション（縦型） -->
  <section class="manga-section" id="manga">
    <div class="container">
      <div class="manga-flow">
        ${manga.panels.map((panel, i) => `
        <div class="panel-wrapper">
          <div class="panel-header">
            <div class="panel-number">${panelLabels[i]}</div>
            <h3 class="panel-title">${panelTitles[i]}</h3>
          </div>
          <div class="panel">
            <div class="panel-image">
              ${panel.imageUrl 
                ? `<img src="${panel.imageUrl}" alt="コマ${panel.panelNumber}" />`
                : `<div class="panel-image-placeholder">${panel.description}</div>`
              }
            </div>
            <div class="panel-dialogue">
              <div class="dialogue-bubble">
                <p>${panel.dialogue}</p>
              </div>
            </div>
          </div>
        </div>
        ${i < manga.panels.length - 1 ? `
        <div class="connector">
          <div class="connector-arrow"></div>
        </div>
        ` : ''}
        ${i === 1 ? `
        <div class="mid-cta">
          <p>続きが気になる方は...</p>
          <a href="#cta" class="cta-button">今すぐチェック →</a>
        </div>
        ` : ''}
        `).join('')}
      </div>
    </div>
  </section>
  
  <!-- CTAセクション -->
  <section class="cta-section" id="cta">
    <div class="cta-box">
      <h2>${manga.ctaText}</h2>
      <p>今すぐ${productName}で<br>あなたの課題を解決しましょう！</p>
      <a href="#" class="cta-button">無料で始める →</a>
    </div>
  </section>
  
  <!-- フッター -->
  <footer>
    <p>© 2026 ${productName}. All rights reserved.</p>
  </footer>
</body>
</html>`;
}
