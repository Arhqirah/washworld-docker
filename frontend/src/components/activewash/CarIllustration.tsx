// CarIllustration – den animerede bil-illustration der vises under en aktiv vask.
// Bruges af activewash/page.tsx.
//
// Viser en bil-illustration der skifter udseende baseret på vasketrin:
//   sæbe    → vanddråber + sæbebobler falder ned over bilen
//   skyl    → rivulets (vandstriber) der render ned langs bilen
//   tørring → vindstød animeret som SVG-kurver der passerer bilen
//   færdig  → gnister/stjerner og bilen lyser op
//
// Nozzle (defineret nedenfor) er dysen øverst der tændes/slukkes afhængigt af om der er vand.
// DROPS, BUBBLES, RIVULETS, WIND_GUSTS, SPARKLES er animationsdata for hvert trin.
// dirtOpacity og cleanOpacity styrer brightness-filter på bilbilledet (starter snavset, ender blank).

import Image from "next/image";

export type WashStage = "forbereder" | "sæbe" | "skyl" | "tørring" | "færdig";

// ─── Animation data ───────────────────────────────────────────────────────────

const DROPS = [
  { x: "16%", delay: 0.0,  dur: 0.7,  w: 3.5, h: 9  },
  { x: "22%", delay: 0.24, dur: 0.62, w: 3.0, h: 7  },
  { x: "29%", delay: 0.09, dur: 0.74, w: 4.0, h: 10 },
  { x: "36%", delay: 0.38, dur: 0.66, w: 3.5, h: 8  },
  { x: "43%", delay: 0.15, dur: 0.71, w: 3.0, h: 7  },
  { x: "50%", delay: 0.46, dur: 0.64, w: 5.0, h: 11 },
  { x: "57%", delay: 0.05, dur: 0.75, w: 3.5, h: 9  },
  { x: "64%", delay: 0.3,  dur: 0.68, w: 3.0, h: 7  },
  { x: "71%", delay: 0.54, dur: 0.62, w: 4.0, h: 10 },
  { x: "77%", delay: 0.18, dur: 0.72, w: 3.5, h: 8  },
  { x: "84%", delay: 0.42, dur: 0.65, w: 3.0, h: 7  },
] as const;

const BUBBLES = [
  { x: "13%", y: 52,  size: 22, delay: 0.0,  dur: 2.4 },
  { x: "27%", y: 32,  size: 16, delay: 0.7,  dur: 2.0 },
  { x: "50%", y: 22,  size: 20, delay: 1.3,  dur: 2.6 },
  { x: "67%", y: 35,  size: 15, delay: 0.4,  dur: 2.1 },
  { x: "81%", y: 52,  size: 18, delay: 1.0,  dur: 2.3 },
  { x: "20%", y: 86,  size: 14, delay: 1.6,  dur: 2.0 },
  { x: "45%", y: 80,  size: 18, delay: 0.8,  dur: 2.5 },
  { x: "73%", y: 78,  size: 13, delay: 1.2,  dur: 1.9 },
  { x: "37%", y: 120, size: 16, delay: 0.3,  dur: 2.2 },
  { x: "63%", y: 112, size: 14, delay: 1.1,  dur: 2.4 },
  { x: "10%", y: 115, size: 11, delay: 0.6,  dur: 1.8 },
  { x: "88%", y: 108, size: 12, delay: 1.8,  dur: 2.0 },
] as const;

const RIVULETS = [
  { x: "19%", y: 18, len: 65, delay: 0.0,  dur: 0.9  },
  { x: "33%", y: 12, len: 55, delay: 0.35, dur: 0.82 },
  { x: "50%", y: 10, len: 72, delay: 0.68, dur: 1.0  },
  { x: "67%", y: 14, len: 58, delay: 0.18, dur: 0.88 },
  { x: "81%", y: 20, len: 48, delay: 0.5,  dur: 0.94 },
  { x: "26%", y: 70, len: 45, delay: 0.8,  dur: 0.85 },
  { x: "74%", y: 68, len: 42, delay: 0.42, dur: 0.92 },
] as const;

const WIND_GUSTS = [
  { y: 78,  wPrimary: 4.0, wShadow: 1.8, dur: 0.9,  delay: 0.0  },
  { y: 96,  wPrimary: 3.4, wShadow: 1.5, dur: 0.82, delay: 0.22 },
  { y: 114, wPrimary: 3.8, wShadow: 1.7, dur: 0.96, delay: 0.44 },
  { y: 131, wPrimary: 3.0, wShadow: 1.3, dur: 0.88, delay: 0.14 },
  { y: 148, wPrimary: 2.6, wShadow: 1.1, dur: 0.78, delay: 0.36 },
] as const;

const SPARKLES = [
  { x: 22,  y: 52,  size: 13, delay: 0.0  },
  { x: 274, y: 48,  size: 12, delay: 0.28 },
  { x: 150, y: 10,  size: 14, delay: 0.56 },
  { x: 280, y: 148, size: 11, delay: 0.84 },
  { x: 14,  y: 155, size: 12, delay: 0.42 },
  { x: 212, y: 8,   size: 13, delay: 0.7  },
  { x: 52,  y: 118, size: 10, delay: 0.18 },
  { x: 248, y: 112, size: 10, delay: 0.62 },
] as const;

const NOZZLE_H = 34;

// ─── Nozzle ───────────────────────────────────────────────────────────────────
// Dysen øverst i illustrationen. Tændes når der er vand (sæbe- eller skylletrin).

function Nozzle({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 280 34" style={{ display: "block", width: "100%" }} aria-hidden="true">
      <rect
        x="112" y="4" width="56" height="20" rx="6"
        fill="white"
        opacity={active ? 0.88 : 0.2}
        style={{ transition: "opacity 0.5s" }}
      />
      {[123, 131, 140, 149, 157].map((x) => (
        <circle
          key={x} cx={x} cy="19" r="3.2"
          fill="rgba(0,26,8,0.62)"
          opacity={active ? 0.9 : 0.22}
          style={{ transition: "opacity 0.5s" }}
        />
      ))}
      <rect
        x="128" y="0" width="24" height="6" rx="3"
        fill="white"
        opacity={active ? 0.55 : 0.1}
        style={{ transition: "opacity 0.5s" }}
      />
    </svg>
  );
}

// ─── CarIllustration ──────────────────────────────────────────────────────────

export function CarIllustration({ stage, progress }: { stage: WashStage; progress: number }) {
  const showSoap  = stage === "sæbe";
  const showRinse = stage === "skyl";
  const showDry   = stage === "tørring";
  const showClean = stage === "færdig";
  const showWater = showSoap || showRinse;

  const dirtOpacity  = Math.max(0, 1 - progress / 28);
  const cleanOpacity = Math.max(0, (progress - 88) / 12);

  return (
    <>
      <style>{`
        @keyframes cwDrop {
          0%   { transform: translateY(0px);   opacity: 0;    }
          8%   {                               opacity: 0.90; }
          88%  {                               opacity: 0.90; }
          100% { transform: translateY(210px); opacity: 0;    }
        }
        @keyframes cwBubble {
          0%   { transform: scale(0)    translateY(0px);   opacity: 0;    }
          12%  { transform: scale(1.12) translateY(0px);   opacity: 0.95; }
          75%  { transform: scale(1)    translateY(-7px);  opacity: 0.75; }
          93%  { transform: scale(1.06) translateY(-10px); opacity: 0.22; }
          100% { transform: scale(0)    translateY(-13px); opacity: 0;    }
        }
        @keyframes cwRivulet {
          0%   { transform: translateY(-28px); opacity: 0;    }
          14%  {                               opacity: 0.60; }
          86%  {                               opacity: 0.60; }
          100% { transform: translateY(52px);  opacity: 0;    }
        }
        @keyframes cwWind {
          0%   { transform: translateX(14px);  opacity: 0;    }
          20%  { transform: translateX(0px);   opacity: 1;    }
          70%  { transform: translateX(-18px); opacity: 0.88; }
          100% { transform: translateX(-36px); opacity: 0;    }
        }
        @keyframes cwWindShadow {
          0%   { transform: translateX(20px);  opacity: 0;    }
          20%  { transform: translateX(6px);   opacity: 0.50; }
          70%  { transform: translateX(-12px); opacity: 0.42; }
          100% { transform: translateX(-30px); opacity: 0;    }
        }
        @keyframes cwSpark {
          0%   { transform: scale(0.0) rotate(0deg);  opacity: 0;    }
          18%  { transform: scale(1.4) rotate(15deg); opacity: 1;    }
          55%  { transform: scale(1.0) rotate(45deg); opacity: 0.92; }
          82%  { transform: scale(1.2) rotate(72deg); opacity: 0.80; }
          100% { transform: scale(0.0) rotate(90deg); opacity: 0;    }
        }
        @keyframes cwGlow {
          0%,100% { transform: scale(0.3); opacity: 0;    }
          30%,68% { transform: scale(1.0); opacity: 0.28; }
        }
      `}</style>

      <div className="relative mx-auto w-full" style={{ maxWidth: 300 }}>
        <Nozzle active={showWater} />

        <Image
          src="/icons/car.png"
          alt="Car being washed"
          width={560}
          height={330}
          style={{
            display: "block",
            width: "100%",
            height: "auto",
            mixBlendMode: "screen",
            filter: showClean
              ? `brightness(${1 + cleanOpacity * 0.2})`
              : dirtOpacity > 0
                ? `brightness(${1 - dirtOpacity * 0.16})`
                : "brightness(1)",
            transition: "filter 0.8s ease",
          }}
          priority
        />

        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", overflow: "hidden" }}>
          {/* Vanddråber */}
          {showWater && DROPS.map((d, i) => (
            <div
              key={i}
              style={{
                position: "absolute", left: d.x, top: 14,
                width: d.w, height: d.h,
                borderRadius: "50% 50% 40% 40% / 38% 38% 62% 62%",
                background: "rgba(255,255,255,0.90)",
                animation: `cwDrop ${d.dur}s ease-in ${d.delay}s infinite`,
              }}
            />
          ))}

          {/* Sæbebobler */}
          {showSoap && BUBBLES.map((b, i) => (
            <div
              key={i}
              style={{
                position: "absolute", left: b.x, top: NOZZLE_H + b.y,
                width: b.size, height: b.size, borderRadius: "50%",
                background: "radial-gradient(circle at 34% 34%, rgba(255,255,255,0.88), rgba(255,255,255,0.06))",
                border: "1.5px solid rgba(255,255,255,0.48)",
                animation: `cwBubble ${b.dur}s ease-in-out ${b.delay}s infinite`,
              }}
            />
          ))}

          {/* Vandstriber (skyl) */}
          {showRinse && RIVULETS.map((r, i) => (
            <div
              key={i}
              style={{
                position: "absolute", left: r.x, top: NOZZLE_H + r.y,
                width: 2.5, height: r.len, borderRadius: 3,
                background: "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0.72) 30%, rgba(255,255,255,0.72) 70%, rgba(255,255,255,0))",
                animation: `cwRivulet ${r.dur}s ease-in-out ${r.delay}s infinite`,
              }}
            />
          ))}

          {/* Vindstød (tørring) */}
          {showDry && (
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 300 230" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
              {WIND_GUSTS.map((g, i) => (
                <g key={i}>
                  <path d={`M 278,${g.y} Q 238,${g.y + 12} 184,${g.y - 7}`} stroke="white" strokeWidth={g.wPrimary} fill="none" strokeLinecap="round" style={{ animation: `cwWind ${g.dur}s ease-in-out ${g.delay}s infinite` }} />
                  <path d={`M 270,${g.y + 8} Q 232,${g.y + 18} 180,${g.y + 3}`} stroke="white" strokeWidth={g.wShadow} fill="none" strokeLinecap="round" style={{ animation: `cwWindShadow ${g.dur}s ease-in-out ${g.delay + 0.07}s infinite` }} />
                </g>
              ))}
            </svg>
          )}

          {/* Gnister (færdig) */}
          {showClean && (
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 300 230" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
              {SPARKLES.map((s, i) => (
                <g key={i} transform={`translate(${s.x},${s.y})`}>
                  <circle r={s.size * 1.8} fill="white" style={{ animation: `cwGlow 1.8s ease-in-out ${s.delay}s infinite` }} />
                  <g style={{ animation: `cwSpark 1.8s ease-in-out ${s.delay}s infinite` }}>
                    <line x1={-s.size} y1="0" x2={s.size} y2="0" stroke="white" strokeWidth="3.2" strokeLinecap="round" />
                    <line x1="0" y1={-s.size} x2="0" y2={s.size} stroke="white" strokeWidth="3.2" strokeLinecap="round" />
                    <line x1={-s.size * 0.65} y1={-s.size * 0.65} x2={s.size * 0.65} y2={s.size * 0.65} stroke="white" strokeWidth="2.0" strokeLinecap="round" opacity="0.78" />
                    <line x1={s.size * 0.65} y1={-s.size * 0.65} x2={-s.size * 0.65} y2={s.size * 0.65} stroke="white" strokeWidth="2.0" strokeLinecap="round" opacity="0.78" />
                  </g>
                </g>
              ))}
              <g opacity={cleanOpacity}>
                <path d="M 17,96 L 0,78 L 0,114 Z" fill="white" opacity="0.20" />
                <path d="M 283,96 L 300,78 L 300,114 Z" fill="white" opacity="0.20" />
              </g>
            </svg>
          )}

          {/* Snavsoverlay der forsvinder i takt med at bilen vaskes */}
          {dirtOpacity > 0 && (
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 300 230" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
              <g opacity={dirtOpacity} style={{ transition: "opacity 0.7s" }}>
                <ellipse cx="80"  cy="168" rx="16" ry="7" fill="rgba(0,0,0,0.32)" />
                <ellipse cx="220" cy="165" rx="14" ry="6" fill="rgba(0,0,0,0.28)" />
                <ellipse cx="150" cy="175" rx="12" ry="5" fill="rgba(0,0,0,0.24)" />
                <path d="M 120,90 Q 124,112 122,134" stroke="rgba(0,0,0,0.22)" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M 178,88 Q 182,110 180,132" stroke="rgba(0,0,0,0.20)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <path d="M 112,72 Q 132,60 154,56" stroke="rgba(0,0,0,0.18)" strokeWidth="3" fill="none" strokeLinecap="round" />
              </g>
            </svg>
          )}
        </div>
      </div>
    </>
  );
}
