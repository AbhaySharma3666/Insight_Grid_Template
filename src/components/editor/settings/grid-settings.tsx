"use client";

import React from 'react';
import { useEditor } from '@/hooks/use-editor-state';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, GripVertical, Columns, PanelTop, LayoutGrid, Palette, MoveVertical } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HeaderSettings } from './header-settings';

export function GridSettings() {
  const { canvasState, setCanvasState } = useEditor();

  const addRow = () => {
    setCanvasState(prev => {
      const newRows = [...prev.mainGrid.rows, {
        id: `row-${Date.now()}`,
        heightFraction: 1,
        columns: [{ id: `col-${Date.now()}`, widthFraction: 1, borderRadius: 12, opacity: 1, backgroundColor: 'rgba(255,255,255,0.7)', x: 10, y: 10, w: 20, h: 20 }]
      }];
      const total = newRows.length;
      return {
        ...prev,
        mainGrid: {
          ...prev.mainGrid,
          rows: newRows.map(row => ({ ...row, heightFraction: 1 / total }))
        }
      };
    });
  };

  const updateRowHeight = (index: number, val: number) => {
    setCanvasState(prev => {
      const newRows = [...prev.mainGrid.rows];
      newRows[index] = { ...newRows[index], heightFraction: val };
      return { ...prev, mainGrid: { ...prev.mainGrid, rows: newRows } };
    });
  };

  const removeRow = (index: number) => {
    setCanvasState(prev => {
      if (prev.mainGrid.rows.length <= 1) return prev;
      const newRows = prev.mainGrid.rows.filter((_, i) => i !== index);
      return { ...prev, mainGrid: { ...prev.mainGrid, rows: newRows } };
    });
  };

  const addColumnToRow = (rowIndex: number) => {
    setCanvasState(prev => {
      const newRows = [...prev.mainGrid.rows];
      const row = newRows[rowIndex];
      const newCols = [...row.columns, { 
        id: `col-${Date.now()}`, 
        widthFraction: 1, 
        borderRadius: 12,
        opacity: 1,
        backgroundColor: 'rgba(255,255,255,0.7)',
        x: 50, y: 50, w: 20, h: 20
      }];
      const total = newCols.length;
      newRows[rowIndex] = {
        ...row,
        columns: newCols.map(col => ({ ...col, widthFraction: 1 / total }))
      };
      return { ...prev, mainGrid: { ...prev.mainGrid, rows: newRows } };
    });
  };

  const updateColumnProperty = (rowIndex: number, colIndex: number, key: string, val: any) => {
    setCanvasState(prev => {
      const newRows = [...prev.mainGrid.rows];
      const row = newRows[rowIndex];
      const newCols = [...row.columns];
      newCols[colIndex] = { ...newCols[colIndex], [key]: val };
      newRows[rowIndex] = { ...row, columns: newCols };
      return { ...prev, mainGrid: { ...prev.mainGrid, rows: newRows } };
    });
  };

  const removeColumnFromRow = (rowIndex: number, colIndex: number) => {
    setCanvasState(prev => {
      const newRows = [...prev.mainGrid.rows];
      const row = newRows[rowIndex];
      if (row.columns.length <= 1) return prev;
      const newCols = row.columns.filter((_, i) => i !== colIndex);
      newRows[rowIndex] = { ...row, columns: newCols };
      return { ...prev, mainGrid: { ...prev.mainGrid, rows: newRows } };
    });
  };

  const isFreeform = canvasState.layoutType === 'freeform';

  return (
    <div className="animate-fade-in space-y-4">
      <Accordion type="single" collapsible defaultValue="main-grid" className="space-y-4">
        {/* Header Configuration Section */}
        <AccordionItem value="header" className="border rounded-lg px-4 bg-muted/5">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-2">
              <PanelTop className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Header Configuration</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-6">
            <HeaderSettings />
          </AccordionContent>
        </AccordionItem>

        {/* Global Layout Spacing Section */}
        <div className="border rounded-lg px-4 py-4 bg-muted/5 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <MoveVertical className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Vertical Flow</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label className="text-xs">Header to Body Gap</Label>
              <span className="text-xs font-mono">{canvasState.layoutGap}px</span>
            </div>
            <Slider 
              value={[canvasState.layoutGap]} 
              min={0} max={100} step={2}
              onValueChange={(val) => setCanvasState(prev => ({ ...prev, layoutGap: val[0] }))}
            />
          </div>
        </div>

        {/* Main Grid Rows Section */}
        <AccordionItem value="main-grid" className="border rounded-lg px-4 bg-muted/5">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Main Grid Rows</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-6 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Layout Structure</Label>
              <Button variant="outline" size="sm" className="h-7 gap-1" onClick={addRow}>
                <Plus className="w-3 h-3" /> Add Row
              </Button>
            </div>

            <Accordion type="multiple" className="space-y-4">
              {canvasState.mainGrid.rows.map((row, rIdx) => (
                <AccordionItem key={row.id} value={row.id} className="border rounded-lg bg-background px-4">
                  <AccordionTrigger className="hover:no-underline py-3">
                    <div className="flex items-center gap-3 w-full pr-4">
                      <GripVertical className="w-4 h-4 text-muted-foreground/50" />
                      <span className="text-xs font-bold uppercase">Row {rIdx + 1}</span>
                      {!isFreeform && (
                        <div className="ml-auto text-[10px] font-mono bg-muted px-1.5 rounded">
                          {Math.round(row.heightFraction * 100)}% height
                        </div>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4 space-y-6">
                    {!isFreeform && (
                      <div className="space-y-3">
                        <Label className="text-[10px] text-muted-foreground uppercase">Row Height Weight</Label>
                        <Slider 
                          value={[row.heightFraction * 100]} 
                          min={1} max={100} step={1}
                          onValueChange={(val) => updateRowHeight(rIdx, val[0] / 100)}
                        />
                      </div>
                    )}

                    <div className="space-y-4 pt-4 border-t border-dashed">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Columns className="w-3 h-3 text-primary" />
                          <Label className="text-[10px] uppercase font-bold">Row Columns</Label>
                        </div>
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] gap-1 hover:bg-primary/10" onClick={() => addColumnToRow(rIdx)}>
                          <Plus className="w-3 h-3" /> Add
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {row.columns.map((col, cIdx) => (
                          <div key={col.id} className="space-y-4 bg-muted/10 p-3 rounded border border-dashed">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold">Cell {cIdx + 1}</span>
                              <Button 
                                variant="ghost" size="icon" className="h-5 w-5 text-destructive hover:bg-destructive/10"
                                onClick={() => removeColumnFromRow(rIdx, cIdx)}
                                disabled={row.columns.length <= 1}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-[9px] uppercase flex items-center gap-2">
                                <Palette className="w-2 h-2" /> Cell Color
                              </Label>
                              <div className="flex gap-2 items-center">
                                <Input 
                                  type="color" 
                                  value={col.backgroundColor || '#ffffff'} 
                                  onChange={(e) => updateColumnProperty(rIdx, cIdx, 'backgroundColor', e.target.value)}
                                  className="w-8 h-8 p-0 border-none cursor-pointer"
                                />
                                <Input 
                                  type="text" 
                                  value={col.backgroundColor || '#ffffff'} 
                                  onChange={(e) => updateColumnProperty(rIdx, cIdx, 'backgroundColor', e.target.value)}
                                  className="h-7 text-[10px] font-mono flex-1 uppercase"
                                />
                              </div>
                            </div>
                            
                            {isFreeform ? (
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <div className="flex justify-between items-center">
                                    <Label className="text-[9px] uppercase">X (%)</Label>
                                    <span className="text-[9px] font-mono">{Math.round(col.x || 0)}%</span>
                                  </div>
                                  <Slider 
                                    value={[col.x || 0]} 
                                    min={0} max={100} step={1}
                                    onValueChange={(val) => updateColumnProperty(rIdx, cIdx, 'x', val[0])}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <div className="flex justify-between items-center">
                                    <Label className="text-[9px] uppercase">Y (%)</Label>
                                    <span className="text-[9px] font-mono">{Math.round(col.y || 0)}%</span>
                                  </div>
                                  <Slider 
                                    value={[col.y || 0]} 
                                    min={0} max={100} step={1}
                                    onValueChange={(val) => updateColumnProperty(rIdx, cIdx, 'y', val[0])}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <div className="flex justify-between items-center">
                                    <Label className="text-[9px] uppercase">W (%)</Label>
                                    <span className="text-[9px] font-mono">{Math.round(col.w || 20)}%</span>
                                  </div>
                                  <Slider 
                                    value={[col.w || 20]} 
                                    min={5} max={100} step={1}
                                    onValueChange={(val) => updateColumnProperty(rIdx, cIdx, 'w', val[0])}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <div className="flex justify-between items-center">
                                    <Label className="text-[9px] uppercase">H (%)</Label>
                                    <span className="text-[9px] font-mono">{Math.round(col.h || 20)}%</span>
                                  </div>
                                  <Slider 
                                    value={[col.h || 20]} 
                                    min={5} max={100} step={1}
                                    onValueChange={(val) => updateColumnProperty(rIdx, cIdx, 'h', val[0])}
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <Label className="text-[9px] uppercase">Width Weight</Label>
                                  <span className="text-[9px] font-mono">{Math.round(col.widthFraction * 100)}%</span>
                                </div>
                                <Slider 
                                  value={[col.widthFraction * 100]} 
                                  min={1} max={100} step={1}
                                  onValueChange={(val) => updateColumnProperty(rIdx, cIdx, 'widthFraction', val[0] / 100)}
                                />
                              </div>
                            )}

                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <Label className="text-[9px] uppercase">Radius</Label>
                                <span className="text-[9px] font-mono">{col.borderRadius || 0}px</span>
                              </div>
                              <Slider 
                                value={[col.borderRadius || 0]} 
                                min={0} max={60} step={1}
                                onValueChange={(val) => updateColumnProperty(rIdx, cIdx, 'borderRadius', val[0])}
                              />
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <Label className="text-[9px] uppercase text-primary font-bold">Opacity</Label>
                                <span className="text-[9px] font-mono">{Math.round((col.opacity ?? 1) * 100)}%</span>
                              </div>
                              <Slider 
                                value={[(col.opacity ?? 1) * 100]} 
                                min={0} max={100} step={5}
                                onValueChange={(val) => updateColumnProperty(rIdx, cIdx, 'opacity', val[0] / 100)}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full h-8 text-destructive text-[10px] uppercase mt-2 hover:bg-destructive/5"
                      onClick={() => removeRow(rIdx)}
                      disabled={canvasState.mainGrid.rows.length <= 1}
                    >
                      <Trash2 className="w-3 h-3 mr-2" /> Delete Row {rIdx + 1}
                    </Button>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="space-y-6 pt-6 border-t">
              {!isFreeform && (
                <>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label className="text-xs">Main Grid Column Gap</Label>
                      <span className="text-xs text-muted-foreground">{canvasState.mainGrid.columnGap}px</span>
                    </div>
                    <Slider 
                      value={[canvasState.mainGrid.columnGap]} 
                      min={0} max={100} step={2}
                      onValueChange={(val) => setCanvasState(prev => ({ 
                        ...prev, 
                        mainGrid: { ...prev.mainGrid, columnGap: val[0] } 
                      }))}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label className="text-xs">Main Grid Row Gap</Label>
                      <span className="text-xs text-muted-foreground">{canvasState.mainGrid.rowGap}px</span>
                    </div>
                    <Slider 
                      value={[canvasState.mainGrid.rowGap]} 
                      min={0} max={100} step={2}
                      onValueChange={(val) => setCanvasState(prev => ({ 
                        ...prev, 
                        mainGrid: { ...prev.mainGrid, rowGap: val[0] } 
                      }))}
                    />
                  </div>
                </>
              )}

              <div className="space-y-4">
                <Label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                  <Palette className="w-3 h-3" /> Styling Overrides
                </Label>
                
                <div className="space-y-3 bg-muted/10 p-3 rounded-lg border border-dashed">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Main Shadows</Label>
                    <Switch 
                      checked={canvasState.mainGrid.hasShadow} 
                      onCheckedChange={(val) => setCanvasState(prev => ({ 
                        ...prev, 
                        mainGrid: { ...prev.mainGrid, hasShadow: val } 
                      }))}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Main Borders</Label>
                      <Switch 
                        checked={canvasState.mainGrid.hasBorder} 
                        onCheckedChange={(val) => setCanvasState(prev => ({ 
                          ...prev, 
                          mainGrid: { ...prev.mainGrid, hasBorder: val } 
                        }))}
                      />
                    </div>
                    
                    {canvasState.mainGrid.hasBorder && (
                      <div className="flex gap-2 items-center pl-4 animate-fade-in">
                        <Input 
                          type="color" 
                          value={canvasState.mainGrid.borderColor || '#000000'} 
                          onChange={(e) => setCanvasState(prev => ({ 
                            ...prev, 
                            mainGrid: { ...prev.mainGrid, borderColor: e.target.value } 
                          }))}
                          className="w-8 h-8 p-0 border-none cursor-pointer"
                        />
                        <span className="text-[10px] font-mono uppercase text-muted-foreground">
                          {canvasState.mainGrid.borderColor || '#000000'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
