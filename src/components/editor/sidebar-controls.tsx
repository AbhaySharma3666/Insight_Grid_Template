"use client";

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Palette, Grid3X3, PanelLeft, Sparkles, PanelTop } from 'lucide-react';
import { CanvasSettings } from './settings/canvas-settings';
import { GridSettings } from './settings/grid-settings';
import { SidePanelSettings } from './settings/side-panel-settings';
import { AiSuggestionForm } from './ai-suggestion-form';
import { HeaderSettings } from './settings/header-settings';

export function SidebarControls() {
  return (
    <aside className="w-80 md:w-96 border-r bg-white flex flex-col shrink-0 z-10">
      <Tabs defaultValue="canvas" className="flex flex-col h-full">
        <div className="p-4 border-b">
          <TabsList className="grid grid-cols-5 w-full h-12">
            <TabsTrigger value="canvas" title="Canvas Settings">
              <Palette className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="header" title="Header Settings">
              <PanelTop className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="grid" title="Grid Settings">
              <Grid3X3 className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="panel" title="Side Panel">
              <PanelLeft className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="ai" title="AI Suggestions">
              <Sparkles className="w-4 h-4" />
            </TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-6">
            <TabsContent value="canvas" className="mt-0 space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold font-headline">Canvas & Background</h2>
              </div>
              <CanvasSettings />
            </TabsContent>

            <TabsContent value="header" className="mt-0 space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <PanelTop className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold font-headline">Heading Row</h2>
              </div>
              <HeaderSettings />
            </TabsContent>

            <TabsContent value="grid" className="mt-0 space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Grid3X3 className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold font-headline">Main Grid Layout</h2>
              </div>
              <GridSettings />
            </TabsContent>

            <TabsContent value="panel" className="mt-0 space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <PanelLeft className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold font-headline">Side Panel</h2>
              </div>
              <SidePanelSettings />
            </TabsContent>

            <TabsContent value="ai" className="mt-0 space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold font-headline">AI Layout Assistant</h2>
              </div>
              <AiSuggestionForm />
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </aside>
  );
}