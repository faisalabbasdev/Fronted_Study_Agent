"use client"

import * as React from "react"

/**
 * Animated AI-inspired background
 * - Lightweight CSS-based waves + dots
 * - Subtle parallax on pointer move and scroll
 * - Non-interactive (pointer-events-none)
 */
export default function AnimatedBackground() {
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches
    const layers = Array.from(el.querySelectorAll<HTMLElement>("[data-layer]"))

    if (prefersReduced) {
      layers.forEach((layer) => {
        layer.style.transform = "none"
        layer.style.translate = "0 0"
        layer.style.animation = "none"
      })
      return
    }

    let raf = 0
    const state = { x: 0, y: 0, tx: 0, ty: 0 }

    const onMove = (e: PointerEvent) => {
      const { innerWidth, innerHeight } = window
      state.tx = (e.clientX / innerWidth - 0.5) * 2
      state.ty = (e.clientY / innerHeight - 0.5) * 2
    }

    const step = () => {
      // smooth follow
      state.x += (state.tx - state.x) * 0.06
      state.y += (state.ty - state.y) * 0.06
      layers.forEach((layer, i) => {
        const depth = (i + 1) * 5
        layer.style.transform = `translate3d(${state.x * depth}px, ${state.y * depth}px, 0)`
      })
      raf = requestAnimationFrame(step)
    }

    const onScroll = () => {
      const y = window.scrollY * 0.02
      layers.forEach((layer, i) => {
        layer.style.translate = `0 ${y * (i + 1)}px`
      })
    }

    window.addEventListener("pointermove", onMove)
    window.addEventListener("scroll", onScroll, { passive: true })
    raf = requestAnimationFrame(step)
    return () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div ref={containerRef} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Layer 1: soft gradient waves */}
      <div
        data-layer
        className="absolute inset-0 animate-[slow-pan_40s_linear_infinite] bg-[radial-gradient(60%_40%_at_10%_10%,_color-mix(in_oklab,_var(--color-primary)_15%,_transparent)_0%,_transparent_60%),radial-gradient(50%_40%_at_90%_20%,_color-mix(in_oklab,_var(--color-accent)_14%,_transparent)_0%,_transparent_60%),radial-gradient(60%_50%_at_50%_110%,_color-mix(in_oklab,_var(--color-primary)_10%,_transparent)_0%,_transparent_70%)] opacity-70"
      />
      {/* Layer 2: animated grid lines */}
      <div
        data-layer
        className="absolute inset-0 mix-blend-overlay opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in oklab, var(--color-primary) 18%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--color-primary) 18%, transparent) 1px, transparent 1px)",
          backgroundSize: "48px 48px, 48px 48px",
          maskImage: "radial-gradient(100% 120% at 50% 50%, black, rgba(0,0,0,0.25))",
        }}
      />
      {/* Layer 3: floating nodes */}
      <div className="absolute inset-0">
        <div className="ai-node" style={{ left: "12%", top: "22%" }} />
        <div className="ai-node" style={{ left: "32%", top: "68%" }} />
        <div className="ai-node" style={{ left: "58%", top: "36%" }} />
        <div className="ai-node" style={{ left: "78%", top: "18%" }} />
        <div className="ai-node" style={{ left: "84%", top: "70%" }} />
        <div className="ai-node" style={{ left: "18%", top: "80%" }} />
      </div>
      {/* Subtle orbital layer */}
      <div data-layer className="absolute inset-0">
        <div className="ai-orbit" style={{ left: "10%", top: "30%", "--r": "38px" } as React.CSSProperties} />
        <div className="ai-orbit" style={{ left: "75%", top: "28%", "--r": "44px" } as React.CSSProperties} />
        <div className="ai-orbit" style={{ left: "60%", top: "70%", "--r": "34px" } as React.CSSProperties} />
      </div>
    </div>
  )
}
