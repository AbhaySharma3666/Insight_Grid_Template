"use client";

import React from 'react';
import { useEditor } from '@/hooks/use-editor-state';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

export function SidePanelSettings() {
  const { canvasState, setCanvasState } = useEditor();

  const addSideColumn = () => {
    setCanvasState(prev => {
      const currentGrid = prev.sidePanel.internalGrid || {
        columns: [{ widthFraction: 1 }],
        rows: Array(3).fill(null).map(() => ({ heightFraction: 1/3 })),
        columnGap: 10,
        rowGap: 10,
        hasShadow: false,
        hasBorder: true,
      };
      const newCols = [...currentGrid.columns, { widthFraction: 1 }];
      const total = newCols.length;
      return {
        ...prev,
        sidePanel: {
          ...prev.sidePanel,
          internalGrid: {
            ...currentGrid,
            columns: newCols.map(() => ({ widthFraction: 1 / total }))
          }
        }
      };
    });
  };

  const removeSideColumn = (index: number) => {
    setCanvasState(prev => {
      if (!prev.sidePanel.internalGrid || prev.sidePanel.internalGrid.columns.length <= 1) return prev;
      const newCols = prev.sidePanel.internalGrid.columns.filter((_, i) => i !== index);
      const total = newCols.length;
      return {
        ...prev,
        sidePanel: {
          ...prev.sidePanel,
          internalGrid: {
            ...prev.sidePanel.internalGrid,
            columns: newCols.map(() => ({ widthFraction: 1 / total }))
          }
        }
      };
    });
  };

  const addSideRow = () => {
    setCanvasState(prev => {
      const currentGrid = prev.sidePanel.internalGrid || {
        columns: [{ widthFraction: 1 }],
        rows: Array(3).fill(null).map(() => ({ heightFraction: 1/3 })),
        columnGap: 10,
        rowGap: 10,
        hasShadow: false,
        hasBorder: true,
      };
      const newRows = [...currentGrid.rows, { heightFraction: 1 }];
      const total = newRows.length;
      return {
        ...prev,
        sidePanel: {
          ...prev.sidePanel,
          internalGrid: {
            ...currentGrid,
            rows: newRows.map(() => ({ heightFraction: 1 / total }))
          }
        }
      };
    });
  };

  const removeSideRow = (index: number) => {
    setCanvasState(prev => {
      if (!prev.sidePanel.internalGrid || prev.sidePanel.internalGrid.rows.length <= 1) return prev;
      const newRows = prev.sidePanel.internalGrid.rows.filter((_, i) => i !== index);
      const total = newRows.length;
      return {
        ...prev,
        sidePanel: {
          ...prev.sidePanel,
          internalGrid: {
            ...prev.sidePanel.internalGrid,
            rows: newRows.map(() => ({ heightFraction: 1 / total }))
          }
        }
      };
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-3">
        <Label>Position</Label>
        <RadioGroup 
          value={canvasState.sidePanel.position} 
          onValueChange={(val: any) => setCanvasState(prev => ({ 
            ...prev, 
            sidePanel: { ...prev.sidePanel, position: val } 
          }))}
          className="grid grid-cols-3 gap-2"
        >
          <div>
            <RadioGroupItem value="left" id="pos-left" className="peer sr-only" />
            <Label
              htmlFor="pos-left"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
            >
              <span className="text-xs font-semibold">Left</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="right" id="pos-right" className="peer sr-only" />
            <Label
              htmlFor="pos-right"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
            >
              <span className="text-xs font-semibold">Right</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="none" id="pos-none" className="peer sr-only" />
            <Label
              htmlFor="pos-none"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
            >
              <span className="text-xs font-semibold">None</span>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {canvasState.sidePanel.position !== 'none' && (
        <>
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Panel Width</Label>
              <span className="text-xs text-muted-foreground">{canvasState.sidePanel.widthPercentage}%</span>
            </div>
            <Slider 
              value={[canvasState.sidePanel.widthPercentage]} 
              min={10} 
              max={40} 
              step={1}
              onValueChange={(val) => setCanvasState(prev => ({ 
                ...prev, 
                sidePanel: { ...prev.sidePanel, widthPercentage: val[0] } 
              }))}
            />
          </div>

          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Internal Grid</Label>
              <Switch 
                checked={!!canvasState.sidePanel.internalGrid} 
                onCheckedChange={(val) => setCanvasState(prev => ({ 
                  ...prev, 
                  sidePanel: { 
                    ...prev.sidePanel, 
                    internalGrid: val ? {
                      columns: [{ widthFraction: 1 }],
                      rows: Array(5).fill(null).map(() => ({ heightFraction: 0.2 })),
                      columnGap: 10,
                      rowGap: 10,
                      hasShadow: false,
                      hasBorder: true,
                    } : undefined
                  } 
                }))}
              />
            </div>

            {canvasState.sidePanel.internalGrid && (
              <div className="space-y-6 pt-2">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium text-muted-foreground">Columns</Label>
                    <Button variant="outline" size="sm" className="h-6 px-2 text-[10px] gap-1" onClick={addSideColumn}>
                      <Plus className="w-3 h-3" /> Add
                    </Button>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {canvasState.sidePanel.internalGrid.columns.map((_, idx) => (
                      <div key={idx} className="flex items-center gap-1 bg-muted rounded px-2 py-0.5 shrink-0 border">
                        <span className="text-[10px] font-mono text-muted-foreground">C{idx + 1}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-3 w-3 hover:text-destructive" 
                          onClick={() => removeSideColumn(idx)}
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium text-muted-foreground">Rows</Label>
                    <Button variant="outline" size="sm" className="h-6 px-2 text-[10px] gap-1" onClick={addSideRow}>
                      <Plus className="w-3 h-3" /> Add
                    </Button>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {canvasState.sidePanel.internalGrid.rows.map((_, idx) => (
                      <div key={idx} className="flex items-center gap-1 bg-muted rounded px-2 py-0.5 shrink-0 border">
                        <span className="text-[10px] font-mono text-muted-foreground">R{idx + 1}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-3 w-3 hover:text-destructive" 
                          onClick={() => removeSideRow(idx)}
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Shadows</Label>
                    <Switch 
                      checked={canvasState.sidePanel.internalGrid.hasShadow} 
                      onCheckedChange={(val) => setCanvasState(prev => ({ 
                        ...prev, 
                        sidePanel: { 
                          ...prev.sidePanel, 
                          internalGrid: prev.sidePanel.internalGrid ? { ...prev.sidePanel.internalGrid, hasShadow: val } : undefined
                        } 
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Borders</Label>
                    <Switch 
                      checked={canvasState.sidePanel.internalGrid.hasBorder} 
                      onCheckedChange={(val) => setCanvasState(prev => ({ 
                        ...prev, 
                        sidePanel: { 
                          ...prev.sidePanel, 
                          internalGrid: prev.sidePanel.internalGrid ? { ...prev.sidePanel.internalGrid, hasBorder: val } : undefined
                        } 
                      }))}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
