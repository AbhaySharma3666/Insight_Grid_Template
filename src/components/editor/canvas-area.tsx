"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useEditor, ColumnDefinition, RowDefinition } from '@/hooks/use-editor-state';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Plus, Minus, RotateCcw, Move } from 'lucide-react';

export function CanvasArea() {
  const { canvasState, setCanvasState, setCanvasRef, zoom, setZoom } = useEditor();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasElementRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const [baseScale, setBaseScale] = useState(1);
  const [draggingItem, setDraggingItem] = useState<{ rIdx: number, cIdx: number } | null>(null);

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

  const handleMouseDown = (rIdx: number, cIdx: number) => {
    if (canvasState.layoutType !== 'freeform') return;
    setDraggingItem({ rIdx, cIdx });
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!draggingItem || !mainContentRef.current) return;

    const rect = mainContentRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setCanvasState(prev => {
      const newRows = [...prev.mainGrid.rows];
      const row = newRows[draggingItem.rIdx];
      const newCols = [...row.columns];
      newCols[draggingItem.cIdx] = {
        ...newCols[draggingItem.cIdx],
        x: Math.max(0, Math.min(100 - (newCols[draggingItem.cIdx].w || 10), x)),
        y: Math.max(0, Math.min(100 - (newCols[draggingItem.cIdx].h || 10), y))
      };
      newRows[draggingItem.rIdx] = { ...row, columns: newCols };
      return { ...prev, mainGrid: { ...prev.mainGrid, rows: newRows } };
    });
  }, [draggingItem, setCanvasState]);

  const handleMouseUp = () => {
    setDraggingItem(null);
  };

  const finalScale = baseScale * zoom;

  const aspectRatioParts = canvasState.aspectRatio.split(':').map(Number);
  const ratio = aspectRatioParts[0] / aspectRatioParts[1];
  const canvasWidth = 1280;
  const canvasHeight = canvasWidth / ratio;

  const sidePanelWidth = canvasState.sidePanel.position !== 'none' 
    ? (canvasWidth * (canvasState.sidePanel.widthPercentage || 20)) / 100 
    : 0;

  const getBackgroundStyle = () => {
    if (canvasState.backgroundImage) {
      return {
        backgroundImage: `url(${canvasState.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
    
    if (canvasState.backgroundGradient.enabled) {
      const gradient = `linear-gradient(${canvasState.backgroundGradient.angle}deg, ${canvasState.backgroundGradient.colors.join(', ')})`;
      return {
        background: gradient,
      };
    }

    return {
      backgroundColor: canvasState.backgroundColor,
    };
  };

  const RenderColumn = ({ col, style, className }: { col: ColumnDefinition, style: React.CSSProperties, className?: string }) => {
    const hasNestedRows = col.nestedRows && col.nestedRows.length > 0;

    return (
      <div 
        className={cn("relative overflow-hidden", className)}
        style={{
          ...style,
          display: hasNestedRows ? 'flex' : 'block',
          flexDirection: 'column',
          gap: `${canvasState.mainGrid.rowGap / 2}px`,
          padding: hasNestedRows ? '8px' : '0'
        }}
      >
        {hasNestedRows ? (
          col.nestedRows!.map((nRow) => (
            <div 
              key={nRow.id}
              className="flex w-full"
              style={{ 
                height: `${nRow.heightFraction * 100}%`,
                gap: `${canvasState.mainGrid.columnGap / 2}px`
              }}
            >
              {nRow.columns.map((nCol) => (
                <div 
                  key={nCol.id}
                  className="grid-item-shadow"
                  style={{
                    width: `${nCol.widthFraction * 100}%`,
                    height: '100%',
                    borderRadius: `${nCol.borderRadius || 12}px`,
                    opacity: nCol.opacity ?? 1,
                    backgroundColor: nCol.backgroundColor || 'rgba(255,255,255,0.7)',
                    border: canvasState.mainGrid.hasBorder ? `1px solid ${canvasState.mainGrid.borderColor || 'rgba(0,0,0,0.08)'}` : 'none',
                    boxShadow: canvasState.mainGrid.hasShadow ? '0 4px 6px -1px rgb(0 0 0 / 0.1)' : 'none'
                  }}
                />
              ))}
            </div>
          ))
        ) : (
          <div className="w-full h-full" />
        )}
      </div>
    );
  };

  return (
    <div 
      ref={containerRef} 
      className="flex-1 bg-background overflow-hidden flex items-center justify-center p-10 select-none relative"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div 
        ref={canvasElementRef}
        className="canvas-shadow relative overflow-hidden bg-white"
        style={{
          width: `${canvasWidth}px`,
          height: `${canvasHeight}px`,
          ...getBackgroundStyle(),
          transform: `scale(${finalScale})`,
          transition: draggingItem ? 'none' : 'transform 0.2s ease-out',
        }}
      >
        <div 
          className="flex flex-col w-full h-full"
          style={{ 
            padding: `${canvasState.canvasPadding}px`,
            gap: `${canvasState.layoutGap}px` 
          }}
        >
          {/* Top Header Row */}
          {canvasState.header.enabled && (
            <div 
              className={cn(
                "flex flex-row shrink-0 transition-all duration-300",
                canvasState.header.hasShadow && canvasState.header.colorMode === 'section' && "shadow-md",
                canvasState.header.hasBorder && canvasState.header.colorMode === 'section' && "border"
              )}
              style={{ 
                height: `${canvasState.header.heightFraction * 100}%`,
                gap: `${canvasState.header.columnGap}px`,
                padding: `${canvasState.header.padding}px`,
                backgroundColor: canvasState.header.colorMode === 'section' ? canvasState.header.sectionColor : 'transparent',
                borderRadius: canvasState.header.colorMode === 'section' ? '12px' : '0',
                borderColor: canvasState.mainGrid.borderColor || 'rgba(0,0,0,0.1)',
              }}
            >
              {canvasState.header.columns.map((col) => (
                <div 
                  key={col.id}
                  className={cn(
                    "grid-item-shadow",
                    canvasState.header.hasShadow && canvasState.header.colorMode === 'individual' && "shadow-md",
                    canvasState.header.hasBorder && canvasState.header.colorMode === 'individual' && "border"
                  )}
                  style={{
                    width: `${col.widthFraction * 100}%`,
                    borderRadius: `${col.borderRadius || 12}px`,
                    opacity: col.opacity ?? 1,
                    backgroundColor: canvasState.header.colorMode === 'section' 
                      ? 'transparent' 
                      : (col.backgroundColor || 'rgba(255,255,255,0.9)'),
                    borderColor: canvasState.mainGrid.borderColor || 'rgba(0,0,0,0.1)',
                  }}
                />
              ))}
            </div>
          )}

          {/* Bottom Area: Side Panel + Main Content */}
          <div 
            className={cn(
              "flex flex-1 min-h-0",
              canvasState.sidePanel.position === 'right' && "flex-row-reverse"
            )}
            style={{ gap: `${canvasState.sidePanel.panelGap}px` }}
          >
            {canvasState.sidePanel.position !== 'none' && (
              <div 
                className={cn(
                  "h-full shrink-0 relative overflow-hidden transition-all duration-300",
                  canvasState.sidePanel.internalGrid?.hasShadow && canvasState.sidePanel.colorMode === 'section' && "shadow-sm",
                  canvasState.sidePanel.internalGrid?.hasBorder && canvasState.sidePanel.colorMode === 'section' && "border"
                )}
                style={{ 
                  width: `${sidePanelWidth}px`,
                  padding: `${canvasState.sidePanel.padding}px`,
                  backgroundColor: canvasState.sidePanel.colorMode === 'section' 
                    ? canvasState.sidePanel.sectionColor 
                    : (!canvasState.sidePanel.internalGrid ? `rgba(255,255,255,${canvasState.sidePanel.opacity})` : 'transparent'),
                  borderRadius: '12px',
                  border: (canvasState.sidePanel.colorMode === 'section' || !canvasState.sidePanel.internalGrid) ? '1px solid rgba(0,0,0,0.05)' : 'none',
                }}
              >
                {canvasState.sidePanel.internalGrid && (
                  <div 
                    style={{
                      display: 'grid',
                      gridTemplateColumns: canvasState.sidePanel.internalGrid.columns.map(c => `${c.widthFraction}fr`).join(' '),
                      gridTemplateRows: canvasState.sidePanel.internalGrid.rows.map(r => `${r.heightFraction}fr`).join(' '),
                      gap: `${canvasState.sidePanel.internalGrid.rowGap}px ${canvasState.sidePanel.internalGrid.columnGap}px`,
                      height: '100%',
                    }}
                  >
                    {canvasState.sidePanel.internalGrid.rows.map((row, rIdx) => (
                      canvasState.sidePanel.internalGrid!.columns.map((col, cIdx) => (
                        <div 
                          key={`side-${rIdx}-${cIdx}`}
                          className={cn(
                            "grid-item-shadow",
                            canvasState.sidePanel.internalGrid!.hasShadow && canvasState.sidePanel.colorMode === 'individual' && "shadow-sm",
                            canvasState.sidePanel.internalGrid!.hasBorder && canvasState.sidePanel.colorMode === 'individual' && "border"
                          )}
                          style={{
                            borderRadius: `${col.borderRadius || 8}px`,
                            opacity: col.opacity ?? 1,
                            backgroundColor: canvasState.sidePanel.colorMode === 'section'
                              ? 'transparent'
                              : (col.backgroundColor || 'rgba(255,255,255,0.8)'),
                            borderColor: canvasState.sidePanel.internalGrid!.borderColor || 'rgba(0,0,0,0.1)',
                          }}
                        />
                      ))
                    ))}
                  </div>
                )}
              </div>
            )}

            <div 
              ref={mainContentRef}
              className={cn(
                "flex-1 h-full flex flex-col relative transition-all duration-300",
                canvasState.layoutType === 'freeform' ? "block" : "flex",
                canvasState.mainGrid.hasShadow && canvasState.mainGrid.colorMode === 'section' && "shadow-md",
                canvasState.mainGrid.hasBorder && canvasState.mainGrid.colorMode === 'section' && "border"
              )}
              style={{ 
                gap: canvasState.layoutType === 'freeform' ? '0' : `${canvasState.mainGrid.rowGap}px`,
                padding: `${canvasState.mainGrid.padding}px`,
                backgroundColor: canvasState.mainGrid.colorMode === 'section' ? canvasState.mainGrid.sectionColor : 'transparent',
                borderRadius: canvasState.mainGrid.colorMode === 'section' ? '12px' : '0',
                borderColor: canvasState.mainGrid.borderColor || 'rgba(0,0,0,0.08)',
              }}
            >
              {canvasState.mainGrid.rows.map((row, rIdx) => (
                <div 
                  key={row.id} 
                  className={cn(
                    "flex flex-row",
                    canvasState.layoutType === 'freeform' ? "static" : "relative"
                  )}
                  style={{ 
                    height: canvasState.layoutType === 'freeform' ? '100%' : `${row.heightFraction * 100}%`,
                    gap: `${canvasState.mainGrid.columnGap}px` 
                  }}
                >
                  {row.columns.map((col, cIdx) => (
                    <RenderColumn
                      key={col.id}
                      col={col}
                      className={cn(
                        "grid-item-shadow flex items-center justify-center group",
                        canvasState.mainGrid.hasShadow && canvasState.mainGrid.colorMode === 'individual' && "shadow-md",
                        canvasState.mainGrid.hasBorder && canvasState.mainGrid.colorMode === 'individual' && "border",
                        canvasState.layoutType === 'freeform' && "absolute cursor-grab active:cursor-grabbing hover:ring-2 hover:ring-primary/20",
                        draggingItem?.rIdx === rIdx && draggingItem?.cIdx === cIdx && "z-50 ring-2 ring-primary scale-[1.02]"
                      )}
                      style={{
                        ...(canvasState.layoutType === 'freeform' ? {
                          left: `${col.x || 0}%`,
                          top: `${col.y || 0}%`,
                          width: `${col.w || (col.widthFraction * 100)}%`,
                          height: `${col.h || (row.heightFraction * 100)}%`,
                        } : {
                          width: `${col.widthFraction * 100}%`,
                        }),
                        borderRadius: `${col.borderRadius || 12}px`,
                        opacity: col.opacity ?? 1,
                        backgroundColor: canvasState.mainGrid.colorMode === 'section'
                          ? 'transparent'
                          : (col.backgroundColor || 'rgba(255,255,255,0.7)'),
                        borderColor: canvasState.mainGrid.borderColor || 'rgba(0,0,0,0.08)',
                        transition: draggingItem ? 'none' : 'all 0.3s ease'
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-6 right-6 flex items-center gap-2 bg-white/80 backdrop-blur-sm border p-1 rounded-full shadow-sm z-30">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-full"
          onClick={() => setZoom(prev => Math.max(0.1, prev - 0.1))}
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
        >
          <Plus className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-full ml-1"
          onClick={() => setZoom(1)}
        >
          <RotateCcw className="w-3.5 h-3.5 text-accent" />
        </Button>
      </div>
    </div>
  );
}
