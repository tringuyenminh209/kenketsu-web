import { Player } from '@lottiefiles/react-lottie-player'

interface LottieIconProps {
  src: string
  size?: number
  loop?: boolean
  autoplay?: boolean
  className?: string
}

export function LottieIcon({ src, size = 80, loop = true, autoplay = true, className }: LottieIconProps) {
  return (
    <Player
      src={src}
      autoplay={autoplay}
      loop={loop}
      style={{ width: size, height: size }}
      className={className}
    />
  )
}
