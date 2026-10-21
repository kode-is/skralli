"use client";

import Image from "next/image";
import { useState } from "react";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/motion/Reveal";
import { barGuide, lightKinds, machineNames, machinePhotos, type BarId } from "@/lib/fyrirokumannin";
import { DOT_PATTERN_STYLE, LIGHT_ICONS } from "./icons";

const CHIP = "inline-flex items-center rounded-full bg-[#f0f4fa] px-3 py-1.5 font-ui text-xs font-medium text-brand-dark";

/**
 * "Hvar fer boginn?": the five bar types as a list of buttons beside a dark
 * panel with a side-on photo of the machine the bar goes on. Every bar on
 * that machine is a numbered pin on the photo; the picked one glows yellow,
 * and its details sit below the photo. The pins are clickable too.
 */
export function BarGuide() {
  const [activeId, setActiveId] = useState<BarId>(barGuide.bars[0].id);
  const active = barGuide.bars.find((bar) => bar.id === activeId) ?? barGuide.bars[0];
  const photo = machinePhotos[active.machine];

  return (
    <section id={barGuide.id} className="scroll-mt-6 bg-white py-16 md:py-24">
      <Container>
        <Reveal as="h2" className="text-[32px] leading-[1.15] font-semibold text-[#171717] md:text-[50px] md:leading-[1.08]">
          {barGuide.heading}
        </Reveal>
        <Reveal as="p" delay={0.1} className="mt-3 max-w-2xl text-base leading-[1.65] text-[#444444] md:mt-4 md:text-lg">
          {barGuide.text}
        </Reveal>

        <div className="mt-10 grid gap-5 md:mt-14 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] md:gap-7">
          <ul className="grid grid-cols-1 content-start gap-2.5 min-[360px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-1 md:gap-3">
            {barGuide.bars.map((bar, index) => {
              const selected = bar.id === activeId;
              return (
                <li key={bar.id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(bar.id)}
                    aria-pressed={selected}
                    className={`flex h-full w-full items-center gap-2.5 rounded-[15px] border px-3 py-3 text-left sm:gap-3 sm:px-4 sm:py-3.5 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-mid md:gap-4 md:px-5 md:py-4 ${
                      selected
                        ? "border-brand-dark bg-brand-dark text-white"
                        : "border-[#E3E9F2] bg-white text-[#171717] hover:border-brand-dark"
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-ui text-xs font-semibold sm:h-8 sm:w-8 ${
                        selected ? "bg-accent-yellow text-[#171717]" : "bg-[#f0f4fa] text-brand-dark"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-ui text-[15px] font-semibold md:text-base">{bar.name}</span>
                      <span className={`mt-0.5 hidden text-[13px] md:block ${selected ? "text-white/70" : "text-[#6b7280]"}`}>
                        {bar.where}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="overflow-hidden rounded-[20px] bg-brand-dark text-white" style={DOT_PATTERN_STYLE}>
            <div className="flex items-center justify-between gap-4 px-6 pt-5 pb-4 md:px-8 md:pt-6">
              <p className="font-ui text-[11px] font-semibold tracking-[.12em] text-white/60 uppercase md:text-xs">
                {machineNames[active.machine]}
              </p>
              <p className="font-ui text-[11px] font-semibold tracking-[.12em] text-accent-yellow uppercase md:text-xs">{active.where}</p>
            </div>
            <div
              className="relative mx-4 overflow-hidden rounded-[14px] md:mx-6"
              style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
            >
              <Image
                key={photo.src}
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 768px) 55vw, 100vw"
                className="object-cover"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-[#00263d]/25" />
              {barGuide.bars.map((bar, index) =>
                bar.machine === active.machine ? (
                  <button
                    key={bar.id}
                    type="button"
                    onClick={() => setActiveId(bar.id)}
                    aria-label={bar.name}
                    aria-pressed={bar.id === activeId}
                    className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    style={{ left: `${bar.pin.x}%`, top: `${bar.pin.y}%` }}
                  >
                    {bar.id === activeId ? (
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 rounded-full bg-accent-yellow/60 motion-safe:animate-ping"
                      />
                    ) : null}
                    <span
                      className={`relative flex h-8 w-8 items-center justify-center rounded-full font-ui text-xs font-bold shadow-[0_2px_10px_rgba(0,0,0,0.45)] transition-colors duration-200 md:h-9 md:w-9 md:text-sm ${
                        bar.id === activeId
                          ? "bg-accent-yellow text-[#171717]"
                          : "border-2 border-white bg-brand-dark/80 text-white hover:bg-brand-dark"
                      }`}
                    >
                      {index + 1}
                    </span>
                  </button>
                ) : null,
              )}
            </div>
            <div className="px-6 pt-6 pb-7 md:px-8 md:pb-8" aria-live="polite">
              <h3 className="font-ui text-xl font-semibold md:text-2xl">{active.name}</h3>
              <p className="mt-2 max-w-xl text-[15px] leading-[1.6] text-white/80 md:text-base">{active.text}</p>
              <div className="mt-5 flex flex-wrap gap-x-8 gap-y-5">
                <div>
                  <p className="font-ui text-[11px] font-semibold tracking-[.12em] text-white/60 uppercase">{barGuide.lightsLabel}</p>
                  <ul className="mt-2.5 flex flex-wrap gap-2">
                    {active.lights.map((kind) => {
                      const Icon = LIGHT_ICONS[kind];
                      return (
                        <li
                          key={kind}
                          className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 font-ui text-xs font-medium text-white"
                        >
                          <Icon className="h-4 w-4 text-accent-yellow" />
                          {lightKinds[kind]}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div>
                  <p className="font-ui text-[11px] font-semibold tracking-[.12em] text-white/60 uppercase">{barGuide.fitsLabel}</p>
                  <ul className="mt-2.5 flex flex-wrap gap-1.5">
                    {active.fits.map((fit) => (
                      <li key={fit} className={CHIP}>
                        {fit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
