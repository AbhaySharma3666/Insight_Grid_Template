"use client";

import React, { useRef, useEffect, useState } from 'react';
import { useEditor } from '@/hooks/use-editor-state';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Plus, Minus, RotateCcw } from 'lucide-react';

export function CanvasArea() {
  const { canvasState, setCanvasRef, zoom, setZoom } = useEditor();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasElementRef = useRef<HTMLDivElement>(null);
  const [baseScale, setBaseScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current || !canvasElementRef.current) return;
      
      const containerWidth = containerRef.current.clientWidth - 80;
      const containerHeight = containerRef.current.clientHeight - 80;
      
      const aspectRatioParts = canvasState.aspectRatio.split(':').map(Number);
      const ratio = aspectRatioParts[0] / aspectRatioParts[1];
      
      const baseWidth = 1280;
      const baseHeight = 1280 / ratio;

      const scaleW = containerWidth / baseWidth;
      const scaleH = containerHeight / baseHeight;
      const finalScale = Math.min(scaleW, scaleH, 1);
      
      setBaseScale(finalScale);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [canvasState.aspectRatio]);

  useEffect(() => {
    if (canvasElementRef.current) {
      setCanvasRef(canvasElementRef.current);
    }
  }, [setCanvasRef]);

  const finalScale = baseScale * zoom;

  const aspectRatioParts = canvasState.aspectRatio.split(':').map(Number);
  const ratio = aspectRatioParts[0] / aspectRatioParts[1];
  const canvasWidth = 1280;
  const canvasHeight = canvasWidth / ratio;

  const sidePanelWidth = canvasState.sidePanel.position !== 'none' 
    ? (canvasWidth * (canvasState.sidePanel.widthPercentage || 20)) / 100 
    : 0;

  const internalGridStyle = canvasState.sidePanel.internalGrid ? {
    display: 'grid',
    gridTemplateColumns: canvasState.sidePanel.internalGrid.columns.map(c => `${c.widthFraction}fr`).join(' '),
    gridTemplateRows: canvasState.sidePanel.internalGrid.rows.map(r => `${r.heightFraction}fr`).join(' '),
    gap: `${canvasState.sidePanel.internalGrid.rowGap}px ${canvasState.sidePanel.internalGrid.columnGap}px`,
    padding: '16px',
    height: '100%',
  } : {};

  return (
    <div ref={containerRef} className="flex-1 bg-background overflow-hidden flex items-center justify-center p-10 select-none relative">
      <div 
        ref={canvasElementRef}
        className="canvas-shadow relative overflow-hidden bg-white"
        style={{
          width: `${canvasWidth}px`,
          height: `${canvasHeight}px`,
          backgroundColor: canvasState.backgroundColor,
          backgroundImage: canvasState.backgroundImage ? `url(${canvasState.backgroundImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: `scale(${finalScale})`,
          transition: 'transform 0.2s ease-out',
        }}
      >
        <div 
          className="flex flex-col w-full h-full p-6"
          style={{ gap: `${canvasState.mainGrid.rowGap}px` }}
        >
          {/* Top Header Row (Full Width) */}
          {canvasState.header.enabled && (
            <div 
              className="flex flex-row shrink-0"
              style={{ 
                height: `${canvasState.header.heightFraction * 100}%`,
                gap: `${canvasState.mainGrid.columnGap}px` 
              }}
            >
              {canvasState.header.columns.map((col) => (
                <div 
                  key={col.id}
                  className={cn(
                    "grid-item-shadow",
                    canvasState.header.hasShadow && "shadow-md",
                    canvasState.header.hasBorder && "border"
                  )}
                  style={{
                    width: `${col.widthFraction * 100}%`,
                    borderRadius: `${col.borderRadius || 12}px`,
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    borderColor: canvasState.mainGrid.borderColor || 'rgba(0,0,0,0.1)',
                  }}
                />
              ))}
            </div>
          )}

          {/* Bottom Content Area: Side Panel + Main Grid side-by-side */}
          <div 
            className={cn(
              "flex flex-1 min-h-0",
              canvasState.sidePanel.position === 'right' && "flex-row-reverse"
            )}
            style={{ gap: `${canvasState.sidePanel.panelGap}px` }}
          >
            {/* Side Panel */}
            {canvasState.sidePanel.position !== 'none' && (
              <div 
                className="h-full shrink-0 relative overflow-hidden"
                style={{ 
                  width: `${sidePanelWidth}px`,
                  backgroundColor: 'rgba(255,255,255,0.4)',
                  borderRadius: '12px',
                  border: '1px solid rgba(0,0,0,0.05)'
                }}
              >
                {canvasState.sidePanel.internalGrid && (
                  <div style={internalGridStyle}>
                    {canvasState.sidePanel.internalGrid.rows.map((row, rIdx) => (
                      canvasState.sidePanel.internalGrid!.columns.map((col, cIdx) => (
                        <div 
                          key={`side-${rIdx}-${cIdx}`}
                          className={cn(
                            "grid-item-shadow",
                            canvasState.sidePanel.internalGrid!.hasShadow && "shadow-sm",
                            canvasState.sidePanel.internalGrid!.hasBorder && "border"
                          )}
                          style={{
                            borderRadius: `${col.borderRadius || 8}px`,
                            backgroundColor: 'rgba(255,255,255,0.8)',
                            borderColor: canvasState.sidePanel.internalGrid!.borderColor || 'rgba(0,0,0,0.1)',
                          }}
                        />
                      ))
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Main Content Area (Rows) */}
            <div 
              className="flex-1 h-full flex flex-col"
              style={{ gap: `${canvasState.mainGrid.rowGap}px` }}
            >
              {canvasState.mainGrid.rows.map((row) => (
                <div 
                  key={row.id} 
                  className={cn(
                    "flex flex-row",
                    canvasState.layoutType === 'freeform' && "relative"
                  )}
                  style={{ 
                    height: `${row.heightFraction * 100}%`,
                    gap: `${canvasState.mainGrid.columnGap}px` 
                  }}
                >
                  {row.columns.map((col) => (
                    <div 
                      key={col.id}
                      className={cn(
                        "grid-item-shadow",
                        canvasState.mainGrid.hasShadow && "shadow-md",
                        canvasState.mainGrid.hasBorder && "border",
                        canvasState.layoutType === 'freeform' && "transform scale-[0.98] opacity-90"
                      )}
                      style={{
                        width: `${col.widthFraction * 100}%`,
                        borderRadius: `${col.borderRadius || 12}px`,
                        backgroundColor: 'rgba(255,255,255,0.7)',
                        borderColor: canvasState.mainGrid.borderColor || 'rgba(0,0,0,0.08)',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Zoom Controls */}
      <div className="absolute bottom-6 right-6 flex items-center gap-2 bg-white/80 backdrop-blur-sm border p-1 rounded-full shadow-sm z-30">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-full"
          onClick={() => setZoom(prev => Math.max(0.1, prev - 0.1))}
          title="Zoom Out"
        >
          <Minus className="w-4 h-4" />
        </Button>
        <div className="px-2 min-w-[60px] text-center text-xs font-bold text-muted-foreground border-x">
          {Math.round(finalScale * 100)}%
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-full"
          onClick={() => setZoom(prev => Math.min(3, prev + 0.1))}
          title="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-full ml-1"
          onClick={() => setZoom(1)}
          title="Reset Zoom"
        >
          <RotateCcw className="w-3.5 h-3.5 text-accent" />
        </Button>
      </div>
    </div>
  );
}
