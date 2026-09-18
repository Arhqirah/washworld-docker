// CompletionModal – pop-up der vises når vasken er færdig (progress = 100%).
// Bruges af activewash/page.tsx.
//
// Viser en animation med grønne dråber, bobler og gnister rundt om et "vask afsluttet"-ikon.
// CSS-animationerne (backdropIn, cardIn, dropFloat, bubbleFloat, sparkPop) er defineret i globals.css.
//
// onReceipt → sender brugeren til receipts/page.tsx for at se kvitteringen
// onClose   → sender brugeren tilbage til dashboard

import Image from "next/image";

interface CompletionModalProps {
  onClose: () => void;
  onReceipt: () => void;
}

export function CompletionModal({ onClose, onReceipt }: CompletionModalProps) {
  return (
    <>
      {/* Baggrundsdimmer */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.55)",
          zIndex: 40,
          animation: "backdropIn 0.25s ease",
        }}
      />

      {/* Kortdialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        style={{
          position: "fixed", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "calc(100% - 40px)", maxWidth: 360,
          background: "white", borderRadius: 3,
          padding: "28px 24px 24px",
          zIndex: 50,
          animation: "cardIn 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards",
          boxShadow: "0 24px 64px rgba(0,0,0,0.25)",
        }}
      >
        <h2
          id="modal-title"
          style={{ textAlign: "center", fontSize: 26, fontWeight: 800, color: "#111", margin: "0 0 20px", letterSpacing: "-0.01em" }}
        >
          Vask afsluttet
        </h2>

        {/* Dekorationsområde med dråber, bobler og gnister */}
        <div style={{ position: "relative", height: 148, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
          {/* Dråber */}
          {[
            { top: 4,  right: "22%", width: 18, height: 26, gradient: "160deg, #66bb6a, #2e7d32", delay: "0s",   dur: "2.2s" },
            { bottom: 8, left: "18%", width: 14, height: 20, gradient: "160deg, #81c784, #388e3c", delay: "0.4s", dur: "2.6s" },
            { top: 16, left: "24%",  width: 10, height: 15, gradient: "160deg, #a5d6a7, #43a047", delay: "0.8s", dur: "2.0s" },
            { bottom: 14, right: "16%", width: 11, height: 17, gradient: "160deg, #81c784, #2e7d32", delay: "0.6s", dur: "2.4s" },
          ].map((d, i) => (
            <div
              key={i}
              style={{
                position: "absolute", ...d,
                background: `linear-gradient(${d.gradient})`,
                borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%",
                transform: "rotate(180deg)",
                animation: `dropFloat ${d.dur} ease-in-out ${d.delay} infinite`,
              }}
            />
          ))}

          {/* Bobler */}
          {[
            { top: 10,  left: "8%",  size: 32, delay: "0s",   dur: "3s"   },
            { bottom: 4, right: "8%", size: 22, delay: "0.5s", dur: "2.8s" },
          ].map((b, i) => (
            <div
              key={i}
              style={{
                position: "absolute", ...b,
                width: b.size, height: b.size, borderRadius: "50%",
                border: "2px solid rgba(100,180,100,0.45)",
                background: "rgba(150,220,150,0.08)",
                animation: `bubbleFloat ${b.dur} ease-in-out ${b.delay} infinite`,
              }}
            />
          ))}

          {/* Gnister */}
          {([
            { top: 6,    left: "42%",  size: 10, delay: "0s"    },
            { top: 18,   right: "6%",  size: 8,  delay: "0.35s" },
            { bottom: 6, left: "6%",   size: 9,  delay: "0.7s"  },
          ] as const).map((pos, i) => (
            <svg
              key={i}
              width={pos.size * 2}
              height={pos.size * 2}
              viewBox={`0 0 ${pos.size * 2} ${pos.size * 2}`}
              style={{ position: "absolute", ...pos, animation: `sparkPop 1.8s ease-in-out ${pos.delay} infinite` }}
            >
              <line x1={pos.size} y1="0" x2={pos.size} y2={pos.size * 2} stroke="#4caf50" strokeWidth="2" strokeLinecap="round" />
              <line x1="0" y1={pos.size} x2={pos.size * 2} y2={pos.size} stroke="#4caf50" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ))}

          <Image
            src="/icons/vaskafsluttet.png"
            alt="Vask afsluttet"
            width={120}
            height={120}
            style={{ position: "relative", zIndex: 1, width: 120, height: 120, objectFit: "contain" }}
          />
        </div>

        <p style={{ textAlign: "center", fontSize: 17, fontWeight: 700, color: "#111", margin: "0 0 14px" }}>
          Tak for i dag!
        </p>

        <div style={{ borderTop: "1px solid #e5e7eb", marginBottom: 14 }} />

        <p style={{ textAlign: "center", fontSize: 14, color: "#6b7280", lineHeight: 1.55, margin: "0 0 24px", whiteSpace: "pre-line" }}>
          {"Du kan finde kvitteringen\ninde på din profil."}
        </p>

        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={onReceipt}
            className="flex flex-1 h-12 items-center justify-center bg-(--brand-green-01) font-bold text-white text-sm [clip-path:polygon(0_0,100%_0,88%_100%,0_100%)]"
          >
            Se kvittering
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex flex-1 h-12 items-center justify-center bg-neutral-500 font-bold text-white text-sm [clip-path:polygon(12%_0,100%_0,100%_100%,0%_100%)]"
          >
            Luk
          </button>
        </div>
      </div>
    </>
  );
}
