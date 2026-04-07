import Image from "next/image";
import type { GalleryItem } from "@/lib/academy-cms";
import { VideoFrame } from "@/components/VideoFrame";

type GallerySectionProps = {
  gallery: GalleryItem[];
};

export function GallerySection({ gallery }: GallerySectionProps) {
  if (gallery.length === 0) {
    return null;
  }

  return (
    <section id="gallery" className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10">
      <div className="max-w-3xl">
        <p className="section-eyebrow text-sm uppercase tracking-[0.3em] text-sky-200/70">
          Gallery
        </p>
        <h2 className="mt-4 font-display text-4xl text-white sm:text-5xl">
          Media cards connected to your gallery endpoint.
        </h2>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {gallery.map((item) => (
          <article
            key={item.id}
            className="glass-panel overflow-hidden rounded-[28px] border border-white/10"
          >
            <div className="relative">
              {item.mediaType === "video" ? (
                <VideoFrame
                  src={item.assetUrl}
                  title={item.title}
                  className="aspect-[4/3] w-full border-0 object-cover"
                  controls
                  preload="metadata"
                  poster={item.thumbnailUrl || "/dance-poster.svg"}
                />
              ) : (
                <div className="relative aspect-[4/3]">
                  <Image
                    src={item.assetUrl}
                    alt={item.title}
                    fill
                    sizes="(max-width: 1280px) 50vw, 30vw"
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            <div className="p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="font-display text-2xl text-white">{item.title}</p>
                <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-slate-300">
                  {item.category}
                </span>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-300/80">
                {item.caption}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
