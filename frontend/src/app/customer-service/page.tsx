// KundeservicePage – kundeserviceside med kontaktmuligheder og FAQ.
// Viser kontaktkort (ring, chat, nødsituation) og en sammenklappelig FAQ-sektion.
// Indholdet er defineret i supportData.ts og kan opdateres der uden at ændre siden.

"use client";

import { useState } from "react";
import {
  CarFront,
  MessageCircleMore,
  Minus,
  Phone,
  PhoneCall,
  Plus,
} from "lucide-react";

import PageInfo from "@/components/shared/PageInfo";
import {
  supportContactCards,
  supportFaqItems,
  supportPageContent,
} from "@/data/shared/supportData";
import type { SupportContactCard } from "@/data/shared/supportData";

const supportCardIcons = {
  call: Phone,
  message: MessageCircleMore,
  urgent: CarFront,
} as const;

export default function KundeservicePage() {
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  function toggleFaq(faqId: string) {
    setOpenFaqId((current) => (current === faqId ? null : faqId));
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageInfo text={supportPageContent.pageInfoTitle} userName="" />

      <main className="flex-1 overflow-y-auto scrollbar-hide px-5 pb-6 pt-3">
        <div className="max-w-76 pl-1">
          <p className="text-[1.05rem] font-bold leading-tight text-neutral-800">
            {supportPageContent.introTitle}
          </p>
          <p className="text-[1.05rem] font-bold leading-tight text-neutral-800">
            {supportPageContent.introSubtitle}
          </p>
        </div>

        <section className="mt-3 space-y-3.5">
          {supportContactCards.map((card) => (
            <SupportCard key={card.id} card={card} />
          ))}
        </section>

        <section className="mt-13">
          <h2 className="text-[1.15rem] font-bold text-neutral-800">
            {supportPageContent.faqTitle}
          </h2>

          <div className="mt-3 rounded-[3px] bg-(--white-white) shadow-[0_8px_18px_rgba(0,0,0,0.12)]">
            {supportFaqItems.map((item, index) => {
              const isOpen = openFaqId === item.id;

              return (
                <div
                  key={item.id}
                  className={
                    index < supportFaqItems.length - 1
                      ? "border-b border-[#d7d7d7]"
                      : ""
                  }
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(item.id)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left"
                  >
                    <span className="flex-1 text-[0.9rem] font-medium text-[#222]">
                      {item.question}
                    </span>
                    <span className="text-(--brand-green-01)">
                      {isOpen ? (
                        <Minus className="h-5 w-5" strokeWidth={3} />
                      ) : (
                        <Plus className="h-5 w-5" strokeWidth={3} />
                      )}
                    </span>
                  </button>

                  {isOpen ? (
                    <div className="px-4 pb-4 text-[0.82rem] leading-relaxed text-[#555]">
                      {item.answer}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

// Kort der viser én kontaktmulighed (ring, chat eller nødsituation).
// Nødsituationskortet (urgent) har rød farve og et opkaldsikon.
function SupportCard({ card }: { card: SupportContactCard }) {
  const Icon = supportCardIcons[card.actionType];
  const isUrgent = card.actionType === "urgent";

  return (
    <article className="overflow-hidden rounded-[3px] bg-(--white-white) shadow-[0_8px_18px_rgba(0,0,0,0.12)]">
      <div
        className={`flex items-start gap-4 px-4 ${isUrgent ? "pt-4 pb-3" : "py-2"}`}
      >
        <div
          className={`flex shrink-0 items-center justify-center rounded-full bg-(--brand-green-01) text-white ${isUrgent ? "h-13 w-13" : "h-12 w-12"}`}
        >
          <Icon
            className={`${isUrgent ? "h-6.5 w-6.5" : "h-6 w-6"}`}
            strokeWidth={2.6}
          />
        </div>

        <div className="min-w-0 flex-1 pt-0.5">
          <h3
            className={`font-bold text-[#1b1b1b] ${isUrgent ? "text-[1rem]" : "text-[1.05rem]"}`}
          >
            {card.title}
          </h3>
          {card.subtitle ? (
            <p
              className={`mt-1 ${isUrgent ? "text-[0.78rem] font-bold" : "text-[0.82rem] font-semibold"} text-[#9a9a9a]`}
            >
              {card.subtitle}
            </p>
          ) : null}
          {card.description ? (
            <p className="mt-1 max-w-56 text-[0.82rem] leading-snug text-[#6c6c6c]">
              {card.description}
            </p>
          ) : null}
        </div>
      </div>

      {isUrgent ? (
        <a
          href={card.href ?? "#"}
          className="ml-auto flex h-11 w-[74%] items-center justify-center gap-2 bg-[#d91515] text-[1.05rem] font-bold text-white [clip-path:polygon(18%_0,100%_0,100%_100%,0_100%)]"
        >
          <span>{card.actionLabel}</span>
          <PhoneCall className="h-5 w-5" strokeWidth={2.7} />
        </a>
      ) : (
        <div className="flex justify-end">
          <a
            href={card.href ?? "#"}
            className="flex h-8.5 w-[28%] items-center justify-center bg-(--brand-green-01) text-[0.9rem] font-bold text-white [clip-path:polygon(20%_0,100%_0,100%_100%,0_100%)]"
          >
            {card.actionLabel}
          </a>
        </div>
      )}
    </article>
  );
}
