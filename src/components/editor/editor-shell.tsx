"use client";

import React, { useState } from 'react';
import { SidebarControls } from './sidebar-controls';
import { CanvasArea } from './canvas-area';
import { EditorProvider, useEditor } from '@/hooks/use-editor-state';
import { Download, LayoutTemplate, Palette, Grid3X3, PanelLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';

export function EditorShell() {
  return (
    <EditorProvider>
      <EditorContent />
      <Toaster />
    </EditorProvider>
  );
}

function EditorContent() {
  const { exportCanvas } = useEditor();

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="h-16 border-b bg-white flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <LayoutTemplate className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight font-headline text-primary">
            BI <span className="text-foreground">CanvasForge</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="hidden md:flex gap-2"
            onClick={exportCanvas}
          >
            <Download className="w-4 h-4" />
            Export Template
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="flex md:hidden"
            onClick={exportCanvas}
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        <SidebarControls />
        <CanvasArea />
      </div>
    </div>
  );
}