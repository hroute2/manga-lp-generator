import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { MangaInput, GeneratedManga, MangaPanel } from '@/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const input: MangaInput = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'Gemini API key is not configured' },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const toneDescriptions = {
      comedy: 'コメディタッチで笑いを交えた楽しい雰囲気',
      serious: 'シリアスで真剣な問題提起をする雰囲気',
      heartwarming: 'ほのぼのとした温かい雰囲気',
      exciting: '熱血で情熱的な雰囲気',
    };

    const prompt = `あなたは4コマ漫画のシナリオライターです。以下の商品・サービス情報をもとに、LPで使用する4コマ漫画のシナリオを作成してください。

## 商品・サービス情報
- 商品名: ${input.productName}
- 説明: ${input.productDescription}
- ターゲット顧客: ${input.targetAudience}
- 顧客の課題: ${input.problem}
- 解決策・ベネフィット: ${input.solution}
- 漫画のトーン: ${toneDescriptions[input.tone]}
${input.characterStyle ? `- キャラクタースタイル: ${input.characterStyle}` : ''}

## 4コマ漫画の構成
起承転結の流れで作成してください：
1. 起（導入）: 顧客の課題や困っている状況を描く
2. 承（展開）: 課題がさらに深刻化、または解決策を知る
3. 転（転換）: 商品・サービスを使って状況が変わる
4. 結（結末）: ハッピーエンド、ベネフィットを実感

## 出力形式
以下のJSON形式で出力してください（JSON以外は出力しないでください）：

{
  "title": "漫画のタイトル",
  "panels": [
    {
      "panelNumber": 1,
      "description": "このコマの状況説明（画像生成のための詳細な説明）",
      "dialogue": "キャラクターのセリフ",
      "prompt": "Nano Banana用の英語プロンプト（4koma manga style, panel 1, キャラクター・背景・アクション・表情の詳細な説明）"
    },
    {
      "panelNumber": 2,
      "description": "...",
      "dialogue": "...",
      "prompt": "..."
    },
    {
      "panelNumber": 3,
      "description": "...",
      "dialogue": "...",
      "prompt": "..."
    },
    {
      "panelNumber": 4,
      "description": "...",
      "dialogue": "...",
      "prompt": "..."
    }
  ],
  "ctaText": "行動を促すキャッチコピー（例：今すぐ○○で悩みを解決！）"
}

## プロンプト作成のコツ
- promptは英語で作成
- 「4koma manga style」を必ず含める
- キャラクターの一貫性を保つため、同じキャラクター特徴を全コマで使用
- 表情（happy, sad, surprised, frustrated など）を明確に指定
- 背景やシチュエーションを具体的に記述

JSONのみを出力してください。`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // JSONを抽出（マークダウンコードブロックがある場合に対応）
    let jsonString = text;
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonString = jsonMatch[1].trim();
    }

    const manga: GeneratedManga = JSON.parse(jsonString);

    // パネル番号の型を修正
    manga.panels = manga.panels.map((panel, index) => ({
      ...panel,
      panelNumber: (index + 1) as 1 | 2 | 3 | 4,
    }));

    return NextResponse.json({ success: true, manga });
  } catch (error) {
    console.error('Error generating prompts:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to generate prompts' 
      },
      { status: 500 }
    );
  }
}
