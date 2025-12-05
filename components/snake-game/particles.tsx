"use client"

interface ParticlesProps {
  particles: { x: number; y: number; id: number }[]
}

export function Particles({ particles }: ParticlesProps) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
      {particles.map((particle) => (
        <div key={particle.id} className="absolute" style={{ left: particle.x, top: particle.y }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute h-2 w-2 rounded-full bg-accent"
              style={{
                animation: `particle-${i} 1s ease-out forwards`,
              }}
            />
          ))}
        </div>
      ))}
      <style jsx>{`
        @keyframes particle-0 {
          to {
            transform: translate(30px, -30px);
            opacity: 0;
          }
        }
        @keyframes particle-1 {
          to {
            transform: translate(40px, 0px);
            opacity: 0;
          }
        }
        @keyframes particle-2 {
          to {
            transform: translate(30px, 30px);
            opacity: 0;
          }
        }
        @keyframes particle-3 {
          to {
            transform: translate(0px, 40px);
            opacity: 0;
          }
        }
        @keyframes particle-4 {
          to {
            transform: translate(-30px, 30px);
            opacity: 0;
          }
        }
        @keyframes particle-5 {
          to {
            transform: translate(-40px, 0px);
            opacity: 0;
          }
        }
        @keyframes particle-6 {
          to {
            transform: translate(-30px, -30px);
            opacity: 0;
          }
        }
        @keyframes particle-7 {
          to {
            transform: translate(0px, -40px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
