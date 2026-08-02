import { useEffect, useRef } from 'react'

interface AmbientCanvasProps {
  theme: 'light' | 'dark'
}

interface Particle {
  alpha: number
  drift: number
  radius: number
  speed: number
  x: number
  y: number
}

export function AmbientCanvas({ theme }: AmbientCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const context = canvas.getContext('2d')
    if (!context) return undefined

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let animationFrame = 0
    let isDocumentVisible = !document.hidden
    let isInViewport = true
    let width = 0
    let height = 0
    let dpr = 1
    let particles: Particle[] = []
    const pointer = { x: 0.68, y: 0.36 }
    const targetPointer = { ...pointer }

    const colors = theme === 'dark'
      ? { glow: '86, 214, 240', node: '166, 236, 248' }
      : { glow: '74, 160, 194', node: '19, 116, 144' }

    const buildParticles = () => {
      const count = prefersReducedMotion ? 0 : Math.max(5, Math.min(18, Math.round((width * height) / 95000)))
      particles = Array.from({ length: count }, () => ({
        alpha: 0.14 + Math.random() * 0.25,
        drift: (Math.random() - 0.5) * 0.12,
        radius: 1 + Math.random() * 1.6,
        speed: 0.0007 + Math.random() * 0.0011,
        x: Math.random(),
        y: Math.random(),
      }))
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = Math.max(1, rect.width)
      height = Math.max(1, rect.height)
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      buildParticles()
    }

    const shouldAnimate = () => isDocumentVisible && isInViewport && !prefersReducedMotion

    const stopAnimation = () => {
      window.cancelAnimationFrame(animationFrame)
      animationFrame = 0
    }

    const requestDraw = () => {
      if (shouldAnimate() && animationFrame === 0) {
        animationFrame = window.requestAnimationFrame(draw)
      }
    }

    const draw = (time: number) => {
      animationFrame = 0
      context.clearRect(0, 0, width, height)
      pointer.x += (targetPointer.x - pointer.x) * 0.035
      pointer.y += (targetPointer.y - pointer.y) * 0.035

      const glow = context.createRadialGradient(
        pointer.x * width,
        pointer.y * height,
        0,
        pointer.x * width,
        pointer.y * height,
        Math.max(width, height) * 0.55,
      )
      glow.addColorStop(0, `rgba(${colors.glow}, 0.23)`)
      glow.addColorStop(0.45, `rgba(${colors.glow}, 0.065)`)
      glow.addColorStop(1, `rgba(${colors.glow}, 0)`)
      context.fillStyle = glow
      context.fillRect(0, 0, width, height)

      for (const particle of particles) {
        const y = ((particle.y + time * particle.speed) % 1) * height
        const x = (particle.x + Math.sin(time * 0.00035 + particle.y * 12) * particle.drift) * width
        context.beginPath()
        context.arc(x, y, particle.radius, 0, Math.PI * 2)
        context.fillStyle = `rgba(${colors.node}, ${particle.alpha})`
        context.fill()
      }

      requestDraw()
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!isInViewport) return

      const rect = canvas.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return

      targetPointer.x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width))
      targetPointer.y = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height))
    }

    const onVisibilityChange = () => {
      isDocumentVisible = !document.hidden
      if (shouldAnimate()) requestDraw()
      else stopAnimation()
    }

    const observer = 'IntersectionObserver' in window
      ? new IntersectionObserver(([entry]) => {
        isInViewport = entry?.isIntersecting ?? false
        if (shouldAnimate()) requestDraw()
        else stopAnimation()
      }, { threshold: 0 })
      : undefined

    resize()
    draw(0)
    observer?.observe(canvas)
    window.addEventListener('resize', resize, { passive: true })
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      stopAnimation()
      observer?.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [theme])

  return <canvas ref={canvasRef} aria-hidden="true" />
}
