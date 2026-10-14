import { useEffect, useRef, type ReactNode } from 'react';

/** Soft teal glows (x, y as a share of the area; radius as a share of its width; colour; strength). */
const GLOWS: [number, number, number, string, number][] = [
  [0.12, 0.1, 0.75, '47, 170, 148', 0.95],
  [0.55, 1.05, 0.65, '24, 96, 86', 0.9],
  [0.02, 0.95, 0.45, '120, 226, 204', 0.55],
];
/** How strongly each pixel's brightness is jittered (0..255): the film-grain texture. */
const GRAIN = 46;

/**
 * Grainy gradient ("برفک"), still: a few soft GlyNet-teal glows blended into each other, then every pixel
 * jittered for a fine film grain. Drawn once at one grain per CSS pixel.
 */
function GrainyGradient() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const width = Math.max(1, Math.round(canvas.clientWidth));
    const height = Math.max(1, Math.round(canvas.clientHeight));
    canvas.width = width;
    canvas.height = height;

    for (const [x, y, radius, rgb, strength] of GLOWS) {
      const glow = ctx.createRadialGradient(x * width, y * height, 0, x * width, y * height, radius * width);
      glow.addColorStop(0, `rgba(${rgb}, ${strength})`);
      glow.addColorStop(0.55, `rgba(${rgb}, ${strength * 0.35})`);
      glow.addColorStop(1, `rgba(${rgb}, 0)`);
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);
    }

    const image = ctx.getImageData(0, 0, width, height);
    const data = image.data;
    for (let i = 0; i < data.length; i += 4) {
      const jitter = (Math.random() - 0.5) * GRAIN;
      data[i] += jitter;
      data[i + 1] += jitter;
      data[i + 2] += jitter;
      data[i + 3] = Math.min(255, data[i + 3] * (0.75 + Math.random() * 0.5));
    }
    ctx.putImageData(image, 0, 0);
  }, []);

  return <canvas ref={ref} className="size-full" />;
}

/**
 * A page's title as a card, with a grainy teal gradient at its far end fading out toward the title (the new
 * header style, first used by the invite page).
 */
export function PageHero({ title, description, children }: { title: string; description?: ReactNode; children?: ReactNode }) {
  return (
    <section className="page-hero relative mb-6 overflow-hidden rounded-2xl bg-kumo-base ring ring-kumo-hairline">
      <div className="page-hero__static" aria-hidden>
        <GrainyGradient />
      </div>
      <div className="relative p-5 sm:p-6">
        <div className="max-w-[70%]">
          <h1 className="text-2xl font-extrabold tracking-tight text-kumo-default">{title}</h1>
          {description && <p className="mt-2 text-sm leading-6 text-kumo-subtle">{description}</p>}
        </div>
        {/* The page's key content (e.g. the wallet balance), full width under the title. */}
        {children}
      </div>
    </section>
  );
}
