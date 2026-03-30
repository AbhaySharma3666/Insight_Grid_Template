"use client";

import React from 'react';
import { useEditor } from '@/hooks/use-editor-state';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Layout, Palette, Image as ImageIcon, Upload, Plus, Trash2, Maximize } from 'lucide-react';

export function CanvasSettings() {
  const { canvasState, setCanvasState } = useEditor();

  const handleRatioChange = (val: string) => {
    setCanvasState(prev => ({ ...prev, aspectRatio: val }));
  };

  const handleLayoutTypeChange = (val: string) => {
    setCanvasState(prev => ({ ...prev, layoutType: val as any }));
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCanvasState(prev => ({ ...prev, backgroundColor: e.target.value }));
  };

  const toggleGradient = (enabled: boolean) => {
    setCanvasState(prev => ({
      ...prev,
      backgroundGradient: { ...prev.backgroundGradient, enabled }
    }));
  };

  const addGradientColor = () => {
    setCanvasState(prev => ({
      ...prev,
      backgroundGradient: {
        ...prev.backgroundGradient,
        colors: [...prev.backgroundGradient.colors, '#FFFFFF']
      }
    }));
  };

  const removeGradientColor = (index: number) => {
    setCanvasState(prev => {
      if (prev.backgroundGradient.colors.length <= 2) return prev;
      const newColors = prev.backgroundGradient.colors.filter((_, i) => i !== index);
      return {
        ...prev,
        backgroundGradient: { ...prev.backgroundGradient, colors: newColors }
      };
    });
  };

  const updateGradientColor = (index: number, val: string) => {
    setCanvasState(prev => {
      const newColors = [...prev.backgroundGradient.colors];
      newColors[index] = val;
      return {
        ...prev,
        backgroundGradient: { ...prev.backgroundGradient, colors: newColors }
      };
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        setCanvasState(prev => ({ 
          ...prev, 
          backgroundImage: readerEvent.target?.result as string 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-4">
        <Label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
          <Layout className="w-4 h-4" /> Layout
        </Label>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Structure Style</Label>
            <Select value={canvasState.layoutType} onValueChange={handleLayoutTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Layout Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grid">Grid-based</SelectItem>
                <SelectItem value="freeform">Freeform Look</SelectItem>
                <SelectItem value="autofit">Auto-Fit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Canvas Ratio</Label>
            <Select value={canvasState.aspectRatio} onValueChange={handleRatioChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Ratio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="16:9">Widescreen (16:9)</SelectItem>
                <SelectItem value="4:3">Standard (4:3)</SelectItem>
                <SelectItem value="21:9">Ultrawide (21:9)</SelectItem>
                <SelectItem value="1:1">Square (1:1)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t">
        <Label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
          <Maximize className="w-4 h-4" /> Canvas Spacing
        </Label>
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label className="text-xs">Overall Padding (px)</Label>
              <span className="text-xs font-mono">{canvasState.canvasPadding}px</span>
            </div>
            <Slider 
              value={[canvasState.canvasPadding]} 
              min={0} max={100} step={2}
              onValueChange={(val) => setCanvasState(prev => ({ ...prev, canvasPadding: val[0] }))}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            <Palette className="w-4 h-4" /> Background
          </Label>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Gradient</span>
            <Switch checked={canvasState.backgroundGradient.enabled} onCheckedChange={toggleGradient} />
          </div>
        </div>

        {canvasState.backgroundGradient.enabled ? (
          <div className="space-y-6 bg-muted/20 p-4 rounded-lg border">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Gradient Colors</Label>
                <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1" onClick={addGradientColor}>
                  <Plus className="w-3 h-3" /> Add Color
                </Button>
              </div>
              <div className="space-y-2">
                {canvasState.backgroundGradient.colors.map((color, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input 
                      type="color" 
                      value={color} 
                      onChange={(e) => updateGradientColor(idx, e.target.value)}
                      className="w-10 h-8 p-1 cursor-pointer"
                    />
                    <Input 
                      type="text" 
                      value={color} 
                      onChange={(e) => updateGradientColor(idx, e.target.value)}
                      className="flex-1 h-8 font-mono text-[10px] uppercase"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive"
                      onClick={() => removeGradientColor(idx)}
                      disabled={canvasState.backgroundGradient.colors.length <= 2}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex justify-between">
                <Label className="text-xs">Gradient Angle</Label>
                <span className="text-xs font-mono">{canvasState.backgroundGradient.angle}°</span>
              </div>
              <Slider 
                value={[canvasState.backgroundGradient.angle]} 
                min={0} max={360} step={1}
                onValueChange={(val) => setCanvasState(prev => ({
                  ...prev,
                  backgroundGradient: { ...prev.backgroundGradient, angle: val[0] }
                }))}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <Label>Solid Background Color</Label>
            <div className="flex gap-3">
              <Input 
                type="color" 
                value={canvasState.backgroundColor} 
                onChange={handleColorChange}
                className="w-12 h-10 p-1 cursor-pointer"
              />
              <Input 
                type="text" 
                value={canvasState.backgroundColor} 
                onChange={handleColorChange}
                className="flex-1 font-mono uppercase"
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4 pt-6 border-t">
        <Label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
          <ImageIcon className="w-4 h-4" /> Overlay Image
        </Label>
        <div className="grid gap-2">
          {canvasState.backgroundImage ? (
            <div className="relative aspect-video rounded-lg overflow-hidden border group">
              <img src={canvasState.backgroundImage} alt="Background" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button 
                  size="sm" 
                  variant="secondary" 
                  onClick={() => setCanvasState(prev => ({ ...prev, backgroundImage: null }))}
                >
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center aspect-video rounded-lg border-2 border-dashed border-muted hover:border-primary transition-colors cursor-pointer bg-muted/30">
              <Upload className="w-8 h-8 text-muted-foreground mb-2" />
              <span className="text-xs font-medium text-muted-foreground text-center px-4">
                Upload image (PNG, JPG, SVG)
              </span>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
          )}
        </div>
      </div>
    </div>
  );
}
