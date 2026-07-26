import React from 'react';

const FloatingElements = () => {
  return (
    <div className="floating-elements">
      {/* Animated Background Particles */}
      <div className="particles-container">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* Floating Geometric Shapes */}
      <div className="geometric-shapes">
        <div className="shape shape-1">⬢</div>
        <div className="shape shape-2">◆</div>
        <div className="shape shape-3">●</div>
        <div className="shape shape-4">▲</div>
        <div className="shape shape-5">■</div>
        <div className="shape shape-6">⬟</div>
      </div>

      {/* Gradient Orbs */}
      <div className="gradient-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
        <div className="orb orb-4"></div>
      </div>

      {/* Tech Icons Floating */}
      <div className="tech-icons">
        <div className="tech-icon tech-icon-1">💼</div>
        <div className="tech-icon tech-icon-2">📄</div>
        <div className="tech-icon tech-icon-3">🎯</div>
        <div className="tech-icon tech-icon-4">⚡</div>
        <div className="tech-icon tech-icon-5">🚀</div>
        <div className="tech-icon tech-icon-6">💡</div>
      </div>

      {/* Animated Lines */}
      <div className="animated-lines">
        <div className="line line-1"></div>
        <div className="line line-2"></div>
        <div className="line line-3"></div>
      </div>

      <style>{`
        .floating-elements {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }

        /* Particles */
        .particles-container {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(102, 126, 234, 0.4) 100%);
          border-radius: 50%;
          animation: particleFloat infinite linear;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
        }

        @keyframes particleFloat {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
          }
        }

        /* Geometric Shapes */
        .geometric-shapes {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .shape {
          position: absolute;
          font-size: 2rem;
          color: rgba(255, 255, 255, 0.1);
          animation: shapeFloat infinite ease-in-out;
          filter: blur(0.5px);
        }

        .shape-1 {
          top: 10%;
          left: 10%;
          animation-duration: 20s;
          animation-delay: 0s;
        }

        .shape-2 {
          top: 20%;
          right: 15%;
          animation-duration: 25s;
          animation-delay: 5s;
        }

        .shape-3 {
          bottom: 30%;
          left: 20%;
          animation-duration: 18s;
          animation-delay: 10s;
        }

        .shape-4 {
          top: 60%;
          right: 25%;
          animation-duration: 22s;
          animation-delay: 3s;
        }

        .shape-5 {
          bottom: 20%;
          right: 10%;
          animation-duration: 28s;
          animation-delay: 8s;
        }

        .shape-6 {
          top: 40%;
          left: 5%;
          animation-duration: 24s;
          animation-delay: 12s;
        }

        @keyframes shapeFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-20px) rotate(90deg);
          }
          50% {
            transform: translateY(-40px) rotate(180deg);
          }
          75% {
            transform: translateY(-20px) rotate(270deg);
          }
        }

        /* Gradient Orbs */
        .gradient-orbs {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(40px);
          animation: orbFloat infinite ease-in-out;
        }

        .orb-1 {
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 70%);
          top: 10%;
          left: -10%;
          animation-duration: 30s;
        }

        .orb-2 {
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(67, 233, 123, 0.2) 0%, transparent 70%);
          top: 60%;
          right: -5%;
          animation-duration: 25s;
          animation-delay: 10s;
        }

        .orb-3 {
          width: 250px;
          height: 250px;
          background: radial-gradient(circle, rgba(255, 107, 107, 0.2) 0%, transparent 70%);
          bottom: 20%;
          left: 20%;
          animation-duration: 35s;
          animation-delay: 5s;
        }

        .orb-4 {
          width: 180px;
          height: 180px;
          background: radial-gradient(circle, rgba(255, 159, 67, 0.25) 0%, transparent 70%);
          top: 30%;
          right: 30%;
          animation-duration: 28s;
          animation-delay: 15s;
        }

        @keyframes orbFloat {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        /* Tech Icons */
        .tech-icons {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .tech-icon {
          position: absolute;
          font-size: 1.5rem;
          opacity: 0.1;
          animation: techIconFloat infinite ease-in-out;
        }

        .tech-icon-1 {
          top: 15%;
          left: 80%;
          animation-duration: 15s;
          animation-delay: 0s;
        }

        .tech-icon-2 {
          top: 70%;
          left: 10%;
          animation-duration: 18s;
          animation-delay: 3s;
        }

        .tech-icon-3 {
          top: 30%;
          left: 70%;
          animation-duration: 20s;
          animation-delay: 6s;
        }

        .tech-icon-4 {
          bottom: 40%;
          right: 20%;
          animation-duration: 16s;
          animation-delay: 9s;
        }

        .tech-icon-5 {
          top: 50%;
          left: 30%;
          animation-duration: 22s;
          animation-delay: 12s;
        }

        .tech-icon-6 {
          bottom: 15%;
          right: 40%;
          animation-duration: 19s;
          animation-delay: 15s;
        }

        @keyframes techIconFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.1;
          }
          50% {
            transform: translateY(-30px) rotate(180deg);
            opacity: 0.3;
          }
        }

        /* Animated Lines */
        .animated-lines {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .line {
          position: absolute;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          animation: lineMove infinite linear;
        }

        .line-1 {
          width: 200px;
          height: 1px;
          top: 25%;
          left: -200px;
          animation-duration: 8s;
          animation-delay: 0s;
        }

        .line-2 {
          width: 150px;
          height: 1px;
          top: 60%;
          left: -150px;
          animation-duration: 10s;
          animation-delay: 4s;
        }

        .line-3 {
          width: 180px;
          height: 1px;
          top: 80%;
          left: -180px;
          animation-duration: 12s;
          animation-delay: 8s;
        }

        @keyframes lineMove {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(100vw + 200px));
          }
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .orb {
            filter: blur(20px);
          }
          
          .orb-1,
          .orb-2,
          .orb-3,
          .orb-4 {
            width: 150px;
            height: 150px;
          }
          
          .shape {
            font-size: 1.5rem;
          }
          
          .tech-icon {
            font-size: 1.2rem;
          }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .particle,
          .shape,
          .orb,
          .tech-icon,
          .line {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
};

export default FloatingElements;