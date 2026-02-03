// ユーザー入力の型定義
export interface MangaInput {
  productName: string;
  productDescription: string;
  targetAudience: string;
  problem: string;
  solution: string;
  tone: 'comedy' | 'serious' | 'heartwarming' | 'exciting';
  characterStyle: string;
}

// 4コマ漫画の各コマの型定義
export interface MangaPanel {
  panelNumber: 1 | 2 | 3 | 4;
  description: string;
  dialogue: string;
  prompt: string;
  imageUrl?: string;
}

// 生成された漫画全体の型定義
export interface GeneratedManga {
  title: string;
  panels: MangaPanel[];
  ctaText: string;
  ctaUrl?: string;
}

// API レスポンスの型定義
export interface GeneratePromptsResponse {
  success: boolean;
  manga?: GeneratedManga;
  error?: string;
}

export interface GenerateMangaResponse {
  success: boolean;
  panels?: MangaPanel[];
  error?: string;
}

// Nano Banana API レスポンス（想定）
export interface NanoBananaResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
}
