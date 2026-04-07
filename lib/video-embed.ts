const videoFilePattern =
  /\.(mp4|webm|ogg|mov|m4v)(?:$|[?#])/i;

type VideoEmbed =
  | {
      kind: "file";
      src: string;
    }
  | {
      kind: "embed";
      src: string;
      provider: "youtube" | "instagram" | "facebook";
    };

function extractYouTubeId(url: URL) {
  const host = url.hostname.toLowerCase();

  if (host === "youtu.be") {
    return url.pathname.split("/").filter(Boolean)[0] ?? null;
  }

  if (host.endsWith("youtube.com")) {
    if (url.pathname === "/watch") {
      return url.searchParams.get("v");
    }

    const segments = url.pathname.split("/").filter(Boolean);

    if (segments[0] === "shorts" || segments[0] === "embed") {
      return segments[1] ?? null;
    }
  }

  return null;
}

function buildInstagramEmbedUrl(url: URL, autoPlay?: boolean) {
  const segments = url.pathname.split("/").filter(Boolean);
  const contentType = segments[0];
  const contentId = segments[1];

  if (
    (contentType === "reel" || contentType === "p" || contentType === "tv") &&
    contentId
  ) {
    const embedUrl = new URL(
      `https://www.instagram.com/${contentType}/${contentId}/embed/captioned/`,
    );

    if (autoPlay) {
      embedUrl.searchParams.set("autoplay", "1");
    }

    return embedUrl.toString();
  }

  return null;
}

function buildFacebookEmbedUrl(url: URL, autoPlay?: boolean) {
  const host = url.hostname.toLowerCase();

  if (!host.includes("facebook.com") && !host.includes("fb.watch")) {
    return null;
  }

  const embedUrl = new URL("https://www.facebook.com/plugins/video.php");
  embedUrl.searchParams.set("href", url.toString());
  embedUrl.searchParams.set("show_text", "false");
  embedUrl.searchParams.set("width", "1280");

  if (autoPlay) {
    embedUrl.searchParams.set("autoplay", "true");
  }

  return embedUrl.toString();
}

export function resolveVideoEmbed(input: string, options?: { autoPlay?: boolean }): VideoEmbed {
  const value = input.trim();

  if (!value) {
    return {
      kind: "file",
      src: "",
    };
  }

  if (value.startsWith("/") || videoFilePattern.test(value)) {
    return {
      kind: "file",
      src: value,
    };
  }

  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase().replace(/^www\./, "");

    if (host === "youtube.com" || host === "youtu.be") {
      const videoId = extractYouTubeId(url);

      if (videoId) {
        const embedUrl = new URL(`https://www.youtube.com/embed/${videoId}`);

        if (options?.autoPlay) {
          embedUrl.searchParams.set("autoplay", "1");
          embedUrl.searchParams.set("mute", "1");
          embedUrl.searchParams.set("playsinline", "1");
          embedUrl.searchParams.set("rel", "0");
        }

        return {
          kind: "embed",
          provider: "youtube",
          src: embedUrl.toString(),
        };
      }
    }

    if (host === "instagram.com") {
      const embedUrl = buildInstagramEmbedUrl(url, options?.autoPlay);

      if (embedUrl) {
        return {
          kind: "embed",
          provider: "instagram",
          src: embedUrl,
        };
      }
    }

    if (host === "facebook.com" || host === "m.facebook.com" || host === "fb.watch") {
      const embedUrl = buildFacebookEmbedUrl(url, options?.autoPlay);

      if (embedUrl) {
        return {
          kind: "embed",
          provider: "facebook",
          src: embedUrl,
        };
      }
    }
  } catch {
    return {
      kind: "file",
      src: value,
    };
  }

  return {
    kind: "file",
    src: value,
  };
}
