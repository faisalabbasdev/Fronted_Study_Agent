"use client"

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { Brain, Sparkles, Zap, Target } from 'lucide-react'

interface LEDDemoProps {
  className?: string
  width?: number
  height?: number
  ledIntensity?: 'low' | 'medium' | 'high'
  ledColor?: 'blue' | 'green' | 'purple' | 'red' | 'cyan' | 'amber'
}

export function LEDDemo({
  className,
  width = 400,
  height = 300,
  ledIntensity = 'medium',
  ledColor = 'blue'
}: LEDDemoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const ledIntensityMap = {
    low: 0.3,
    medium: 0.6,
    high: 0.9
  }

  const ledColorMap = {
    blue: { r: 59, g: 130, b: 246 },
    green: { r: 16, g: 185, b: 129 },
    purple: { r: 139, g: 92, b: 246 },
    red: { r: 239, g: 68, b: 68 },
    cyan: { r: 6, g: 182, b: 212 },
    amber: { r: 245, g: 158, b: 11 }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number

    const animate = () => {
      ctx.clearRect(0, 0, width, height)
      
      // Create animated background
      const time = Date.now() * 0.001
      
      // Gradient background
      const gradient = ctx.createLinearGradient(0, 0, width, height)
      gradient.addColorStop(0, `rgba(${ledColorMap[ledColor].r}, ${ledColorMap[ledColor].g}, ${ledColorMap[ledColor].b}, 0.1)`)
      gradient.addColorStop(1, `rgba(${ledColorMap[ledColor].r}, ${ledColorMap[ledColor].g}, ${ledColorMap[ledColor].b}, 0.05)`)
      
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)
      
      // Create LED grid effect
      const ledSize = 4
      const spacing = 8
      
      for (let x = 0; x < width; x += spacing) {
        for (let y = 0; y < height; y += spacing) {
          const distance = Math.sqrt((x - width/2) ** 2 + (y - height/2) ** 2)
          const wave = Math.sin(time * 2 + distance * 0.01) * 0.5 + 0.5
          const intensity = wave * ledIntensityMap[ledIntensity]
          
          if (intensity > 0.1) {
            ctx.fillStyle = `rgba(${ledColorMap[ledColor].r}, ${ledColorMap[ledColor].g}, ${ledColorMap[ledColor].b}, ${intensity})`
            ctx.fillRect(x, y, ledSize, ledSize)
            
            // Add glow effect
            ctx.shadowColor = `rgb(${ledColorMap[ledColor].r}, ${ledColorMap[ledColor].g}, ${ledColorMap[ledColor].b})`
            ctx.shadowBlur = 10
            ctx.fillRect(x, y, ledSize, ledSize)
            ctx.shadowBlur = 0
          }
        }
      }
      
      // Add animated elements
      const centerX = width / 2
      const centerY = height / 2
      
      // Animated brain icon with pulsing effect
      const brainSize = 60 + Math.sin(time * 1.5) * 10
      ctx.save()
      ctx.translate(centerX, centerY - 20)
      ctx.scale(brainSize / 100, brainSize / 100)
      
      // Draw brain shape with gradient
      const brainGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 30)
      brainGradient.addColorStop(0, `rgba(${ledColorMap[ledColor].r}, ${ledColorMap[ledColor].g}, ${ledColorMap[ledColor].b}, 0.9)`)
      brainGradient.addColorStop(1, `rgba(${ledColorMap[ledColor].r}, ${ledColorMap[ledColor].g}, ${ledColorMap[ledColor].b}, 0.6)`)
      
      ctx.fillStyle = brainGradient
      ctx.beginPath()
      ctx.arc(0, 0, 30, 0, Math.PI * 2)
      ctx.fill()
      
      // Add glow effect
      ctx.shadowColor = `rgb(${ledColorMap[ledColor].r}, ${ledColorMap[ledColor].g}, ${ledColorMap[ledColor].b})`
      ctx.shadowBlur = 20
      ctx.fill()
      ctx.shadowBlur = 0
      
      // Add neural network lines with animation
      ctx.strokeStyle = `rgba(${ledColorMap[ledColor].r}, ${ledColorMap[ledColor].g}, ${ledColorMap[ledColor].b}, 0.8)`
      ctx.lineWidth = 2
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 + time * 0.5
        const wave = Math.sin(time * 2 + i) * 0.3 + 0.7
        const startX = Math.cos(angle) * 20
        const startY = Math.sin(angle) * 20
        const endX = Math.cos(angle) * (35 + Math.sin(time + i) * 5)
        const endY = Math.sin(angle) * (35 + Math.sin(time + i) * 5)
        
        ctx.globalAlpha = wave
        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(endX, endY)
        ctx.stroke()
      }
      ctx.globalAlpha = 1
      
      ctx.restore()
      
      // Add data flow lines
      for (let i = 0; i < 5; i++) {
        const y = (height / 6) * (i + 1)
        const startX = -50 + (time * 50) % (width + 100)
        const endX = startX + 100
        
        ctx.strokeStyle = `rgba(${ledColorMap[ledColor].r}, ${ledColorMap[ledColor].g}, ${ledColorMap[ledColor].b}, 0.4)`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(startX, y)
        ctx.lineTo(endX, y)
        ctx.stroke()
      }
      
      // Add floating particles
      for (let i = 0; i < 20; i++) {
        const x = (Math.sin(time * 0.5 + i) * 0.5 + 0.5) * width
        const y = (Math.cos(time * 0.3 + i * 0.5) * 0.5 + 0.5) * height
        const size = 2 + Math.sin(time + i) * 1
        
        ctx.fillStyle = `rgba(${ledColorMap[ledColor].r}, ${ledColorMap[ledColor].g}, ${ledColorMap[ledColor].b}, 0.6)`
        ctx.fillRect(x, y, size, size)
      }
      
      animationId = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [width, height, ledIntensity, ledColor])

  return (
    <div className={cn("relative w-full h-80 rounded-2xl overflow-hidden", className)}>
      {/* LED Border Effect */}
      <div className="absolute inset-0 rounded-2xl border-2 border-primary/30 shadow-2xl shadow-primary/20" />
      
      {/* LED Corner Effects */}
      <div className="absolute top-2 left-2 w-4 h-4 bg-primary rounded-full animate-pulse" />
      <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full animate-pulse" />
      <div className="absolute bottom-2 left-2 w-4 h-4 bg-primary rounded-full animate-pulse" />
      <div className="absolute bottom-2 right-2 w-4 h-4 bg-primary rounded-full animate-pulse" />
      
      {/* Canvas for LED effect */}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-full object-cover"
      />
      
      {/* LED Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }} />
      </div>
      
      {/* LED Scan Lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-b from-transparent via-primary/5 to-transparent animate-pulse" />
      </div>
    </div>
  )
}
