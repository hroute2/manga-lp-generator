'use client';

import { useState } from 'react';
import { BookOpen, Zap, Palette, Download } from 'lucide-react';
import InputForm from '@/components/InputForm';
import MangaPreview from '@/components/MangaPreview';
import type { MangaInput, GeneratedManga } from '@/types';

export default function Home() {
  const [manga, setManga] = useState<GeneratedManga | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentInput, setCurrentInput] = useState<MangaInput | null>(null);

  const handleSubmit = async (input: MangaInput) => {
    setCurrentInput(input);
    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Gemini APIでプロンプト生成
      const promptResponse = await fetch('/api/generate-prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      const promptData = await promptResponse.json();

      if (!promptData.success) {
        throw new Error(promptData.error || 'プロンプト生成に失敗しました');
      }

      // Step 2: Nano Banana APIで漫画生成
      const mangaResponse = await fetch('/api/generate-manga', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ panels: promptData.manga.panels }),
      });

      const mangaData = await mangaResponse.json();

      if (!mangaData.success) {
        throw new Error(mangaData.error || '漫画生成に失敗しました');
      }

      setManga({
        ...promptData.manga,
        panels: mangaData.panels,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async (panelNumber: number) => {
    if (!manga) return;

    setIsRegenerating(panelNumber);

    try {
      const response = await fetch('/api/generate-manga', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          panels: manga.panels,
          regeneratePanelNumber: panelNumber,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || '再生成に失敗しました');
      }

      setManga({
        ...manga,
        panels: data.panels,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '再生成に失敗しました');
    } finally {
      setIsRegenerating(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      {/* ヘッダー */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-zinc-900/80 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 via-pink-500 to-purple-500 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white">漫画LP Generator</h1>
              <p className="text-xs text-zinc-500">Powered by Nano Banana & Gemini</p>
            </div>
          </div>
        </div>
      </header>

      {/* ヒーローセクション */}
      {!manga && (
        <section className="relative py-20 px-4 overflow-hidden">
          {/* 背景エフェクト */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              AI搭載の漫画LP生成ツール
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              あなたの商品を
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-pink-500 to-purple-500">
                4コマ漫画LP
              </span>
              に変換
            </h2>
            
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-12">
              商品情報を入力するだけで、AIが自動で4コマ漫画形式のランディングページを生成。
              <br />
              視覚的でわかりやすいLPで、コンバージョン率アップを実現。
            </p>

            {/* 特徴カード */}
            <div className="grid md:grid-cols-3 gap-4 mb-12">
              {[
                { icon: <Zap className="w-6 h-6" />, title: '瞬時に生成', desc: '入力から数秒でLP完成' },
                { icon: <Palette className="w-6 h-6" />, title: '自由なスタイル', desc: 'トーンやキャラを選択' },
                { icon: <Download className="w-6 h-6" />, title: 'すぐに使える', desc: 'HTMLでダウンロード' },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="p-6 bg-zinc-800/50 border border-zinc-700/50 rounded-2xl backdrop-blur-sm"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400/20 to-pink-500/20 rounded-xl flex items-center justify-center text-amber-400 mb-4 mx-auto">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-zinc-400">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
            <p className="font-medium">エラーが発生しました</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        <div className={`grid gap-8 ${manga ? 'lg:grid-cols-2' : ''}`}>
          {/* 入力フォーム */}
          <div className={manga ? '' : 'max-w-2xl mx-auto w-full'}>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-gradient-to-br from-amber-400 to-pink-500 rounded-lg flex items-center justify-center text-white text-sm">
                  1
                </span>
                商品情報を入力
              </h2>
              <InputForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>
          </div>

          {/* プレビュー */}
          {manga && (
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center text-white text-sm">
                  2
                </span>
                生成結果
              </h2>
              <MangaPreview
                manga={manga}
                onRegenerate={handleRegenerate}
                isRegenerating={isRegenerating}
                productName={currentInput?.productName}
                productDescription={currentInput?.productDescription}
              />
            </div>
          )}
        </div>
      </main>

      {/* フッター */}
      <footer className="border-t border-zinc-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-zinc-500 text-sm">
          <p>漫画LP Generator - Powered by Nano Banana Pro & Google Gemini</p>
        </div>
      </footer>
    </div>
  );
}
