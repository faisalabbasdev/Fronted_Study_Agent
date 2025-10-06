"use client"

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface LEDVideoProps {
  src: string
  alt?: string
  className?: string
  width?: number
  height?: number
  ledIntensity?: 'low' | 'medium' | 'high'
  ledColor?: 'blue' | 'green' | 'purple' | 'red' | 'cyan' | 'amber'
  autoPlay?: boolean
  loop?: boolean
  muted?: boolean
}

export function LEDVideo({
  src,
  alt = "LED Video",
  className,
  width = 400,
  height = 300,
  ledIntensity = 'medium',
  ledColor = 'blue',
  autoPlay = true,
  loop = true,
  muted = true
}: LEDVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const ledIntensityMap = {
    low: 0.3,
    medium: 0.6,
    high: 0.9
  }

  const ledColorMap = {
    blue: '#3b82f6',
    green: '#10b981',
    purple: '#8b5cf6',
    red: '#ef4444',
    cyan: '#06b6d4',
    amber: '#f59e0b'
  }

  useEffect(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const drawLEDEffect = () => {
      if (video.readyState >= 2) {
        // Draw the video frame
        ctx.drawImage(video, 0, 0, width, height)
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, width, height)
        const data = imageData.data
        
        // Apply LED effect
        for (let i = 0; i < data.length; i += 4) {
          // Create LED grid effect
          const x = (i / 4) % width
          const y = Math.floor((i / 4) / width)
          
          // LED spacing (every 4 pixels)
          if (x % 4 === 0 && y % 4 === 0) {
            // Brighten the pixel for LED effect
            data[i] = Math.min(255, data[i] * (1 + ledIntensityMap[ledIntensity]))
            data[i + 1] = Math.min(255, data[i + 1] * (1 + ledIntensityMap[ledIntensity]))
            data[i + 2] = Math.min(255, data[i + 2] * (1 + ledIntensityMap[ledIntensity]))
            
            // Add LED color tint
            const ledR = parseInt(ledColorMap[ledColor].slice(1, 3), 16)
            const ledG = parseInt(ledColorMap[ledColor].slice(3, 5), 16)
            const ledB = parseInt(ledColorMap[ledColor].slice(5, 7), 16)
            
            data[i] = Math.min(255, (data[i] + ledR * 0.2))
            data[i + 1] = Math.min(255, (data[i + 1] + ledG * 0.2))
            data[i + 2] = Math.min(255, (data[i + 2] + ledB * 0.2))
          } else {
            // Darken non-LED pixels
            data[i] *= 0.3
            data[i + 1] *= 0.3
            data[i + 2] *= 0.3
          }
        }
        
        // Put the modified image data back
        ctx.putImageData(imageData, 0, 0)
      }
      
      requestAnimationFrame(drawLEDEffect)
    }

    const handleLoadedData = () => {
      setIsLoaded(true)
      drawLEDEffect()
    }

    const handleError = () => {
      setError('Failed to load video')
    }

    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('error', handleError)

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData)
      video.removeEventListener('error', handleError)
    }
  }, [width, height, ledIntensity, ledColor])

  if (error) {
    return (
      <div className={cn(
        "w-full h-80 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center",
        className
      )}>
        <div className="text-center">
          <div className="h-24 w-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">📹</span>
          </div>
          <h4 className="text-xl font-semibold mb-2">AI-Powered Learning</h4>
          <p className="text-muted-foreground">Video unavailable</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("relative w-full h-80 rounded-2xl overflow-hidden", className)}>
      {/* LED Border Effect */}
      <div className="absolute inset-0 rounded-2xl border-2 border-primary/30 shadow-2xl shadow-primary/20" />
      
      {/* LED Corner Effects */}
      <div className="absolute top-2 left-2 w-4 h-4 bg-primary rounded-full animate-pulse" />
      <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full animate-pulse" />
      <div className="absolute bottom-2 left-2 w-4 h-4 bg-primary rounded-full animate-pulse" />
      <div className="absolute bottom-2 right-2 w-4 h-4 bg-primary rounded-full animate-pulse" />
      
      {/* Video Container */}
      <div className="relative w-full h-full">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          playsInline
          style={{ display: isLoaded ? 'block' : 'none' }}
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="w-full h-full object-cover"
          style={{ display: isLoaded ? 'block' : 'none' }}
        />
        
        {/* Loading State */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <div className="text-center">
              <div className="h-24 w-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <span className="text-4xl">🎬</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">AI-Powered Learning</h4>
              <p className="text-muted-foreground">Loading video...</p>
            </div>
          </div>
        )}
        
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
    </div>
  )
}
