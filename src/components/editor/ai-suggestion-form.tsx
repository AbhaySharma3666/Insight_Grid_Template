"use client";

import React, { useState } from 'react';
import { suggestLayout } from '@/ai/flows/ai-layout-suggestion-flow';
import { useEditor } from '@/hooks/use-editor-state';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Sparkles, Loader2, Wand2, Lightbulb } from 'lucide-react';

export function AiSuggestionForm() {
  const { applyAiSuggestion } = useEditor();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    try {
      const result = await suggestLayout({ dashboardPurpose: prompt });
      applyAiSuggestion(result);
    } catch (error) {
      console.error("AI Generation failed", error);
    } finally {
      setLoading(false);
    }
  };

  const PRESETS = [
    "Executive Sales Summary with key KPIs",
    "Operational Supply Chain dashboard",
    "Financial Quarterly Revenue report",
    "Customer Support performance tracker"
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-3">
        <Label htmlFor="ai-prompt">What's the purpose of your dashboard?</Label>
        <Textarea 
          id="ai-prompt"
          placeholder="e.g. Sales overview for 2024 with regional breakdowns and trend lines..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[100px] resize-none"
        />
        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> 
          AI will suggest rows, columns, colors, and side panel structure.
        </p>
      </div>

      <Button 
        className="w-full gap-2 shadow-sm" 
        onClick={handleGenerate} 
        disabled={loading || !prompt.trim()}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Wand2 className="w-4 h-4" />
        )}
        Generate Layout Suggestion
      </Button>

      <div className="pt-4 border-t space-y-3">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Try a preset</Label>
        <div className="grid grid-cols-1 gap-2">
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              className="text-left text-xs p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors border flex items-center gap-2"
              onClick={() => setPrompt(p)}
            >
              <Lightbulb className="w-3 h-3 text-accent shrink-0" />
              <span className="truncate">{p}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}