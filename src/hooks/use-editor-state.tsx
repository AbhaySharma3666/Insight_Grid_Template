
"use client";

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { AiLayoutSuggestionOutput } from '@/ai/flows/ai-layout-suggestion-flow';
import { useToast } from '@/hooks/use-toast';
import { toPng } from 'html-to-image';

export interface ColumnDefinition {
  id: string;
  widthFraction: number;
  borderRadius?: number;
  opacity?: number;
  backgroundColor?: string;
  // Freeform properties (percentages 0-100)
  x?: number;
  y?: number;
  w?: number;
  h?: number;
}

interface RowDefinition {
  id: string;
  heightFraction: number;
  columns: ColumnDefinition[];
}

interface CanvasState {
  aspectRatio: string;
  layoutType: 'grid' | 'freeform' | 'autofit';
  backgroundColor: string;
  canvasPadding: number;
  layoutGap: number; // Space between Header and Body
  backgroundImage: string | null;
  backgroundGradient: {
    enabled: boolean;
    colors: string[];
    angle: number;
  };
  header: {
    enabled: boolean;
    heightFraction: number;
    columnGap: number;
    columns: ColumnDefinition[];
    hasShadow: boolean;
    hasBorder: boolean;
    colorMode: 'section' | 'individual';
    sectionColor: string;
  };
  mainGrid: {
    rows: RowDefinition[];
    columnGap: number;
    rowGap: number;
    hasShadow: boolean;
    hasBorder: boolean;
    borderColor?: string;
    colorMode: 'section' | 'individual';
    sectionColor: string;
  };
  sidePanel: {
    position: 'left' | 'right' | 'none';
    widthPercentage: number;
    panelGap: number;
    opacity: number;
    colorMode: 'section' | 'individual';
    sectionColor: string;
    internalGrid?: {
      columns: ColumnDefinition[];
      rows: { heightFraction: number }[];
      columnGap: number;
      rowGap: number;
      hasShadow: boolean;
      hasBorder: boolean;
      borderColor?: string;
    };
  };
}

const DEFAULT_STATE: CanvasState = {
  aspectRatio: '16:9',
  layoutType: 'grid',
  backgroundColor: '#ECF0F7',
  canvasPadding: 24,
  layoutGap: 20,
  backgroundImage: null,
  backgroundGradient: {
    enabled: false,
    colors: ['#4F46E5', '#06B6D4'],
    angle: 135,
  },
  header: {
    enabled: true,
    heightFraction: 0.12,
    columnGap: 20,
    hasShadow: true,
    hasBorder: false,
    colorMode: 'individual',
    sectionColor: 'rgba(255,255,255,0.9)',
    columns: [
      { id: 'h-col-1', widthFraction: 0.3, borderRadius: 12, opacity: 1, backgroundColor: 'rgba(255,255,255,0.9)' },
      { id: 'h-col-2', widthFraction: 0.7, borderRadius: 12, opacity: 1, backgroundColor: 'rgba(255,255,255,0.9)' },
    ]
  },
  mainGrid: {
    rows: [
      {
        id: 'r1',
        heightFraction: 0.25,
        columns: [
          { id: 'r1c1', widthFraction: 0.25, borderRadius: 12, opacity: 1, backgroundColor: 'rgba(255,255,255,0.7)', x: 0, y: 0, w: 23, h: 25 },
          { id: 'r1c2', widthFraction: 0.25, borderRadius: 12, opacity: 1, backgroundColor: 'rgba(255,255,255,0.7)', x: 25, y: 0, w: 23, h: 25 },
          { id: 'r1c3', widthFraction: 0.25, borderRadius: 12, opacity: 1, backgroundColor: 'rgba(255,255,255,0.7)', x: 50, y: 0, w: 23, h: 25 },
          { id: 'r1c4', widthFraction: 0.25, borderRadius: 12, opacity: 1, backgroundColor: 'rgba(255,255,255,0.7)', x: 75, y: 0, w: 25, h: 25 },
        ]
      },
      {
        id: 'r2',
        heightFraction: 0.75,
        columns: [
          { id: 'r2c1', widthFraction: 0.65, borderRadius: 12, opacity: 1, backgroundColor: 'rgba(255,255,255,0.7)', x: 0, y: 30, w: 63, h: 70 },
          { id: 'r2c2', widthFraction: 0.35, borderRadius: 12, opacity: 1, backgroundColor: 'rgba(255,255,255,0.7)', x: 65, y: 30, w: 35, h: 70 },
        ]
      }
    ],
    columnGap: 20,
    rowGap: 20,
    hasShadow: true,
    hasBorder: false,
    borderColor: '#DDDDDD',
    colorMode: 'individual',
    sectionColor: 'rgba(255,255,255,0.7)',
  },
  sidePanel: {
    position: 'left',
    widthPercentage: 20,
    panelGap: 20,
    opacity: 0.4,
    colorMode: 'individual',
    sectionColor: 'rgba(255,255,255,0.8)',
    internalGrid: {
      columns: [{ id: 's-col-1', widthFraction: 1, borderRadius: 8, opacity: 1, backgroundColor: 'rgba(255,255,255,0.8)' }],
      rows: Array(5).fill(null).map(() => ({ heightFraction: 0.2 })),
      columnGap: 10,
      rowGap: 10,
      hasShadow: false,
      hasBorder: false,
    },
  },
};

interface EditorContextType {
  canvasState: CanvasState;
  setCanvasState: React.Dispatch<React.SetStateAction<CanvasState>>;
  applyAiSuggestion: (suggestion: AiLayoutSuggestionOutput) => void;
  exportCanvas: () => void;
  setCanvasRef: (ref: HTMLDivElement | null) => void;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [canvasState, setCanvasState] = useState<CanvasState>(DEFAULT_STATE);
  const [zoom, setZoom] = useState(1);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();

  const setCanvasRef = useCallback((ref: HTMLDivElement | null) => {
    canvasRef.current = ref;
  }, []);

  const applyAiSuggestion = useCallback((suggestion: AiLayoutSuggestionOutput) => {
    setCanvasState(prev => ({
      ...prev,
      aspectRatio: suggestion.canvas.aspectRatio,
      backgroundColor: suggestion.canvas.backgroundColor,
      layoutType: (suggestion as any).layoutType || 'grid',
      header: {
        ...prev.header,
        enabled: !!suggestion.header,
        heightFraction: suggestion.header?.heightFraction || 0.12,
        columnGap: prev.header.columnGap,
        colorMode: 'individual',
        columns: suggestion.header?.columns.map((col, idx) => ({
          id: `h-col-${idx}-${Date.now()}`,
          widthFraction: col.widthFraction,
          borderRadius: (col as any).borderRadius || 12,
          opacity: 1,
          backgroundColor: 'rgba(255,255,255,0.9)'
        })) || prev.header.columns
      },
      mainGrid: {
        ...prev.mainGrid,
        colorMode: 'individual',
        rows: suggestion.mainGrid.rows.map((row, rIdx) => ({
          id: `row-${rIdx}-${Date.now()}`,
          heightFraction: row.heightFraction,
          columns: row.columns.map((col, cIdx) => ({
            id: `col-${rIdx}-${cIdx}-${Date.now()}`,
            widthFraction: col.widthFraction,
            borderRadius: (col as any).borderRadius || 12,
            opacity: 1,
            backgroundColor: 'rgba(255,255,255,0.7)',
            x: cIdx * (100 / row.columns.length),
            y: rIdx * (100 / suggestion.mainGrid.rows.length),
            w: 100 / row.columns.length - 2,
            h: 100 / suggestion.mainGrid.rows.length - 2,
          }))
        })),
        columnGap: suggestion.mainGrid.columnGap,
        rowGap: suggestion.mainGrid.rowGap,
        hasShadow: suggestion.mainGrid.hasShadow,
        hasBorder: suggestion.mainGrid.hasBorder,
        borderColor: suggestion.mainGrid.borderColor,
      },
      sidePanel: {
        ...prev.sidePanel,
        position: suggestion.sidePanel.position,
        widthPercentage: suggestion.sidePanel.widthPercentage || 20,
        panelGap: suggestion.sidePanel.panelGap || 20,
        opacity: prev.sidePanel.opacity,
        colorMode: 'individual',
        internalGrid: suggestion.sidePanel.internalGrid ? {
          ...suggestion.sidePanel.internalGrid,
          columns: suggestion.sidePanel.internalGrid.columns.map((c, idx) => ({
            id: `s-col-${idx}-${Date.now()}`,
            widthFraction: c.widthFraction,
            borderRadius: (c as any).borderRadius || 8,
            opacity: 1,
            backgroundColor: 'rgba(255,255,255,0.8)'
          }))
        } : undefined,
      },
    }));
    
    toast({
      title: "Layout Applied",
      description: suggestion.description,
    });
  }, [toast]);

  const exportCanvas = useCallback(async () => {
    if (!canvasRef.current) return;
    
    toast({
      title: "Generating Download",
      description: "Processing high-resolution image...",
    });

    try {
      const originalTransform = canvasRef.current.style.transform;
      canvasRef.current.style.transform = 'none';
      
      const dataUrl = await toPng(canvasRef.current, {
        pixelRatio: 2,
        cacheBust: true,
      });
      
      canvasRef.current.style.transform = originalTransform;

      const link = document.createElement('a');
      link.download = `power-bi-background-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      toast({
        title: "Success",
        description: "Your template has been downloaded.",
      });
    } catch (err) {
      console.error('Export failed', err);
      toast({
        title: "Export Failed",
        description: "Could not generate the image. Please try again.",
        variant: "destructive"
      });
    }
  }, [toast]);

  return (
    <EditorContext.Provider value={{ 
      canvasState, 
      setCanvasState, 
      applyAiSuggestion, 
      exportCanvas,
      setCanvasRef,
      zoom,
      setZoom
    }}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
}
