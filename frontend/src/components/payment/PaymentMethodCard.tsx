// PaymentMethodCard – et valgkort for én betalingsmetode (fx MobilePay, kort eller wallet).
// Viser logo, navn og beskrivelse. En grøn ring og flueben indikerer det valgte alternativ.

import Image from "next/image";

export default function PaymentMethodCard({ method, selected, onClick }) {
  const isWallet = method.id === "wallet";

  return (
    <button
      type="button"
      className={`flex w-full items-center gap-3 rounded-[3px] bg-(--white-white) px-4 py-3 text-left shadow-md transition ${
        selected ? "ring-2 ring-(--brand-green-01)" : "ring-2 ring-transparent"
      }`}
      onClick={onClick}
    >
      <Image
        src={method.image}
        alt={method.title}
        width={48}
        height={48}
        className={`${isWallet ? "h-13 w-13" : "h-12 w-12"} shrink-0 object-contain`}
      />

      <div className="flex flex-1 min-w-0 flex-col">
        <h3 className="text-sm font-bold text-black">{method.title}</h3>
        <p className="text-xs text-gray-500">{method.description}</p>
      </div>

      <span className="inline-grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 border-(--brand-green-01)">
        {selected && (
          <span className="inline-grid h-full w-full place-items-center rounded-full bg-(--brand-green-01)">
            <svg
              viewBox="0 0 16 16"
              aria-hidden="true"
              className="h-2.5 w-2.5"
              fill="none"
            >
              <path
                d="M3.5 8.5L6.5 11.5L12.5 4.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              />
            </svg>
          </span>
        )}
      </span>
    </button>
  );
}