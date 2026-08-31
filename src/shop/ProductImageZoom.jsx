import { useState, useEffect, useRef, useCallback } from "react";

export default function ProductImageZoom({ images, startIndex, alt, onClose, onIndexChange }) {
  const [index, setIndex] = useState(startIndex);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragRef = useRef(null);
  const lastTapRef = useRef(0);

  const resetZoom = useCallback(() => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    setIndex(startIndex);
    resetZoom();
  }, [startIndex, images, resetZoom]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") {
        setIndex((i) => {
          const next = Math.max(0, i - 1);
          onIndexChange?.(next);
          return next;
        });
        resetZoom();
      }
      if (e.key === "ArrowRight") {
        setIndex((i) => {
          const next = Math.min(images.length - 1, i + 1);
          onIndexChange?.(next);
          return next;
        });
        resetZoom();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, images.length, resetZoom, onIndexChange]);

  const goPrev = () => {
    if (index <= 0) return;
    const next = index - 1;
    setIndex(next);
    onIndexChange?.(next);
    resetZoom();
  };

  const goNext = () => {
    if (index >= images.length - 1) return;
    const next = index + 1;
    setIndex(next);
    onIndexChange?.(next);
    resetZoom();
  };

  const zoomIn = () => setScale((s) => Math.min(3, +(s + 0.5).toFixed(1)));
  const zoomOut = () => {
    setScale((s) => {
      const next = Math.max(1, +(s - 0.5).toFixed(1));
      if (next === 1) setOffset({ x: 0, y: 0 });
      return next;
    });
  };

  const onImagePointerDown = (e) => {
    if (scale <= 1) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
  };

  const onImagePointerMove = (e) => {
    if (!dragRef.current || scale <= 1) return;
    setOffset({
      x: dragRef.current.ox + (e.clientX - dragRef.current.x),
      y: dragRef.current.oy + (e.clientY - dragRef.current.y),
    });
  };

  const onImagePointerUp = () => {
    dragRef.current = null;
  };

  const onImageClick = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      if (scale > 1) resetZoom();
      else setScale(2.5);
    }
    lastTapRef.current = now;
  };

  return (
    <div className="shop-zoom" role="dialog" aria-modal="true" aria-label="Zoom product image">
      <button type="button" className="shop-zoom-backdrop" onClick={onClose} aria-label="Close zoom view" />

      <div className="shop-zoom-toolbar">
        <button type="button" className="shop-zoom-tool" onClick={onClose} aria-label="Close">
          <CloseIcon />
        </button>
        <span className="shop-zoom-counter">
          {index + 1} / {images.length}
        </span>
        <div className="shop-zoom-zoom-btns">
          <button type="button" className="shop-zoom-tool" onClick={zoomOut} disabled={scale <= 1} aria-label="Zoom out">
            −
          </button>
          <button type="button" className="shop-zoom-tool" onClick={zoomIn} disabled={scale >= 3} aria-label="Zoom in">
            +
          </button>
        </div>
      </div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            className="shop-zoom-nav shop-zoom-nav-prev"
            onClick={goPrev}
            disabled={index === 0}
            aria-label="Previous photo"
          >
            ‹
          </button>
          <button
            type="button"
            className="shop-zoom-nav shop-zoom-nav-next"
            onClick={goNext}
            disabled={index === images.length - 1}
            aria-label="Next photo"
          >
            ›
          </button>
        </>
      )}

      <div className="shop-zoom-stage">
        <img
          src={images[index]}
          alt={alt}
          className="shop-zoom-image"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          }}
          onClick={onImageClick}
          onPointerDown={onImagePointerDown}
          onPointerMove={onImagePointerMove}
          onPointerUp={onImagePointerUp}
          onPointerCancel={onImagePointerUp}
          draggable={false}
        />
      </div>

      <p className="shop-zoom-hint">Double-tap to zoom · Drag when zoomed</p>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}
