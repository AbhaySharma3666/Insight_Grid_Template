"use client";

import React from 'react';
import { useEditor } from '@/hooks/use-editor-state';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, LayoutGrid } from 'lucide-react';

export function GridSettings() {
  const { canvasState, setCanvasState } = useEditor();

  const addColumn = () => {
    setCanvasState(prev => {
      const newCols = [...prev.mainGrid.columns, { widthFraction: 1 }];
      const total = newCols.length;
      return {
        ...prev,
        mainGrid: {
          ...prev.mainGrid,
          columns: newCols.map(() => ({ widthFraction: 1 / total }))
        }
      };
    });
  };

  const removeColumn = (index: number) => {
    setCanvasState(prev => {
      if (prev.mainGrid.columns.length <= 1) return prev;
      const newCols = prev.mainGrid.columns.filter((_, i) => i !== index);
      const total = newCols.length;
      return {
        ...prev,
        mainGrid: {
          ...prev.mainGrid,
          columns: newCols.map(() => ({ widthFraction: 1 / total }))
        }
      };
    });
  };

  const addRow = () => {
    setCanvasState(prev => {
      const newRows = [...prev.mainGrid.rows, { heightFraction: 1 }];
      const total = newRows.length;
      return {
        ...prev,
        mainGrid: {
          ...prev.mainGrid,
          rows: newRows.map(() => ({ heightFraction: 1 / total }))
        }
      };
    });
  };

  const removeRow = (index: number) => {
    setCanvasState(prev => {
      if (prev.mainGrid.rows.length <= 1) return prev;
      const newRows = prev.mainGrid.rows.filter((_, i) => i !== index);
      const total = newRows.length;
      return {
        ...prev,
        mainGrid: {
          ...prev.mainGrid,
          rows: newRows.map(() => ({ heightFraction: 1 / total }))
        }
      };
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold">Columns</Label>
          <Button variant="outline" size="sm" className="h-7 gap-1" onClick={addColumn}>
            <Plus className="w-3 h-3" /> Add
          </Button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {canvasState.mainGrid.columns.map((col, idx) => (
            <div key={idx} className="flex items-center gap-1 bg-muted rounded px-2 py-1 shrink-0">
              <span className="text-[10px] font-mono text-muted-foreground">Col {idx + 1}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 hover:text-destructive" 
                onClick={() => removeColumn(idx)}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold">Rows</Label>
          <Button variant="outline" size="sm" className="h-7 gap-1" onClick={addRow}>
            <Plus className="w-3 h-3" /> Add
          </Button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {canvasState.mainGrid.rows.map((row, idx) => (
            <div key={idx} className="flex items-center gap-1 bg-muted rounded px-2 py-1 shrink-0">
              <span className="text-[10px] font-mono text-muted-foreground">Row {idx + 1}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 hover:text-destructive" 
                onClick={() => removeRow(idx)}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6 pt-4 border-t">
        <div className="flex items-center justify-between">
          <Label>Shadows</Label>
          <Switch 
            checked={canvasState.mainGrid.hasShadow} 
            onCheckedChange={(val) => setCanvasState(prev => ({ 
              ...prev, 
              mainGrid: { ...prev.mainGrid, hasShadow: val } 
            }))}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label>Borders</Label>
          <Switch 
            checked={canvasState.mainGrid.hasBorder} 
            onCheckedChange={(val) => setCanvasState(prev => ({ 
              ...prev, 
              mainGrid: { ...prev.mainGrid, hasBorder: val } 
            }))}
          />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <Label>Spacing (Gap)</Label>
            <span className="text-xs text-muted-foreground">{canvasState.mainGrid.columnGap}px</span>
          </div>
          <Slider 
            value={[canvasState.mainGrid.columnGap]} 
            min={0} 
            max={50} 
            step={2}
            onValueChange={(val) => setCanvasState(prev => ({ 
              ...prev, 
              mainGrid: { ...prev.mainGrid, columnGap: val[0], rowGap: val[0] } 
            }))}
          />
        </div>
      </div>
    </div>
  );
}