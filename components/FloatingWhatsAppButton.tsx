"use client";

import { motion } from "framer-motion";
import { IoLogoWhatsapp } from "react-icons/io";
import { academyData } from "@/lib/academy";

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
          <IoLogoWhatsapp className="h-8 w-8 drop-shadow-[0_5px_12px_rgba(6,78,59,0.3)]" />
        </motion.span>
      </span>
    </motion.a>
  );
}
