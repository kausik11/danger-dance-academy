import Image from "next/image";
import type { BlogItem } from "@/lib/academy-cms";

type BlogSectionProps = {
  posts: BlogItem[];
};

export function BlogSection({ posts }: BlogSectionProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section id="blog" className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10">
      <div className="max-w-3xl">
        <p className="text-sm uppercase tracking-[0.3em] text-sky-200/70">
          Blog
        </p>
        <h2 className="mt-4 font-display text-4xl text-white sm:text-5xl">
          Articles flowing into the site from your blog API.
        </h2>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {posts.map((post) => (
          <article
            key={post.id}
            className="glass-panel overflow-hidden rounded-[30px] border border-white/10"
          >
            <div className="grid gap-0 md:grid-cols-[0.86fr_1.14fr]">
              <div className="relative min-h-72">
                <Image
                  src={post.coverImageUrl}
                  alt={post.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 38vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.24em] text-slate-400">
                  <span>{post.author}</span>
                  <span>{post.readingTime}</span>
                </div>
                <h3 className="mt-4 font-display text-3xl text-white">
                  {post.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-slate-300/80">
                  {post.excerpt}
                </p>
                <p className="mt-4 text-sm leading-7 text-slate-400">
                  {post.content}
                </p>
                <p className="mt-6 text-xs uppercase tracking-[0.24em] text-cyan-100">
                  {new Date(post.publishedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
