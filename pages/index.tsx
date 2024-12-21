import { useEffect, useRef } from 'react'
import MainRobotCanvas from '@/utils/canvas'
import "./index.css"

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const mainCanvas = useRef<MainRobotCanvas>(null)

  useEffect(() => {
    if (canvasRef.current) {
      initCanvas().catch()
    }
  }, [])

  const initCanvas = async () => {
    mainCanvas.current = new MainRobotCanvas({ canvas: canvasRef.current })
    await mainCanvas.current.startAnimation()
  }

  return (
    <div className="container">
      <canvas ref={canvasRef} className="canvas" />
    </div>
  );
}
