import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { MangaPanel } from '@/types';

// Gemini API for image generation
const GEMINI_IMAGE_API_KEY = process.env.NANO_BANANA_API_KEY || process.env.GEMINI_API_KEY;

interface GenerateMangaRequest {
  panels: MangaPanel[];
  regeneratePanelNumber?: number;
}

async function generateImageWithGemini(prompt: string): Promise<string | null> {
  if (!GEMINI_IMAGE_API_KEY) {
    console.error('Gemini API key is not configured for image generation');
    return null;
  }

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_IMAGE_API_KEY);
    
    // Gemini 2.0 Flash Image Generation Experimental
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp-image-generation',
      generationConfig: {
        // @ts-expect-error - responseModalities is a valid config for image generation
        responseModalities: ['IMAGE', 'TEXT'],
      },
    });

    const enhancedPrompt = `Create a manga panel illustration:

${prompt}

Art style: Japanese manga, clean black ink lines, halftone screentones, expressive anime characters, dynamic poses.
Format: Single panel, square aspect ratio, no text or speech bubbles.`;

    console.log('Calling Gemini with prompt:', enhancedPrompt.substring(0, 100) + '...');
    
    const result = await model.generateContent(enhancedPrompt);
    const response = result.response;
    
    console.log('Response received, checking for images...');
    
    // Check for inline images in the response
    const candidates = response.candidates;
    if (candidates && candidates[0]?.content?.parts) {
      for (const part of candidates[0].content.parts) {
        // @ts-expect-error - inlineData exists on image parts
        if (part.inlineData) {
          // @ts-expect-error - accessing inlineData properties
          const base64Data = part.inlineData.data;
          // @ts-expect-error - accessing inlineData properties
          const mimeType = part.inlineData.mimeType || 'image/png';
          console.log('✓ Image found! MIME type:', mimeType);
          return `data:${mimeType};base64,${base64Data}`;
        }
      }
    }

    // Log what we got instead
    try {
      const text = response.text();
      console.log('No image found. Text response:', text?.substring(0, 200));
    } catch {
      console.log('No text response either');
    }
    
    return null;
  } catch (error) {
    console.error('Error generating image with Gemini:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { panels, regeneratePanelNumber }: GenerateMangaRequest = await request.json();

    if (!GEMINI_IMAGE_API_KEY) {
      console.warn('API key not set. Returning panels without images.');
      
      const updatedPanels = panels.map(panel => ({
        ...panel,
        imageUrl: panel.imageUrl || undefined,
      }));

      return NextResponse.json({ 
        success: true, 
        panels: updatedPanels,
        warning: 'API key not configured. Images not generated.'
      });
    }

    // 特定のパネルのみ再生成する場合
    if (regeneratePanelNumber) {
      const panelToRegenerate = panels.find(p => p.panelNumber === regeneratePanelNumber);
      if (!panelToRegenerate) {
        return NextResponse.json(
          { success: false, error: 'Panel not found' },
          { status: 400 }
        );
      }

      const imageUrl = await generateImageWithGemini(panelToRegenerate.prompt);
      
      const updatedPanels = panels.map(panel => 
        panel.panelNumber === regeneratePanelNumber
          ? { ...panel, imageUrl: imageUrl || panel.imageUrl }
          : panel
      );

      return NextResponse.json({ success: true, panels: updatedPanels });
    }

    // 全パネルを順番に生成
    const generatedPanels: MangaPanel[] = [];
    
    for (const panel of panels) {
      console.log(`\n=== Generating image for panel ${panel.panelNumber} ===`);
      console.log('Prompt:', panel.prompt.substring(0, 100) + '...');
      
      const imageUrl = await generateImageWithGemini(panel.prompt);
      
      if (imageUrl) {
        console.log(`✓ Panel ${panel.panelNumber}: Image generated successfully`);
      } else {
        console.log(`✗ Panel ${panel.panelNumber}: No image generated`);
      }
      
      generatedPanels.push({
        ...panel,
        imageUrl: imageUrl || undefined,
      });
      
      // レート制限を避けるため待機
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    return NextResponse.json({ success: true, panels: generatedPanels });
  } catch (error) {
    console.error('Error generating manga:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to generate manga' 
      },
      { status: 500 }
    );
  }
}
