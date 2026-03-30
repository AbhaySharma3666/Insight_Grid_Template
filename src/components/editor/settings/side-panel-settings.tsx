"use client";

import React from 'react';
import { useEditor } from '@/hooks/use-editor-state';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

export function SidePanelSettings() {
  const { canvasState, setCanvasState } = useEditor();

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
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <span className="text-xs font-semibold">Left</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="right" id="pos-right" className="peer sr-only" />
            <Label
              htmlFor="pos-right"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <span className="text-xs font-semibold">Right</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="none" id="pos-none" className="peer sr-only" />
            <Label
              htmlFor="pos-none"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
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
            <Label className="text-sm font-semibold opacity-70">Internal Grid Settings</Label>
            
            <div className="flex items-center justify-between">
              <Label>Show Elements</Label>
              <Switch 
                checked={!!canvasState.sidePanel.internalGrid?.hasBorder} 
                onCheckedChange={(val) => setCanvasState(prev => ({ 
                  ...prev, 
                  sidePanel: { 
                    ...prev.sidePanel, 
                    internalGrid: {
                      ...(prev.sidePanel.internalGrid || {
                        columns: [{ widthFraction: 1 }],
                        rows: Array(5).fill(null).map(() => ({ heightFraction: 0.2 })),
                        columnGap: 10,
                        rowGap: 10,
                        hasShadow: false,
                        hasBorder: true,
                      }),
                      hasBorder: val,
                      hasShadow: val
                    }
                  } 
                }))}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}