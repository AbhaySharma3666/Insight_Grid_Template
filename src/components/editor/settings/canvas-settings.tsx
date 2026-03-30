"use client";

import React from 'react';
import { useEditor } from '@/hooks/use-editor-state';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon, Upload } from 'lucide-react';

export function CanvasSettings() {
  const { canvasState, setCanvasState } = useEditor();

  const handleRatioChange = (val: string) => {
    setCanvasState(prev => ({ ...prev, aspectRatio: val }));
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCanvasState(prev => ({ ...prev, backgroundColor: e.target.value }));
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
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-3">
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

      <div className="space-y-3">
        <Label>Background Color</Label>
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

      <div className="space-y-3">
        <Label>Background Image</Label>
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