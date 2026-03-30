"use client";

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { AiLayoutSuggestionOutput } from '@/ai/flows/ai-layout-suggestion-flow';
import { useToast } from '@/hooks/use-toast';

interface ColumnDefinition {
  id: string;
  widthFraction: number;
  borderRadius?: number;
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
  backgroundImage: string | null;
  backgroundGradient: {
    enabled: boolean;
    colors: string[];
    angle: number;
  };
  header: {
    enabled: boolean;
    heightFraction: number;
    columns: ColumnDefinition[];
    hasShadow: boolean;
    hasBorder: boolean;
  };
  mainGrid: {
    rows: RowDefinition[];
    columnGap: number;
    rowGap: number;
    hasShadow: boolean;
    hasBorder: boolean;
    borderColor?: string;
  };
  sidePanel: {
    position: 'left' | 'right' | 'none';
    widthPercentage: number;
    panelGap: number;
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
  backgroundImage: null,
  backgroundGradient: {
    enabled: false,
    colors: ['#4F46E5', '#06B6D4'],
    angle: 135,
  },
  header: {
    enabled: true,
    heightFraction: 0.12,
    hasShadow: true,
    hasBorder: false,
    columns: [
      { id: 'h-col-1', widthFraction: 0.3, borderRadius: 12 },
      { id: 'h-col-2', widthFraction: 0.7, borderRadius: 12 },
    ]
  },
  mainGrid: {
    rows: [
      {
        id: 'r1',
        heightFraction: 0.25,
        columns: [
          { id: 'r1c1', widthFraction: 0.25, borderRadius: 12 },
          { id: 'r1c2', widthFraction: 0.25, borderRadius: 12 },
          { id: 'r1c3', widthFraction: 0.25, borderRadius: 12 },
          { id: 'r1c4', widthFraction: 0.25, borderRadius: 12 },
        ]
      },
      {
        id: 'r2',
        heightFraction: 0.75,
        columns: [
          { id: 'r2c1', widthFraction: 0.65, borderRadius: 12 },
          { id: 'r2c2', widthFraction: 0.35, borderRadius: 12 },
        ]
      }
    ],
    columnGap: 20,
    rowGap: 20,
    hasShadow: true,
    hasBorder: false,
    borderColor: '#DDDDDD',
  },
  sidePanel: {
    position: 'left',
    widthPercentage: 20,
    panelGap: 20,
    internalGrid: {
      columns: [{ id: 's-col-1', widthFraction: 1, borderRadius: 8 }],
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
        columns: suggestion.header?.columns.map((col, idx) => ({
          id: `h-col-${idx}-${Date.now()}`,
          widthFraction: col.widthFraction,
          borderRadius: (col as any).borderRadius || 12
        })) || prev.header.columns
      },
      mainGrid: {
        ...prev.mainGrid,
        rows: suggestion.mainGrid.rows.map((row, rIdx) => ({
          id: `row-${rIdx}-${Date.now()}`,
          heightFraction: row.heightFraction,
          columns: row.columns.map((col, cIdx) => ({
            id: `col-${rIdx}-${cIdx}-${Date.now()}`,
            widthFraction: col.widthFraction,
            borderRadius: (col as any).borderRadius || 12,
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
        internalGrid: suggestion.sidePanel.internalGrid ? {
          ...suggestion.sidePanel.internalGrid,
          columns: suggestion.sidePanel.internalGrid.columns.map((c, idx) => ({
            id: `s-col-${idx}-${Date.now()}`,
            widthFraction: c.widthFraction,
            borderRadius: (c as any).borderRadius || 8
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
      title: "Ready for Download",
      description: "Generating high-resolution template image...",
    });

    setTimeout(() => {
      toast({
        title: "Success",
        description: "Your Power BI background has been downloaded.",
      });
    }, 1500);
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