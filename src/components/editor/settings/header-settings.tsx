"use client";

import React from 'react';
import { useEditor } from '@/hooks/use-editor-state';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Columns } from 'lucide-react';

export function HeaderSettings() {
  const { canvasState, setCanvasState } = useEditor();

  const addColumn = () => {
    setCanvasState(prev => {
      const newCols = [...prev.header.columns, { id: `h-col-${Date.now()}`, widthFraction: 1, borderRadius: 12 }];
      const total = newCols.length;
      return {
        ...prev,
        header: {
          ...prev.header,
          columns: newCols.map(col => ({ ...col, widthFraction: 1 / total }))
        }
      };
    });
  };

  const updateColumnProperty = (index: number, key: string, val: any) => {
    setCanvasState(prev => {
      const newCols = [...prev.header.columns];
      newCols[index] = { ...newCols[index], [key]: val };
      return {
        ...prev,
        header: { ...prev.header, columns: newCols }
      };
    });
  };

  const removeColumn = (index: number) => {
    setCanvasState(prev => {
      if (prev.header.columns.length <= 1) return prev;
      const newCols = prev.header.columns.filter((_, i) => i !== index);
      const total = newCols.length;
      return {
        ...prev,
        header: {
          ...prev.header,
          columns: newCols.map(col => ({ ...col, widthFraction: 1 / total }))
        }
      };
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between bg-muted/30 p-3 rounded-lg border">
        <div className="space-y-0.5">
          <Label className="text-sm font-bold">Enable Header Row</Label>
          <p className="text-[10px] text-muted-foreground">Add a persistent header area at the top</p>
        </div>
        <Switch 
          checked={canvasState.header.enabled}
          onCheckedChange={(val) => setCanvasState(prev => ({
            ...prev,
            header: { ...prev.header, enabled: val }
          }))}
        />
      </div>

      {canvasState.header.enabled && (
        <>
          <div className="space-y-4 pt-2">
            <div className="flex justify-between">
              <Label>Header Height Weight</Label>
              <span className="text-xs font-mono">{Math.round(canvasState.header.heightFraction * 100)}%</span>
            </div>
            <Slider 
              value={[canvasState.header.heightFraction * 100]} 
              min={5} max={30} step={1}
              onValueChange={(val) => setCanvasState(prev => ({
                ...prev,
                header: { ...prev.header, heightFraction: val[0] / 100 }
              }))}
            />
          </div>

          <div className="pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Columns className="w-4 h-4 text-primary" />
                <Label className="font-semibold">Header Columns</Label>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1" onClick={addColumn}>
                <Plus className="w-3 h-3" /> Add
              </Button>
            </div>

            <div className="space-y-4">
              {canvasState.header.columns.map((col, idx) => (
                <div key={col.id} className="p-4 bg-muted/20 border rounded-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground">Column {idx + 1}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-5 w-5 text-destructive"
                      onClick={() => removeColumn(idx)}
                      disabled={canvasState.header.columns.length <= 1}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-[9px] uppercase">Width Weight</Label>
                      <span className="text-[9px] font-mono">{Math.round(col.widthFraction * 100)}%</span>
                    </div>
                    <Slider 
                      value={[col.widthFraction * 100]} 
                      min={1} max={100} step={1}
                      onValueChange={(val) => updateColumnProperty(idx, 'widthFraction', val[0] / 100)}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-[9px] uppercase">Radius</Label>
                      <span className="text-[9px] font-mono">{col.borderRadius || 0}px</span>
                    </div>
                    <Slider 
                      value={[col.borderRadius || 0]} 
                      min={0} max={60} step={1}
                      onValueChange={(val) => updateColumnProperty(idx, 'borderRadius', val[0])}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Show Shadows</Label>
              <Switch 
                checked={canvasState.header.hasShadow}
                onCheckedChange={(val) => setCanvasState(prev => ({
                  ...prev,
                  header: { ...prev.header, hasShadow: val }
                }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-xs">Show Border</Label>
              <Switch 
                checked={canvasState.header.hasBorder}
                onCheckedChange={(val) => setCanvasState(prev => ({
                  ...prev,
                  header: { ...prev.header, hasBorder: val }
                }))}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
