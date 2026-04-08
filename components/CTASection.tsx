"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FaYoutube } from "react-icons/fa";
import { FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { IoLogoFacebook, IoLogoInstagram } from "react-icons/io";
import { academyData } from "@/lib/academy";
import {
  listContainerVariants,
  listItemVariants,
  sectionBodyVariants,
  sectionContentVariants,
  sectionHeadingVariants,
  sectionViewport,
} from "@/lib/animationVariants";

function SocialIcon({
  platform,
  className,
}: {
  platform: (typeof academyData.socialPlatforms)[number]["platform"];
  className?: string;
}) {
  switch (platform) {
    case "instagram":
      return <IoLogoInstagram className={className} />;
    case "facebook":
      return <IoLogoFacebook className={className} />;
    case "youtube":
      return <FaYoutube className={className} />;
    case "linkedin":
      return <FaLinkedinIn className={className} />;
    case "x":
      return <FaXTwitter className={className} />;
    case "onlyfans":
      return (
        <img
          src="/onlyfans-icon.png"
          alt="OnlyFans"
          className={`${className} rounded-full object-cover`}
        />
      );
    default:
      return null;
  }
}

function getSocialIconClass(platform: (typeof academyData.socialPlatforms)[number]["platform"]) {
  switch (platform) {
    case "instagram":
      return "group-hover:-translate-y-1.5 group-hover:rotate-[14deg] group-hover:scale-[1.22]";
    case "facebook":
      return "group-hover:-translate-y-1.5 group-hover:scale-[1.24]";
    case "youtube":
      return "group-hover:scale-[1.24] group-hover:translate-x-1 group-hover:-translate-y-0.5";
    case "linkedin":
      return "group-hover:-translate-y-1.5 group-hover:scale-[1.24]";
    case "x":
      return "group-hover:-translate-y-1.5 group-hover:-rotate-[10deg] group-hover:scale-[1.22]";
    case "onlyfans":
      return "group-hover:-translate-y-1 group-hover:scale-[1.2] group-hover:tracking-[0.08em]";
    default:
      return "";
  }
}

function getSocialBadgeClass(platform: (typeof academyData.socialPlatforms)[number]["platform"]) {
  switch (platform) {
    case "instagram":
      return "bg-[linear-gradient(135deg,rgba(249,206,52,0.95)_0%,rgba(238,42,123,0.92)_52%,rgba(98,40,215,0.95)_100%)] text-white";
    case "facebook":
      return "bg-[linear-gradient(135deg,rgba(24,119,242,0.98)_0%,rgba(64,93,230,0.92)_100%)] text-white";
    case "youtube":
      return "bg-[linear-gradient(135deg,rgba(255,61,61,0.98)_0%,rgba(199,0,0,0.92)_100%)] text-white";
    case "linkedin":
      return "bg-[linear-gradient(135deg,rgba(10,102,194,0.98)_0%,rgba(0,78,153,0.92)_100%)] text-white";
    case "x":
      return "bg-[linear-gradient(135deg,rgba(15,23,42,0.98)_0%,rgba(2,6,23,0.92)_100%)] text-white";
    case "onlyfans":
      return "bg-[linear-gradient(135deg,rgba(0,175,240,0.98)_0%,rgba(0,116,204,0.92)_100%)] text-white";
    default:
      return "bg-white text-slate-950";
  }
}

export function CTASection() {
  return (
    <section id="join" className="relative mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10">
      <div className="pointer-events-none absolute left-4 top-0 z-30 flex items-start gap-3 sm:left-8 sm:gap-5 lg:left-12">
        <div className="relative -top-10 h-28 w-28 sm:-top-12 sm:h-44 sm:w-44">
          <Image
            src="/all-gif/tom-running.gif"
            alt=""
            aria-hidden="true"
            fill
            unoptimized
            sizes="(max-width: 640px) 112px, 176px"
            className="object-contain drop-shadow-[0_12px_24px_rgba(15,23,42,0.22)]"
          />
        </div>
        <div className="relative -top-10 h-28 w-28 sm:-top-12 sm:h-44 sm:w-44">
          <Image
            src="/all-gif/jerry_running.gif"
            alt=""
            aria-hidden="true"
            fill
            unoptimized
            sizes="(max-width: 640px) 112px, 176px"
            className="object-contain drop-shadow-[0_12px_24px_rgba(15,23,42,0.22)]"
          />
        </div>
      </div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={sectionViewport}
        variants={sectionContentVariants}
        className="relative overflow-hidden rounded-[36px] border border-white/12 bg-[linear-gradient(135deg,rgba(8,47,73,0.95)_0%,rgba(29,78,216,0.9)_48%,rgba(14,165,233,0.86)_100%)] px-6 py-12 shadow-[0_0_55px_rgba(59,130,246,0.28)] sm:px-10 sm:py-14"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),_transparent_36%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.12),_transparent_34%)]" />

        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <motion.p
              variants={sectionHeadingVariants}
              className="section-eyebrow text-sm uppercase tracking-[0.3em] text-white/70"
            >
              Join Now
            </motion.p>
            <motion.h2
              variants={sectionHeadingVariants}
              className="mt-4 font-display text-4xl text-white sm:text-5xl"
            >
              Join Kolkata's One Of The Best Dance Academy Today.
            </motion.h2>
            <motion.p
              variants={sectionBodyVariants}
              className="mt-4 text-base leading-8 text-white/[0.82]"
            >
              Secure your spot at Danger Dance Academy and start training with a focused, high-energy team.
            </motion.p>
          </div>

          <motion.div variants={sectionBodyVariants} className="flex w-full max-w-3xl flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <motion.a
                href={`tel:${academyData.phone}`}
                className="inline-flex h-14 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-slate-950 shadow-[0_0_36px_rgba(255,255,255,0.28)] transition hover:scale-[1.02]"
                whileHover={{ y: -3, scale: 1.01 }}
              >
                Call Now
              </motion.a>
              <motion.div
                whileHover={{ y: -3 }}
                className="glass-pill inline-flex h-14 items-center justify-center rounded-full px-8 text-sm font-semibold text-white"
              >
                {academyData.phone}
              </motion.div>
            </div>

            <motion.div
              variants={sectionBodyVariants}
              className="glass-card rounded-[30px] p-4"
            >
              <p className="text-xs uppercase tracking-[0.26em] text-white/58">
                Follow Us
              </p>
              <motion.div
                variants={listContainerVariants}
                className="mt-4 grid gap-3 sm:grid-cols-2"
              >
                {academyData.socialPlatforms.map((item) => (
                  <motion.a
                    key={item.platform}
                    variants={listItemVariants}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    href={"href" in item ? item.href : undefined}
                    target="_blank"
                    rel="noreferrer"
                    className="glass-card group flex min-w-0 items-center gap-4 rounded-[24px] px-5 py-4 transition duration-300 hover:border-white/35 hover:bg-white/12 hover:shadow-[0_18px_38px_rgba(15,23,42,0.24)] will-change-transform sm:min-h-[5.75rem]"
                  >
                    <span
                      className={`flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full shadow-[0_10px_24px_rgba(15,23,42,0.28)] transition duration-300 group-hover:scale-[1.14] group-hover:shadow-[0_18px_34px_rgba(15,23,42,0.32)] sm:h-16 sm:w-16 ${getSocialBadgeClass(item.platform)}`}
                    >
                      <SocialIcon
                        platform={item.platform}
                        className={`h-6 w-6 transition duration-300 ease-out sm:h-7 sm:w-7 ${getSocialIconClass(item.platform)}`}
                      />
                    </span>
                    <span className="flex-1 whitespace-nowrap text-sm font-semibold uppercase tracking-[0.12em] text-white/86 transition duration-300 group-hover:translate-x-0.5 group-hover:text-white sm:text-[0.95rem]">
                      {item.label}
                    </span>
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
