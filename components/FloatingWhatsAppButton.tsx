"use client";

import { motion } from "framer-motion";
import { academyData } from "@/lib/academy";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.11 17.41c-.28-.14-1.65-.81-1.91-.9-.26-.1-.44-.14-.63.14-.19.28-.72.9-.88 1.09-.16.19-.33.21-.61.07-.28-.14-1.18-.43-2.25-1.36-.83-.74-1.4-1.66-1.56-1.94-.16-.28-.02-.43.12-.57.13-.13.28-.33.42-.49.14-.16.19-.28.28-.47.09-.19.05-.35-.02-.49-.07-.14-.63-1.51-.87-2.07-.23-.55-.46-.47-.63-.48h-.54c-.19 0-.49.07-.74.35-.26.28-.98.96-.98 2.34 0 1.37 1 2.69 1.14 2.88.14.19 1.97 3 4.78 4.2.67.29 1.2.47 1.61.6.68.21 1.29.18 1.78.11.54-.08 1.65-.67 1.88-1.31.23-.63.23-1.18.16-1.31-.07-.12-.25-.19-.53-.33Z" />
      <path d="M16 3C8.82 3 3 8.73 3 15.8c0 2.25.59 4.46 1.72 6.41L3 29l7.02-1.82A13.13 13.13 0 0 0 16 28.6c7.18 0 13-5.73 13-12.8S23.18 3 16 3Zm0 23.5c-1.89 0-3.74-.5-5.36-1.46l-.38-.22-4.17 1.08 1.12-4.06-.25-.41A10.57 10.57 0 0 1 5.4 15.8C5.4 10.03 10.11 5.4 16 5.4c5.89 0 10.6 4.63 10.6 10.4 0 5.77-4.71 10.7-10.6 10.7Z" />
    </svg>
  );
}

export function FloatingWhatsAppButton() {
  const whatsAppUrl = `https://wa.me/${academyData.whatsAppNumber}?text=${encodeURIComponent(
    "Hello, I want to know more about the dance academy.",
  )}`;

  return (
    <motion.a
      href={whatsAppUrl}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, scale: 0.9, y: 18 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -6, scale: 1.05 }}
      className="group fixed bottom-6 right-6 z-50 sm:bottom-8 sm:right-8"
      aria-label="Chat on WhatsApp"
    >
      <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.42),transparent_34%),radial-gradient(circle_at_70%_78%,rgba(6,78,59,0.38),transparent_36%)] blur-[2px]" />
      <span className="absolute inset-[-8px] rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.34)_0%,rgba(34,197,94,0.08)_45%,transparent_70%)] opacity-90" />
      <span className="absolute inset-0 rounded-full border border-white/16 bg-[linear-gradient(145deg,rgba(74,222,128,0.92)_0%,rgba(37,211,102,0.96)_42%,rgba(5,150,105,0.98)_100%)] shadow-[0_22px_55px_rgba(34,197,94,0.34),inset_0_1px_0_rgba(255,255,255,0.34),inset_0_-10px_18px_rgba(4,47,46,0.2)] ring-1 ring-emerald-200/18 backdrop-blur" />
      <span className="absolute inset-[5px] rounded-full border border-white/14 bg-[linear-gradient(180deg,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0.03)_32%,rgba(255,255,255,0.02)_100%)]" />

      <span className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full">
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.42),transparent_42%)] opacity-80" />
        <motion.span
          className="relative z-10 flex items-center justify-center"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          <WhatsAppIcon className="h-8 w-8 drop-shadow-[0_5px_12px_rgba(6,78,59,0.3)]" />
        </motion.span>
      </span>
    </motion.a>
  );
}
