"use client";

import React from 'react';
import { useEditor } from '@/hooks/use-editor-state';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Palette, Maximize } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function SidePanelSettings() {
  const { canvasState, setCanvasState } = useEditor();

  const addSideColumn = () => {
    setCanvasState(prev => {
      const currentGrid = prev.sidePanel.internalGrid || {
        columns: [{ id: `s-col-${Date.now()}`, widthFraction: 1, borderRadius: 8, opacity: 1, backgroundColor: 'rgba(255,255,255,0.8)' }],
        rows: Array(3).fill(null).map(() => ({ heightFraction: 1/3 })),
        columnGap: 10,
        rowGap: 10,
        hasShadow: false,
        hasBorder: true,
      };
      const newCols = [...currentGrid.columns, { id: `s-col-${Date.now()}`, widthFraction: 1, borderRadius: 8, opacity: 1, backgroundColor: 'rgba(255,255,255,0.8)' }];
      const total = newCols.length;
      return {
        ...prev,
        sidePanel: {
          ...prev.sidePanel,
          internalGrid: {
            ...currentGrid,
            columns: newCols.map(c => ({ ...c, widthFraction: 1 / total }))
          }
        }
      };
    });
  };

  const updateSideColumnProperty = (index: number, key: string, val: any) => {
    setCanvasState(prev => {
      if (!prev.sidePanel.internalGrid) return prev;
      const newCols = [...prev.sidePanel.internalGrid.columns];
      newCols[index] = { ...newCols[index], [key]: val };
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
        columns: [{ id: `s-col-${Date.now()}`, widthFraction: 1, borderRadius: 8, opacity: 1, backgroundColor: 'rgba(255,255,255,0.8)' }],
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
            rows: newRows.map(r => ({ ...r, heightFraction: 1 / total }))
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
          <div className="space-y-4 bg-muted/20 p-3 rounded-lg border">
            <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Color Strategy</Label>
            <Tabs 
              value={canvasState.sidePanel.colorMode} 
              onValueChange={(val: any) => setCanvasState(prev => ({
                ...prev,
                sidePanel: { ...prev.sidePanel, colorMode: val }
              }))}
            >
              <TabsList className="grid grid-cols-2 h-8">
                <TabsTrigger value="section" className="text-[10px]">Whole Section</TabsTrigger>
                <TabsTrigger value="individual" className="text-[10px]">Individual Cell</TabsTrigger>
              </TabsList>
            </Tabs>

            {canvasState.sidePanel.colorMode === 'section' && (
              <div className="space-y-2 pt-2 animate-fade-in">
                <Label className="text-[9px] uppercase font-bold text-primary">Side Panel Color</Label>
                <div className="flex gap-2">
                  <Input 
                    type="color" 
                    value={canvasState.sidePanel.sectionColor} 
                    onChange={(e) => setCanvasState(prev => ({
                      ...prev,
                      sidePanel: { ...prev.sidePanel, sectionColor: e.target.value }
                    }))}
                    className="w-8 h-8 p-1 cursor-pointer"
                  />
                  <Input 
                    type="text" 
                    value={canvasState.sidePanel.sectionColor} 
                    onChange={(e) => setCanvasState(prev => ({
                      ...prev,
                      sidePanel: { ...prev.sidePanel, sectionColor: e.target.value }
                    }))}
                    className="flex-1 h-8 font-mono text-[10px] uppercase"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-xs flex items-center gap-2"><Maximize className="w-3 h-3"/> Internal Padding</Label>
                <span className="text-xs font-mono">{canvasState.sidePanel.padding}px</span>
              </div>
              <Slider 
                value={[canvasState.sidePanel.padding]} 
                min={0} max={60} step={2}
                onValueChange={(val) => setCanvasState(prev => ({ 
                  ...prev, 
                  sidePanel: { ...prev.sidePanel, padding: val[0] } 
                }))}
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>Panel Width</Label>
                <span className="text-xs text-muted-foreground">{canvasState.sidePanel.widthPercentage}%</span>
              </div>
              <Slider 
                value={[canvasState.sidePanel.widthPercentage]} 
                min={10} max={40} step={1}
                onValueChange={(val) => setCanvasState(prev => ({ 
                  ...prev, 
                  sidePanel: { ...prev.sidePanel, widthPercentage: val[0] } 
                }))}
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>Gap to Main Grid</Label>
                <span className="text-xs text-muted-foreground">{canvasState.sidePanel.panelGap}px</span>
              </div>
              <Slider 
                value={[canvasState.sidePanel.panelGap]} 
                min={0} max={60} step={2}
                onValueChange={(val) => setCanvasState(prev => ({ 
                  ...prev, 
                  sidePanel: { ...prev.sidePanel, panelGap: val[0] } 
                }))}
              />
            </div>
          </div>

          {canvasState.sidePanel.colorMode === 'individual' && !canvasState.sidePanel.internalGrid && (
            <div className="space-y-3 animate-fade-in pt-4 border-t">
              <div className="flex justify-between">
                <Label className="text-primary font-bold">Panel Opacity</Label>
                <span className="text-xs font-mono">{Math.round(canvasState.sidePanel.opacity * 100)}%</span>
              </div>
              <Slider 
                value={[canvasState.sidePanel.opacity * 100]} 
                min={0} max={100} step={5}
                onValueChange={(val) => setCanvasState(prev => ({ 
                  ...prev, 
                  sidePanel: { ...prev.sidePanel, opacity: val[0] / 100 } 
                }))}
              />
            </div>
          )}

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
                      columns: [{ id: `s-col-${Date.now()}`, widthFraction: 1, borderRadius: 8, opacity: 1, backgroundColor: 'rgba(255,255,255,0.8)' }],
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

                        {canvasState.sidePanel.colorMode === 'individual' && (
                          <div className="space-y-1 animate-fade-in">
                            <Label className="text-[8px] uppercase flex items-center gap-2">
                              <Palette className="w-2 h-2" /> Cell Color
                            </Label>
                            <div className="flex gap-2 items-center">
                              <Input 
                                type="color" 
                                value={col.backgroundColor || '#ffffff'} 
                                onChange={(e) => updateSideColumnProperty(idx, 'backgroundColor', e.target.value)}
                                className="w-6 h-6 p-0 border-none cursor-pointer"
                              />
                              <Input 
                                type="text" 
                                value={col.backgroundColor || '#ffffff'} 
                                onChange={(e) => updateSideColumnProperty(idx, 'backgroundColor', e.target.value)}
                                className="h-6 text-[8px] font-mono flex-1 uppercase"
                              />
                            </div>
                          </div>
                        )}

                        <div className="space-y-1">
                          <Label className="text-[8px] uppercase">Width Weight</Label>
                          <Slider 
                            value={[col.widthFraction * 100]} 
                            min={1} max={100} step={1}
                            onValueChange={(val) => updateSideColumnProperty(idx, 'widthFraction', val[0] / 100)}
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <Label className="text-[8px] uppercase text-primary">Opacity</Label>
                            <span className="text-[8px] font-mono">{Math.round((col.opacity ?? 1) * 100)}%</span>
                          </div>
                          <Slider 
                            value={[(col.opacity ?? 1) * 100]} 
                            min={0} max={100} step={5}
                            onValueChange={(val) => updateSideColumnProperty(idx, 'opacity', val[0] / 100)}
                          />
                        </div>
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
