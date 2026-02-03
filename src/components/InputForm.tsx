'use client';

import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import type { MangaInput } from '@/types';

interface InputFormProps {
  onSubmit: (input: MangaInput) => void;
  isLoading: boolean;
}

export default function InputForm({ onSubmit, isLoading }: InputFormProps) {
  const [formData, setFormData] = useState<MangaInput>({
    productName: '',
    productDescription: '',
    targetAudience: '',
    problem: '',
    solution: '',
    tone: 'comedy',
    characterStyle: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const toneOptions = [
    { value: 'comedy', label: '🤣 コメディ', description: '笑いを交えて楽しく' },
    { value: 'serious', label: '😤 シリアス', description: '真剣に問題提起' },
    { value: 'heartwarming', label: '🥰 ほのぼの', description: '温かい雰囲気で' },
    { value: 'exciting', label: '🔥 熱血', description: '情熱的に訴求' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 商品・サービス情報 */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-amber-400 border-b border-amber-400/30 pb-2">
          📦 商品・サービス情報
        </h3>
        
        <div>
          <label htmlFor="productName" className="block text-sm font-medium text-zinc-300 mb-1">
            商品・サービス名 <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            required
            placeholder="例: AIチャットボット「サポートくん」"
            className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all"
          />
        </div>

        <div>
          <label htmlFor="productDescription" className="block text-sm font-medium text-zinc-300 mb-1">
            商品・サービスの説明 <span className="text-red-400">*</span>
          </label>
          <textarea
            id="productDescription"
            name="productDescription"
            value={formData.productDescription}
            onChange={handleChange}
            required
            rows={3}
            placeholder="例: 24時間対応のAIチャットボットで、カスタマーサポートを自動化。問い合わせ対応時間を80%削減できます。"
            className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all resize-none"
          />
        </div>
      </div>

      {/* ターゲット設定 */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-cyan-400 border-b border-cyan-400/30 pb-2">
          🎯 ターゲット設定
        </h3>

        <div>
          <label htmlFor="targetAudience" className="block text-sm font-medium text-zinc-300 mb-1">
            ターゲット顧客 <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="targetAudience"
            name="targetAudience"
            value={formData.targetAudience}
            onChange={handleChange}
            required
            placeholder="例: 中小企業の経営者、カスタマーサポート担当者"
            className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all"
          />
        </div>

        <div>
          <label htmlFor="problem" className="block text-sm font-medium text-zinc-300 mb-1">
            顧客が抱える問題 <span className="text-red-400">*</span>
          </label>
          <textarea
            id="problem"
            name="problem"
            value={formData.problem}
            onChange={handleChange}
            required
            rows={2}
            placeholder="例: 問い合わせ対応に時間がかかり、本業に集中できない"
            className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all resize-none"
          />
        </div>

        <div>
          <label htmlFor="solution" className="block text-sm font-medium text-zinc-300 mb-1">
            解決方法・ベネフィット <span className="text-red-400">*</span>
          </label>
          <textarea
            id="solution"
            name="solution"
            value={formData.solution}
            onChange={handleChange}
            required
            rows={2}
            placeholder="例: AIが24時間自動で対応、人件費削減、顧客満足度向上"
            className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all resize-none"
          />
        </div>
      </div>

      {/* 漫画スタイル設定 */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-pink-400 border-b border-pink-400/30 pb-2">
          🎨 漫画スタイル設定
        </h3>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-3">
            漫画のトーン <span className="text-red-400">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {toneOptions.map((option) => (
              <label
                key={option.value}
                className={`relative flex flex-col p-4 cursor-pointer rounded-xl border-2 transition-all ${
                  formData.tone === option.value
                    ? 'border-pink-400 bg-pink-400/10'
                    : 'border-zinc-700 bg-zinc-800/30 hover:border-zinc-600'
                }`}
              >
                <input
                  type="radio"
                  name="tone"
                  value={option.value}
                  checked={formData.tone === option.value}
                  onChange={handleChange}
                  className="sr-only"
                />
                <span className="text-lg font-bold text-white">{option.label}</span>
                <span className="text-xs text-zinc-400 mt-1">{option.description}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="characterStyle" className="block text-sm font-medium text-zinc-300 mb-1">
            キャラクタースタイル（任意）
          </label>
          <input
            type="text"
            id="characterStyle"
            name="characterStyle"
            value={formData.characterStyle}
            onChange={handleChange}
            placeholder="例: 可愛い女の子、ビジネスマン、動物キャラ"
            className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:border-pink-400 transition-all"
          />
        </div>
      </div>

      {/* 送信ボタン */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 px-6 bg-gradient-to-r from-amber-500 via-pink-500 to-purple-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            漫画を生成中...
          </>
        ) : (
          <>
            <Sparkles className="w-6 h-6" />
            4コマ漫画LPを生成する
          </>
        )}
      </button>
    </form>
  );
}
