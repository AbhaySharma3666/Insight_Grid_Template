"use client";

import React from 'react';
import { useEditor } from '@/hooks/use-editor-state';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, GripVertical } from 'lucide-react';

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

  const updateSideColumnWidth = (index: number, val: number) => {
    setCanvasState(prev => {
      if (!prev.sidePanel.internalGrid) return prev;
      const newCols = [...prev.sidePanel.internalGrid.columns];
      newCols[index] = { widthFraction: val };
      return {
        ...prev,
        sidePanel: {
          ...prev.sidePanel,
          internalGrid: { ...prev.sidePanel.internalGrid, columns: newCols }
        }
      };
    });
  };

  const removeSideColumn = (index: number) => {
    setCanvasState(prev => {
      if (!prev.sidePanel.internalGrid || prev.sidePanel.internalGrid.columns.length <= 1) return prev;
      const newCols = prev.sidePanel.internalGrid.columns.filter((_, i) => i !== index);
      return {
        ...prev,
        sidePanel: {
          ...prev.sidePanel,
          internalGrid: {
            ...prev.sidePanel.internalGrid,
            columns: newCols
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

  const updateSideRowHeight = (index: number, val: number) => {
    setCanvasState(prev => {
      if (!prev.sidePanel.internalGrid) return prev;
      const newRows = [...prev.sidePanel.internalGrid.rows];
      newRows[index] = { heightFraction: val };
      return {
        ...prev,
        sidePanel: {
          ...prev.sidePanel,
          internalGrid: { ...prev.sidePanel.internalGrid, rows: newRows }
        }
      };
    });
  };

  const removeSideRow = (index: number) => {
    setCanvasState(prev => {
      if (!prev.sidePanel.internalGrid || prev.sidePanel.internalGrid.rows.length <= 1) return prev;
      const newRows = prev.sidePanel.internalGrid.rows.filter((_, i) => i !== index);
      return {
        ...prev,
        sidePanel: {
          ...prev.sidePanel,
          internalGrid: {
            ...prev.sidePanel.internalGrid,
            rows: newRows
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
              <Label>Panel Total Width</Label>
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
              <Label className="text-sm font-semibold">Internal Grid Configuration</Label>
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
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold uppercase text-muted-foreground">Internal Columns</Label>
                    <Button variant="outline" size="sm" className="h-6 px-2 text-[10px] gap-1" onClick={addSideColumn}>
                      <Plus className="w-3 h-3" /> Add
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {canvasState.sidePanel.internalGrid.columns.map((col, idx) => (
                      <div key={`side-col-${idx}`} className="space-y-2 bg-muted/20 p-2 rounded-md border border-dashed">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-mono">Col {idx + 1}</span>
                          <Button variant="ghost" size="icon" className="h-4 w-4 text-destructive" onClick={() => removeSideColumn(idx)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                        <Slider 
                          value={[col.widthFraction * 100]} 
                          min={1} max={100} step={1}
                          onValueChange={(val) => updateSideColumnWidth(idx, val[0] / 100)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold uppercase text-muted-foreground">Internal Rows</Label>
                    <Button variant="outline" size="sm" className="h-6 px-2 text-[10px] gap-1" onClick={addSideRow}>
                      <Plus className="w-3 h-3" /> Add
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {canvasState.sidePanel.internalGrid.rows.map((row, idx) => (
                      <div key={`side-row-${idx}`} className="space-y-2 bg-muted/20 p-2 rounded-md border border-dashed">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-mono">Row {idx + 1}</span>
                          <Button variant="ghost" size="icon" className="h-4 w-4 text-destructive" onClick={() => removeSideRow(idx)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                        <Slider 
                          value={[row.heightFraction * 100]} 
                          min={1} max={100} step={1}
                          onValueChange={(val) => updateSideRowHeight(idx, val[0] / 100)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Grid Shadows</Label>
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
                    <Label className="text-xs">Grid Borders</Label>
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
