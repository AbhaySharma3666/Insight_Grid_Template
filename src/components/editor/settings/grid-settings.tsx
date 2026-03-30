"use client";

import React from 'react';
import { useEditor } from '@/hooks/use-editor-state';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Trash2, Plus, GripVertical } from 'lucide-react';

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

  const updateColumnWidth = (index: number, val: number) => {
    setCanvasState(prev => {
      const newCols = [...prev.mainGrid.columns];
      newCols[index] = { widthFraction: val };
      return {
        ...prev,
        mainGrid: { ...prev.mainGrid, columns: newCols }
      };
    });
  };

  const removeColumn = (index: number) => {
    setCanvasState(prev => {
      if (prev.mainGrid.columns.length <= 1) return prev;
      const newCols = prev.mainGrid.columns.filter((_, i) => i !== index);
      return {
        ...prev,
        mainGrid: { ...prev.mainGrid, columns: newCols }
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

  const updateRowHeight = (index: number, val: number) => {
    setCanvasState(prev => {
      const newRows = [...prev.mainGrid.rows];
      newRows[index] = { heightFraction: val };
      return {
        ...prev,
        mainGrid: { ...prev.mainGrid, rows: newRows }
      };
    });
  };

  const removeRow = (index: number) => {
    setCanvasState(prev => {
      if (prev.mainGrid.rows.length <= 1) return prev;
      const newRows = prev.mainGrid.rows.filter((_, i) => i !== index);
      return {
        ...prev,
        mainGrid: { ...prev.mainGrid, rows: newRows }
      };
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold">Columns (Width Weights)</Label>
          <Button variant="outline" size="sm" className="h-7 gap-1" onClick={addColumn}>
            <Plus className="w-3 h-3" /> Add
          </Button>
        </div>
        <div className="space-y-4">
          {canvasState.mainGrid.columns.map((col, idx) => (
            <div key={`col-${idx}`} className="space-y-2 bg-muted/30 p-3 rounded-lg border border-dashed">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                  <GripVertical className="w-3 h-3" /> Column {idx + 1}
                </span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 text-destructive hover:bg-destructive/10" 
                  onClick={() => removeColumn(idx)}
                  disabled={canvasState.mainGrid.columns.length <= 1}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <Slider 
                  value={[col.widthFraction * 100]} 
                  min={1} 
                  max={100} 
                  step={1}
                  onValueChange={(val) => updateColumnWidth(idx, val[0] / 100)}
                  className="flex-1"
                />
                <span className="text-[10px] font-mono w-8 text-right">
                  {Math.round(col.widthFraction * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold">Rows (Height Weights)</Label>
          <Button variant="outline" size="sm" className="h-7 gap-1" onClick={addRow}>
            <Plus className="w-3 h-3" /> Add
          </Button>
        </div>
        <div className="space-y-4">
          {canvasState.mainGrid.rows.map((row, idx) => (
            <div key={`row-${idx}`} className="space-y-2 bg-muted/30 p-3 rounded-lg border border-dashed">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                  <GripVertical className="w-3 h-3" /> Row {idx + 1}
                </span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 text-destructive hover:bg-destructive/10" 
                  onClick={() => removeRow(idx)}
                  disabled={canvasState.mainGrid.rows.length <= 1}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <Slider 
                  value={[row.heightFraction * 100]} 
                  min={1} 
                  max={100} 
                  step={1}
                  onValueChange={(val) => updateRowHeight(idx, val[0] / 100)}
                  className="flex-1"
                />
                <span className="text-[10px] font-mono w-8 text-right">
                  {Math.round(row.heightFraction * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6 pt-6 border-t">
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
            <Label>Gap Spacing</Label>
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
