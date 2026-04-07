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

function buildInstagramEmbedUrl(url: URL) {
  const segments = url.pathname.split("/").filter(Boolean);
  const contentType = segments[0];
  const contentId = segments[1];

  if (
    (contentType === "reel" || contentType === "p" || contentType === "tv") &&
    contentId
  ) {
    return `https://www.instagram.com/${contentType}/${contentId}/embed/captioned/`;
  }

  return null;
}

function buildFacebookEmbedUrl(url: URL) {
  const host = url.hostname.toLowerCase();

  if (!host.includes("facebook.com") && !host.includes("fb.watch")) {
    return null;
  }

  return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
    url.toString(),
  )}&show_text=false&width=1280`;
}

export function resolveVideoEmbed(input: string): VideoEmbed {
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
        return {
          kind: "embed",
          provider: "youtube",
          src: `https://www.youtube.com/embed/${videoId}`,
        };
      }
    }

    if (host === "instagram.com") {
      const embedUrl = buildInstagramEmbedUrl(url);

      if (embedUrl) {
        return {
          kind: "embed",
          provider: "instagram",
          src: embedUrl,
        };
      }
    }

    if (host === "facebook.com" || host === "m.facebook.com" || host === "fb.watch") {
      const embedUrl = buildFacebookEmbedUrl(url);

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
